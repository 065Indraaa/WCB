'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import type { Bet, PlaceBetResponse } from '@/types/betting';
import type { PredictionChoice } from '@/lib/predictions';

async function fetchBets(wallet: string): Promise<{ bets: Bet[]; balance: { availableCredits: number } }> {
  const res = await fetch(`/api/bets?wallet=${encodeURIComponent(wallet)}`);
  const data = await res.json() as { bets: Bet[]; balance: { availableCredits: number }; error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  return { bets: data.bets, balance: data.balance };
}

async function placeBetRequest(payload: {
  wallet: string;
  matchId: number;
  choice: PredictionChoice;
  amount: number;
  odds: string;
}): Promise<PlaceBetResponse> {
  const res = await fetch('/api/bets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json() as PlaceBetResponse;
  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  return data;
}

async function cancelBetRequest(wallet: string, betId: string): Promise<{ success: boolean; bet: Bet; balance: { availableCredits: number } }> {
  const res = await fetch(`/api/bets?wallet=${encodeURIComponent(wallet)}&id=${encodeURIComponent(betId)}`, {
    method: 'DELETE',
  });
  const data = await res.json() as { success: boolean; bet: Bet; balance: { availableCredits: number }; error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Server error ${res.status}`);
  }
  return data;
}

export function useBets(wallet?: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: wallet ? queryKeys.bets.list(wallet) : [],
    queryFn: () => {
      if (!wallet) throw new Error('wallet required');
      return fetchBets(wallet);
    },
    enabled: !!wallet,
    // Poll quickly on betting pages so credit balance, bet status,
    // and settlement notifications update in near real-time.
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  const placeBetMutation = useMutation({
    mutationFn: placeBetRequest,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.list(variables.wallet) });
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.balance(variables.wallet) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.leaderboard() });
    },
  });

  const cancelBetMutation = useMutation({
    mutationFn: ({ wallet: w, betId }: { wallet: string; betId: string }) => cancelBetRequest(w, betId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.list(variables.wallet) });
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.balance(variables.wallet) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.leaderboard() });
    },
  });

  const placeBet = (matchId: number, choice: PredictionChoice, amount: number, odds: string) => {
    if (!wallet) throw new Error('Wallet not connected');
    return placeBetMutation.mutateAsync({ wallet, matchId, choice, amount, odds });
  };

  const cancelBet = (betId: string) => {
    if (!wallet) throw new Error('Wallet not connected');
    return cancelBetMutation.mutateAsync({ wallet, betId });
  };

  return {
    bets: query.data?.bets ?? [],
    balanceSnapshot: query.data?.balance ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    placeBet,
    cancelBet,
    placing: placeBetMutation.isPending,
    cancelling: cancelBetMutation.isPending,
  };
}
