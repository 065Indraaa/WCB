'use client';

import { useQuery } from '@tanstack/react-query';
import { getPrizePoolMetrics } from '@/lib/api/prizepool';
import { queryKeys } from '@/lib/queryClient';

export function usePrizePoolMetrics() {
  return useQuery({
    queryKey: queryKeys.prizePool.metrics(),
    queryFn: getPrizePoolMetrics,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
