/**
 * Streamflow client-side integration.
 *
 * All Streamflow SDK calls happen server-side via /api/locks.
 * This file only contains the client-side fetch wrapper and types.
 */

import { calculateCredits } from '@/lib/lock';
import { WCB_STREAMFLOW_LOCK_DASHBOARD_URL } from '@/lib/tokenConfig';

export interface StreamflowLock {
  id: string;
  wallet: string;
  amount: number;
  startTs: number;
  endTs: number;
  durationDays: number;
  credits: number;
  isActive: boolean;
  mint: string;
  streamflowUrl: string;
}

/**
 * Fetch $WCB locks for a wallet via the /api/locks server route.
 * The server handles Streamflow SDK calls to avoid Node.js-only deps in browser.
 */
export async function fetchWalletLocks(
  walletAddress: string,
  _wcbMint: string,
): Promise<StreamflowLock[]> {
  if (!walletAddress) return [];

  const res = await fetch(`/api/locks?wallet=${encodeURIComponent(walletAddress)}`);
  const data = await res.json() as { locks: StreamflowLock[]; error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  if (data.error) {
    throw new Error(data.error);
  }
  return data.locks ?? [];
}

export function aggregateLockStats(locks: StreamflowLock[]) {
  const active = locks.filter((l) => l.isActive);
  return {
    totalLocked: active.reduce((s, l) => s + l.amount, 0),
    totalCredits: active.reduce((s, l) => s + l.credits, 0),
    activeLocks: active.length,
    longestDays: active.length > 0 ? Math.max(...active.map((l) => l.durationDays)) : 0,
  };
}

/**
 * Build a Streamflow lock URL pre-filled with $WCB parameters.
 * Uses the WCB token dashboard as the base so the user lands on the
 * correct token page; extra query params are appended for pre-fill
 * when Streamflow supports them.
 */
export function buildStreamflowLockUrl(params: {
  mint: string;
  amount: number;
  durationDays: number;
  senderWallet: string;
}): string {
  const decimals = 6;
  const amountRaw = Math.floor(params.amount * Math.pow(10, decimals));
  const endTs = Math.floor(Date.now() / 1000) + params.durationDays * 86400;

  const q = new URLSearchParams({
    amount: amountRaw.toString(),
    end: endTs.toString(),
    cancelableBySender: 'false',
    cancelableByRecipient: 'false',
    recipient: params.senderWallet,
  });

  return `${WCB_STREAMFLOW_LOCK_DASHBOARD_URL}&${q.toString()}`;
}
