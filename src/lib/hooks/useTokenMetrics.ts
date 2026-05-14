'use client';
import { useQuery } from '@tanstack/react-query';
import { getTokenMetrics } from '@/lib/api/coingecko';
import { queryKeys } from '@/lib/queryClient';

export function useTokenMetrics() {
  return useQuery({
    queryKey: queryKeys.token.metrics(),
    queryFn: getTokenMetrics,
    refetchInterval: 60_000,
  });
}
