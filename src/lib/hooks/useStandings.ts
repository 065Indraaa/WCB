'use client';
import { useQuery } from '@tanstack/react-query';
import { getGroupStandings } from '@/lib/api/livescore';
import { queryKeys } from '@/lib/queryClient';

export function useStandings(group?: string) {
  return useQuery({
    queryKey: queryKeys.standings.group(group),
    queryFn: () => getGroupStandings(group),
    refetchInterval: 300_000,
  });
}
