'use client';

import { useState, useEffect } from 'react';
import { formatTokenAmount, formatCredits, getTierForDays } from '@/lib/lock';
import { truncateAddress } from '@/lib/wallet';

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  displayWallet: string;
  totalLocked: number;
  totalCredits: number;
  activeLocks: number;
  tier: string;
  tierColor: string;
  locks: Array<{
    id: string;
    amount: number;
    durationDays: number;
    credits: number;
    isActive: boolean;
    endTs: number;
    streamflowUrl: string;
  }>;
}

export interface CommunityTotals {
  totalLocked: number;
  totalCredits: number;
  totalLockers: number;
}

function getTierFromAmount(amount: number): { tier: string; color: string } {
  if (amount >= 10_000_000) return { tier: 'Platinum', color: '#7C3AED' };
  if (amount >= 1_000_000)  return { tier: 'Gold',     color: '#D97706' };
  if (amount >= 100_000)    return { tier: 'Silver',   color: '#94A3B8' };
  return { tier: 'Bronze', color: '#CD7F32' };
}

export function useCommunityLocks() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totals, setTotals] = useState<CommunityTotals>({ totalLocked: 0, totalCredits: 0, totalLockers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch('/api/locks/community');
      const data = await res.json() as {
        leaderboard: Array<{
          rank: number;
          wallet: string;
          totalLocked: number;
          totalCredits: number;
          activeLocks: number;
          locks: LeaderboardEntry['locks'];
        }>;
        totals: CommunityTotals;
        error?: string;
        _debug?: Record<string, unknown>;
      };

      // Log debug info in dev
      if (data._debug) console.info('[Leaderboard debug]', data._debug);

      if (!res.ok || data.error) {
        // Return empty leaderboard with error message — don't crash the page
        console.error('[Leaderboard]', data.error);
        setError(data.error ?? 'Failed to load leaderboard');
        setLeaderboard([]);
        setTotals({ totalLocked: 0, totalCredits: 0, totalLockers: 0 });
        return;
      }

      const entries: LeaderboardEntry[] = data.leaderboard.map((e) => {
        const { tier, color } = getTierFromAmount(e.totalLocked);
        return {
          ...e,
          displayWallet: truncateAddress(e.wallet, 6),
          tier,
          tierColor: color,
        };
      });

      setLeaderboard(entries);
      setTotals(data.totals);
    } catch (err) {
      console.error(err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // Refresh every 5 minutes
    const id = setInterval(fetch, 5 * 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { leaderboard, totals, loading, error, refetch: fetch };
}
