'use client';

import { useMemo } from 'react';
import { useMatches } from './useMatches';
import { useBets } from './useBets';
import { useCreditBalance } from './useCreditBalance';
import type { Match } from '@/types/match';

export interface MenuCounts {
  live: number;
  upcoming: number;
  finished: number;
  total: number;
}

export interface RecentActivity {
  id: string;
  type: 'bet_placed' | 'bet_won' | 'bet_lost' | 'bet_cancelled';
  matchId: number;
  amount: number;
  timestamp: string;
  label: string;
}

function getMenuCounts(matches: Match[]): MenuCounts {
  let live = 0;
  let upcoming = 0;
  let finished = 0;
  for (const m of matches) {
    if (m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME') live++;
    else if (m.displayStatus === 'UPCOMING') upcoming++;
    else if (m.displayStatus === 'FINISHED') finished++;
  }
  return { live, upcoming, finished, total: matches.length };
}

function getTopLiveMatches(matches: Match[]): Match[] {
  return matches
    .filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME')
    .slice(0, 3);
}

function buildRecentActivity(bets: ReturnType<typeof useBets>['bets']): RecentActivity[] {
  return bets
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((bet) => {
      const typeMap: Record<string, RecentActivity['type']> = {
        pending: 'bet_placed',
        won: 'bet_won',
        lost: 'bet_lost',
        cancelled: 'bet_cancelled',
      };
      const labelMap: Record<string, string> = {
        pending: `Placed ${bet.choice} bet`,
        won: `Won ${bet.choice} bet`,
        lost: `Lost ${bet.choice} bet`,
        cancelled: `Cancelled ${bet.choice} bet`,
      };
      return {
        id: bet.id,
        type: typeMap[bet.status] ?? 'bet_placed',
        matchId: bet.matchId,
        amount: bet.amount,
        timestamp: bet.settledAt ?? bet.createdAt,
        label: labelMap[bet.status] ?? 'Bet update',
      };
    });
}

/**
 * Consolidated real-time hook for the live-bets sidebar menu.
 *
 * Fetches matches, bets, and credits with aggressive polling so the
 * sidebar badges and mini-widgets feel live.
 */
export function useLiveBettingMenu(wallet?: string | null) {
  const matchesQuery = useMatches({});
  const betsQuery = useBets(wallet);
  const creditsQuery = useCreditBalance(wallet);

  const matches = matchesQuery.data ?? [];
  const bets = betsQuery.bets;

  const counts = useMemo(() => getMenuCounts(matches), [matches]);
  const topLive = useMemo(() => getTopLiveMatches(matches), [matches]);
  const activeBetCount = useMemo(
    () => bets.filter((b) => b.status === 'pending').length,
    [bets],
  );
  const settledCount = useMemo(
    () => bets.filter((b) => b.status === 'won' || b.status === 'lost').length,
    [bets],
  );
  const recentActivity = useMemo(() => buildRecentActivity(bets), [bets]);

  const hasNewSettlements = settledCount > 0;

  return {
    counts,
    topLive,
    activeBetCount,
    settledCount,
    hasNewSettlements,
    recentActivity,
    credits: creditsQuery.balance,
    creditsLoading: creditsQuery.loading,
    matchesLoading: matchesQuery.isLoading,
    betsLoading: betsQuery.loading,
    refetchMatches: matchesQuery.refetch,
    refetchBets: betsQuery.refetch,
    refetchCredits: creditsQuery.refetch,
  };
}
