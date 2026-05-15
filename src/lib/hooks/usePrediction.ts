'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getPrediction,
  castPrediction,
  subscribe,
  toPercent,
  toPreviewOdds,
  type PredictionChoice,
  type PredictionStats,
} from '@/lib/predictions';

/**
 * Hook that subscribes to the in-memory prediction store.
 * Re-renders automatically whenever any vote is cast (including from other cards).
 */
export function usePrediction(matchId: number, homeRank = 50, awayRank = 50) {
  // SSR-safe: start with null, populate after mount
  const [stats, setStats] = useState<PredictionStats | null>(null);

  const refresh = useCallback(() => {
    setStats(getPrediction(matchId, homeRank, awayRank));
  }, [matchId, homeRank, awayRank]);

  useEffect(() => {
    // Initial load
    refresh();
    // Subscribe to store changes
    const unsub = subscribe(refresh);
    return unsub;
  }, [refresh]);

  const vote = useCallback(
    (choice: PredictionChoice) => {
      castPrediction(matchId, choice, homeRank, awayRank);
      // store.notify() will call refresh() automatically
    },
    [matchId, homeRank, awayRank],
  );

  const pct = stats ? toPercent(stats) : { home: 33, draw: 34, away: 33 };
  const previewOdds = {
    home: toPreviewOdds(pct.home),
    draw: toPreviewOdds(pct.draw),
    away: toPreviewOdds(pct.away),
  };

  return {
    stats,
    pct,
    previewOdds,
    myChoice: stats?.myChoice ?? null,
    total: stats?.total ?? 0,
    vote,
    loaded: stats !== null,
  };
}
