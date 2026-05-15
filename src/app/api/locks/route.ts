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
import { calculateCredits, getCreditDurationDays } from '@/lib/lock';
import { WCB_MINT, WCB_TOKEN_DECIMALS } from '@/lib/tokenConfig';
import { buildHeliusRpcUrl } from '@/lib/server/helius';

function streamUrl(id: string) {
  return `https://app.streamflow.finance/contract/solana/mainnet/${id}`;
}

function lockedTokenAmount(stream: Stream) {
  return getNumberFromBN(stream.depositedAmount, WCB_TOKEN_DECIMALS);
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

  try {
    const client = new SolanaStreamClient(buildHeliusRpcUrl());
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

      const amount = lockedTokenAmount(stream);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      const startTs = stream.start;
      const endTs = stream.end;
      const durationDays = getCreditDurationDays(startTs, endTs);
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

    locks.sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return b.credits - a.credits;
    });
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
