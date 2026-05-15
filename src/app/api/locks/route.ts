/**
 * GET /api/locks?wallet=<address>
 *
 * Wallet lock lookup for the configured $WCB mint.
 * Uses Streamflow's SDK search filters instead of manual account offsets.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { SolanaStreamClient, StreamType, getNumberFromBN, type Stream } from '@streamflow/stream';
import { calculateCredits } from '@/lib/lock';

const DEFAULT_WCB_MINT = 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || DEFAULT_WCB_MINT;
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? 6);

function buildRpcUrl() {
  if (!HELIUS_KEY || HELIUS_KEY === 'your_helius_api_key_here') {
    return 'https://api.mainnet-beta.solana.com';
  }

  if (HELIUS_RPC_URL.includes('api-key=')) return HELIUS_RPC_URL;
  const separator = HELIUS_RPC_URL.includes('?') ? '&' : HELIUS_RPC_URL.endsWith('/') ? '?' : '/?';
  return `${HELIUS_RPC_URL}${separator}api-key=${HELIUS_KEY}`;
}

function streamUrl(id: string) {
  return `https://app.streamflow.finance/stream/solana/mainnet/${id}`;
}

function tokenAmount(stream: Stream) {
  const remaining = stream.remaining(TOKEN_DECIMALS);
  if (Number.isFinite(remaining) && remaining > 0) return remaining;
  return getNumberFromBN(stream.depositedAmount, TOKEN_DECIMALS);
}

function isWalletTokenLock(stream: Stream, wallet: string, now: number) {
  return (
    stream.mint === WCB_MINT &&
    stream.type === StreamType.Lock &&
    !stream.closed &&
    stream.canceledAt === 0 &&
    stream.end > now &&
    (stream.recipient === wallet || stream.sender === wallet)
  );
}

async function fetchWalletStreams(client: SolanaStreamClient, wallet: string) {
  const [asRecipient, asSender] = await Promise.all([
    client.searchStreams({ mint: WCB_MINT, recipient: wallet, closed: false }),
    client.searchStreams({ mint: WCB_MINT, sender: wallet, closed: false }),
  ]);

  const byId = new Map<string, (typeof asRecipient)[number]>();
  for (const item of [...asRecipient, ...asSender]) {
    byId.set(item.publicKey.toBase58(), item);
  }
  return Array.from(byId.values());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'wallet parameter required', locks: [], total: 0 }, { status: 400 });
  }

  if (!WCB_MINT || WCB_MINT === 'your_token_contract_address_here') {
    return NextResponse.json({ locks: [], total: 0, source: 'not-configured' });
  }

  try {
    const client = new SolanaStreamClient(buildRpcUrl());
    const streams = await fetchWalletStreams(client, wallet);
    const now = Math.floor(Date.now() / 1000);
    const locks: Array<{
      id: string;
      wallet: string;
      sender: string;
      recipient: string;
      amount: number;
      startTs: number;
      endTs: number;
      durationDays: number;
      credits: number;
      isActive: boolean;
      mint: string;
      streamflowUrl: string;
    }> = [];

    for (const item of streams) {
      const stream = item.account;
      if (!isWalletTokenLock(stream, wallet, now)) continue;

      const amount = tokenAmount(stream);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      const startTs = stream.start;
      const endTs = stream.end;
      const durationDays = Math.max(1, Math.ceil((endTs - startTs) / 86_400));
      const id = item.publicKey.toBase58();

      locks.push({
        id,
        wallet: stream.sender,
        sender: stream.sender,
        recipient: stream.recipient,
        amount,
        startTs,
        endTs,
        durationDays,
        credits: calculateCredits(amount, durationDays),
        isActive: true,
        mint: stream.mint,
        streamflowUrl: streamUrl(id),
      });
    }

    locks.sort((a, b) => b.credits - a.credits);
    return NextResponse.json({
      locks,
      total: locks.length,
      mint: WCB_MINT,
      source: 'streamflow-sdk-searchStreams',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch locks';
    console.error('[/api/locks]', message);
    return NextResponse.json({ error: message, locks: [], total: 0 }, { status: 500 });
  }
}
