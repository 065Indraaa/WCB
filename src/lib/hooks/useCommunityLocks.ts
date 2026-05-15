'use client';

import { useState, useEffect } from 'react';
import { truncateAddress } from '@/lib/wallet';

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  displayWallet: string;
  holdings: number;
  totalLocked: number;
  totalCredits: number;
  activeLocks: number;
  tier: string;
  tierColor: string;
  tierTint: string;
  streamflowUrl: string;
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
  totalLocks: number;
}

export interface CommunityLockMeta {
  mint?: string;
  source?: string;
  streamflowDashboardUrl?: string;
}

function getTier(amount: number): { tier: string; color: string; tint: string } {
  if (amount >= 10_000_000) return { tier: 'Platinum', color: '#7C3AED', tint: '#EDE9FE' };
  if (amount >= 1_000_000)  return { tier: 'Gold',     color: '#D97706', tint: '#FEF3C7' };
  if (amount >= 100_000)    return { tier: 'Silver',   color: '#94A3B8', tint: '#E2E8F0' };
  return { tier: 'Bronze', color: '#CD7F32', tint: '#FCE7C8' };
}

export function useCommunityLocks() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totals, setTotals] = useState<CommunityTotals>({ totalLocked: 0, totalCredits: 0, totalLockers: 0, totalLocks: 0 });
  const [meta, setMeta] = useState<CommunityLockMeta>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch('/api/locks/community');
      const data = await res.json() as {
        leaderboard: Array<{
          rank: number;
          wallet: string;
          holdings: number;
          totalLocked: number;
          totalCredits: number;
          activeLocks: number;
          streamflowUrl: string;
          locks: LeaderboardEntry['locks'];
        }>;
        totals: CommunityTotals;
        mint?: string;
        source?: string;
        streamflowDashboardUrl?: string;
        error?: string;
      };

      if (data.error && (!data.leaderboard || data.leaderboard.length === 0)) {
        setError(data.error);
        return;
      }

      const entries: LeaderboardEntry[] = data.leaderboard.map((e) => {
        const { tier, color, tint } = getTier(e.holdings);
        return {
          ...e,
          displayWallet: truncateAddress(e.wallet, 6),
          tier,
          tierColor: color,
          tierTint: tint,
        };
      });

      setLeaderboard(entries);
      setTotals(data.totals);
      setMeta({
        mint: data.mint,
        source: data.source,
        streamflowDashboardUrl: data.streamflowDashboardUrl,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5 * 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { leaderboard, totals, meta, loading, error, refetch: fetchData };
}
