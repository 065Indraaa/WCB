/**
 * Server-side credit balance computation.
 *
 * Calculates a wallet's credit balance by reading on-chain Streamflow locks
 * and subtracting credits locked in active bets.
 */

import { SolanaStreamClient, StreamType, getNumberFromBN, type Stream } from '@streamflow/stream';
import {
  calculateLockCredits,
  getLockCreditDurationDays,
  getLockCreditStartTimestamp,
  getLockUnlockTimestamp,
  isCreditEligibleLockSchedule,
} from '@/lib/lock';
import { WCB_MINT, WCB_TOKEN_DECIMALS } from '@/lib/tokenConfig';
import { buildHeliusRpcUrl } from '@/lib/server/helius';
import { getBetAccounting } from '@/lib/bettingStore';

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

function lockedTokenAmount(stream: Stream) {
  return getNumberFromBN(stream.depositedAmount, WCB_TOKEN_DECIMALS);
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

export async function computeCreditBalance(wallet: string) {
  let totalCredits = 0;

  try {
    const client = new SolanaStreamClient(buildHeliusRpcUrl());
    const streams = await fetchWalletStreams(client, wallet);
    const now = Math.floor(Date.now() / 1000);

    for (const item of streams) {
      const stream = item.account;
      if (!isWalletTokenLock(stream, wallet, now)) continue;

      const amount = lockedTokenAmount(stream);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      const schedule = {
        createdAt: stream.createdAt,
        start: stream.start,
        cliff: stream.cliff,
        end: stream.end,
      };
      if (!isCreditEligibleLockSchedule(schedule)) continue;

      totalCredits += calculateLockCredits(amount, schedule);
    }
  } catch (err) {
    // RPC / Streamflow lookup failed — return 0 on-chain credits.
    // The wallet can still use any settled bet net or existing credits.
    const message = err instanceof Error ? err.message : 'RPC lookup failed';
    console.warn('[computeCreditBalance] RPC/Streamflow error:', message);
  }

  const { lockedInBets, settledNet, totalRefunded } = await getBetAccounting(wallet);
  // Available = locked-derived credits, minus credits tied up in open bets,
  // plus the net result of already-settled bets (Rule 2: losses keep 20%).
  const availableCredits = Math.max(0, Math.round(totalCredits - lockedInBets + settledNet));

  return {
    wallet,
    totalCredits,
    availableCredits,
    lockedInBets,
    settledNet: Math.round(settledNet),
    totalRefunded: Math.round(totalRefunded),
  };
}
