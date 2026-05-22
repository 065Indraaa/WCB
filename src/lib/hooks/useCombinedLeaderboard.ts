'use client';

import { useMemo } from 'react';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { useCommunityLocks } from '@/lib/hooks/useCommunityLocks';
import { assignTier, assignBadges } from '@/lib/utils/tiers';
import { formatWallet } from '@/lib/utils/formatters';
import type { Tier, Badge } from '@/types/leaderboard';

export interface HolderEntry {
  rank: number;
  address: string;
  displayAddress: string;
  holdings: number;
  tier: Tier;
  badges: Badge[];
  isLocker: boolean;
}

export interface LockerEntry {
  rank: number;
  address: string;
  displayAddress: string;
  locked: number;
  credits: number;
  activeLocks: number;
  tier: string;
  isHolder: boolean;
}

export function useCombinedLeaderboard(limit = 10) {
  const { data: holderData, isLoading: holdersLoading, error: holderError } = useLeaderboard(1, 100);
  const { leaderboard: lockData, loading: locksLoading, error: lockError } = useCommunityLocks();

  const isLoading = holdersLoading || locksLoading;
  // Keep errors separate so one failing doesn't hide the other tab
  const holdersError = holderError ?? null;
  const lockersError = lockError ?? null;
  // Combined error only if BOTH fail
  const error = holdersError && lockersError ? holdersError : null;

  const lockerWallets = useMemo(
    () => new Set((lockData ?? []).map((l) => l.wallet)),
    [lockData],
  );

  const holderWallets = useMemo(
    () => new Set((holderData?.entries ?? []).map((h) => h.address)),
    [holderData],
  );

  const holderEntries = useMemo<HolderEntry[]>(() => {
    const list = (holderData?.entries ?? [])
      .slice(0, limit)
      .map((h, i) => ({
        rank: i + 1,
        address: h.address,
        displayAddress: h.displayAddress,
        holdings: h.holdings,
        tier: h.tier,
        badges: h.badges,
        isLocker: lockerWallets.has(h.address),
      }));
    return list;
  }, [holderData, lockerWallets, limit]);

  const lockerEntries = useMemo<LockerEntry[]>(() => {
    const list = (lockData ?? [])
      .slice(0, limit)
      .map((l, i) => ({
        rank: i + 1,
        address: l.wallet,
        displayAddress: l.displayWallet,
        locked: l.totalLocked,
        credits: l.totalCredits,
        activeLocks: l.activeLocks,
        tier: l.tier,
        isHolder: holderWallets.has(l.wallet),
      }));
    return list;
  }, [lockData, holderWallets, limit]);

  const totalHolders = holderData?.uniqueHolderWallets ?? holderData?.total ?? 0;
  const totalLockers = lockData?.length ?? 0;

  return {
    holderEntries,
    lockerEntries,
    isLoading,
    error,
    holdersError,
    lockersError,
    totalHolders,
    totalLockers,
  };
}
