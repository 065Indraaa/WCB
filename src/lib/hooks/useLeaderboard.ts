'use client';
import { useQuery } from '@tanstack/react-query';
import { getTokenHolders } from '@/lib/api/helius';
import { queryKeys } from '@/lib/queryClient';

export function useLeaderboard(page = 1, limit = 100) {
  return useQuery({
    queryKey: queryKeys.leaderboard.page(page, limit),
    queryFn: () => getTokenHolders(page, limit),
    refetchInterval: 300_000,
  });
}
