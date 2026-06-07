'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import type { CreditBalance } from '@/types/betting';

async function fetchCreditBalance(wallet: string): Promise<CreditBalance> {
  const res = await fetch(`/api/credits?wallet=${encodeURIComponent(wallet)}`);
  const data = await res.json() as CreditBalance & { error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  return data;
}

export function useCreditBalance(wallet?: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: wallet ? queryKeys.credits.balance(wallet) : [],
    queryFn: () => {
      if (!wallet) throw new Error('wallet required');
      return fetchCreditBalance(wallet);
    },
    enabled: !!wallet,
    // Fast polling so the sidebar credit badge and balance displays
    // feel real-time as bets are placed or settled.
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  const invalidate = () => {
    if (wallet) {
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.balance(wallet) });
    }
  };

  return {
    balance: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    invalidate,
  };
}
