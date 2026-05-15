/**
 * GET /api/locks/community
 *
 * Community lock leaderboard for the configured $WCB mint.
 * Data is sourced through the official Streamflow Solana SDK so the wallet
 * list follows Streamflow account decoding instead of local offset guesses.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { SolanaStreamClient, StreamType, getNumberFromBN, type Stream } from '@streamflow/stream';
import { calculateCredits } from '@/lib/lock';

const DEFAULT_WCB_MINT = 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || DEFAULT_WCB_MINT;
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? 6);

type StreamflowLock = {
  id: string;
  wallet: string;
  sender: string;
  recipient: string;
  amount: number;
  durationDays: number;
  credits: number;
  isActive: boolean;
  startTs: number;
  endTs: number;
  streamflowUrl: string;
};

type WalletLocks = {
  wallet: string;
  locks: StreamflowLock[];
};

function buildRpcUrl() {
  if (!HELIUS_KEY || HELIUS_KEY === 'your_helius_api_key_here') {
    return 'https://api.mainnet-beta.solana.com';
  }

  if (HELIUS_RPC_URL.includes('api-key=')) return HELIUS_RPC_URL;
  const separator = HELIUS_RPC_URL.includes('?') ? '&' : HELIUS_RPC_URL.endsWith('/') ? '?' : '/?';
  return `${HELIUS_RPC_URL}${separator}api-key=${HELIUS_KEY}`;
}

function dashboardUrl() {
  return `https://app.streamflow.finance/token-dashboard/solana/mainnet/${WCB_MINT}?type=lock`;
}

function streamUrl(id: string) {
  return `https://app.streamflow.finance/stream/solana/mainnet/${id}`;
}

function tokenAmount(stream: Stream) {
  const remaining = stream.remaining(TOKEN_DECIMALS);
  if (Number.isFinite(remaining) && remaining > 0) return remaining;
  return getNumberFromBN(stream.depositedAmount, TOKEN_DECIMALS);
}

function isActiveTokenLock(stream: Stream, now: number) {
  return (
    stream.mint === WCB_MINT &&
    stream.type === StreamType.Lock &&
    !stream.closed &&
    stream.canceledAt === 0 &&
    stream.end > now
  );
}

export async function GET() {
  if (!WCB_MINT || WCB_MINT === 'your_token_contract_address_here') {
    return NextResponse.json({
      leaderboard: [],
      totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 },
      source: 'not-configured',
    });
  }

  try {
    const client = new SolanaStreamClient(buildRpcUrl());
    const streams = await client.searchStreams({ mint: WCB_MINT, closed: false });
    const now = Math.floor(Date.now() / 1000);
    const byWallet = new Map<string, WalletLocks>();

    for (const item of streams) {
      const stream = item.account;
      if (!isActiveTokenLock(stream, now)) continue;

      const amount = tokenAmount(stream);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      const id = item.publicKey.toBase58();
      const wallet = stream.sender;
      const durationDays = Math.max(1, Math.ceil((stream.end - stream.start) / 86_400));
      const lock: StreamflowLock = {
        id,
        wallet,
        sender: stream.sender,
        recipient: stream.recipient,
        amount,
        durationDays,
        credits: calculateCredits(amount, durationDays),
        isActive: true,
        startTs: stream.start,
        endTs: stream.end,
        streamflowUrl: streamUrl(id),
      };

      const walletLocks = byWallet.get(wallet) ?? { wallet, locks: [] };
      walletLocks.locks.push(lock);
      byWallet.set(wallet, walletLocks);
    }

    const leaderboard = Array.from(byWallet.values())
      .map((entry) => {
        const sortedLocks = [...entry.locks].sort((a, b) => b.credits - a.credits);
        const totalLocked = sortedLocks.reduce((sum, lock) => sum + lock.amount, 0);
        const totalCredits = sortedLocks.reduce((sum, lock) => sum + lock.credits, 0);

        return {
          rank: 0,
          wallet: entry.wallet,
          displayWallet: `${entry.wallet.slice(0, 6)}...${entry.wallet.slice(-6)}`,
          holdings: totalLocked,
          totalLocked,
          totalCredits,
          activeLocks: sortedLocks.length,
          locks: sortedLocks.slice(0, 3),
          streamflowUrl: sortedLocks[0]?.streamflowUrl ?? dashboardUrl(),
        };
      })
      .sort((a, b) => {
        if (b.totalCredits !== a.totalCredits) return b.totalCredits - a.totalCredits;
        return b.totalLocked - a.totalLocked;
      });

    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const totals = {
      totalLocked: leaderboard.reduce((sum, entry) => sum + entry.totalLocked, 0),
      totalCredits: leaderboard.reduce((sum, entry) => sum + entry.totalCredits, 0),
      totalLockers: leaderboard.length,
    };

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 100),
      totals,
      mint: WCB_MINT,
      streamflowDashboardUrl: dashboardUrl(),
      source: 'streamflow-sdk-searchStreams',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/locks/community]', message);
    return NextResponse.json(
      {
        leaderboard: [],
        totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 },
        mint: WCB_MINT,
        source: 'streamflow-sdk-searchStreams',
        error: message,
      },
      { status: 500 },
    );
  }
}
