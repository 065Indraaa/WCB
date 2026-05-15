import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,           // 30 seconds
      gcTime: 5 * 60_000,          // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000), // exponential backoff, max 30s
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  matches: {
    all: ['matches'] as const,
    list: (params: { date?: string; status?: string; league?: number }) =>
      ['matches', 'list', params] as const,
  },
  standings: {
    all: ['standings'] as const,
    group: (group?: string) => ['standings', 'group', group] as const,
  },
  topScorers: {
    all: ['topScorers'] as const,
    byType: (type: string) => ['topScorers', type] as const,
  },
  token: {
    all: ['token'] as const,
    metrics: () => ['token', 'metrics'] as const,
  },
  prizePool: {
    all: ['prizePool'] as const,
    metrics: () => ['prizePool', 'metrics'] as const,
  },
  leaderboard: {
    all: ['leaderboard'] as const,
    page: (page: number, limit: number) => ['leaderboard', 'page', page, limit] as const,
  },
} as const;
