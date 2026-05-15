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
import { WCB_MINT, WCB_STREAMFLOW_LOCK_DASHBOARD_URL, WCB_TOKEN_DECIMALS } from '@/lib/tokenConfig';
import { buildHeliusRpcUrl } from '@/lib/server/helius';

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

function dashboardUrl() {
  return WCB_STREAMFLOW_LOCK_DASHBOARD_URL;
}

function streamUrl(id: string) {
  return `https://app.streamflow.finance/contract/solana/mainnet/${id}`;
}

function tokenAmount(stream: Stream) {
  const remaining = stream.remaining(WCB_TOKEN_DECIMALS);
  if (Number.isFinite(remaining) && remaining > 0) return remaining;
  return getNumberFromBN(stream.depositedAmount, WCB_TOKEN_DECIMALS);
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
  try {
    const client = new SolanaStreamClient(buildHeliusRpcUrl());
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
        const sortedLocks = [...entry.locks].sort((a, b) => {
          if (b.amount !== a.amount) return b.amount - a.amount;
          return b.credits - a.credits;
        });
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
        if (b.totalLocked !== a.totalLocked) return b.totalLocked - a.totalLocked;
        return b.totalCredits - a.totalCredits;
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
