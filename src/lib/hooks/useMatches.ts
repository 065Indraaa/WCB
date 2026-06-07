'use client';
import { useQuery } from '@tanstack/react-query';
import { getMatches } from '@/lib/api/livescore';
import { getAllStaticMatches } from '@/lib/utils/staticMatches';
import { queryKeys } from '@/lib/queryClient';
import type { MatchStatus } from '@/types/match';

interface UseMatchesParams {
  date?: string;
  status?: MatchStatus;
  league?: number;
}

async function getMatchesWithFallback(params: UseMatchesParams = {}) {
  try {
    const matches = await getMatches(params);
    // Fallback to static schedule if API returns empty (no API key configured)
    if (Array.isArray(matches) && matches.length > 0) {
      return matches;
    }
  } catch {
    // API error — fall through to static data
  }
  return getAllStaticMatches();
}

export function useMatches(params: UseMatchesParams = {}) {
  const isLiveFilter =
    params.status === '1H' || params.status === 'HT' || params.status === '2H';
  return useQuery({
    queryKey: queryKeys.matches.list(params),
    queryFn: () => getMatchesWithFallback(params),
    // Aggressive polling on betting pages so scores, status, and odds feel live.
    refetchInterval: isLiveFilter ? 15_000 : 60_000,
    staleTime: 10_000,
  });
}
