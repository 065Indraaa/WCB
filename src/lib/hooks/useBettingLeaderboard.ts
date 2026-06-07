'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';

export interface BettingLeaderboardEntry {
  wallet: string;
  totalBets: number;
  won: number;
  lost: number;
  cancelled: number;
  winRate: number;
  totalProfit: number;
  totalWagered: number;
  biggestWin: number;
}

async function fetchBettingLeaderboard(): Promise<{ leaderboard: BettingLeaderboardEntry[] }> {
  const res = await fetch('/api/bets/leaderboard');
  const data = await res.json() as { leaderboard: BettingLeaderboardEntry[]; error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  return data;
}

export function useBettingLeaderboard() {
  return useQuery({
    queryKey: queryKeys.bets.leaderboard(),
    queryFn: fetchBettingLeaderboard,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}
