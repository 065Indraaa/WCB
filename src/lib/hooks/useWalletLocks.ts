'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchWalletLocks, aggregateLockStats, type StreamflowLock } from '@/lib/streamflow';
import { WCB_MINT } from '@/lib/wallet';

export interface WalletLocksState {
  locks: StreamflowLock[];
  stats: ReturnType<typeof aggregateLockStats>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const EMPTY_STATS = {
  totalLocked: 0,
  totalCredits: 0,
  activeLocks: 0,
  longestDays: 0,
};

export function useWalletLocks(): WalletLocksState {
  const { publicKey, connected } = useWallet();
  const [locks, setLocks] = useState<StreamflowLock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!connected || !publicKey) {
      setLocks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWalletLocks(publicKey.toBase58(), WCB_MINT);
      setLocks(result);
    } catch (err) {
      setError('Failed to load locks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    locks,
    stats: aggregateLockStats(locks),
    loading,
    error,
    refetch: fetch,
  };
}
