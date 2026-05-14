'use client';
import { useQuery } from '@tanstack/react-query';
import { getMatches } from '@/lib/api/livescore';
import { queryKeys } from '@/lib/queryClient';
import type { MatchStatus } from '@/types/match';

interface UseMatchesParams {
  date?: string;
  status?: MatchStatus;
  league?: number;
}

export function useMatches(params: UseMatchesParams = {}) {
  const isLiveFilter =
    params.status === '1H' || params.status === 'HT' || params.status === '2H';
  return useQuery({
    queryKey: queryKeys.matches.list(params),
    queryFn: () => getMatches(params),
    refetchInterval: isLiveFilter ? 60_000 : 300_000,
  });
}
