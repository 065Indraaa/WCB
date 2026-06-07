'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getPrediction,
  castPrediction,
  getMatchOdds,
  subscribe,
  toPercent,
  type PredictionChoice,
  type PredictionStats,
  type MatchOdds,
} from '@/lib/predictions';

interface UsePredictionResult {
  stats: PredictionStats | null;
  pct: { home: number; draw: number; away: number };
  previewOdds: { home: string; draw: string; away: string };
  odds: MatchOdds;
  myChoice: PredictionChoice | null;
  total: number;
  vote: (choice: PredictionChoice) => void;
  loaded: boolean;
}

/**
 * Hook that subscribes to the in-memory prediction store and
 * computes real sportsbook-grade odds with vig, drift, and movement.
 */
export function usePrediction(
  matchId: number,
  homeRank = 50,
  awayRank = 50,
  isHost = false,
  kickoff?: string,
): UsePredictionResult {
  const [stats, setStats] = useState<PredictionStats | null>(null);

  const refresh = useCallback(() => {
    setStats(getPrediction(matchId, homeRank, awayRank));
  }, [matchId, homeRank, awayRank]);

  useEffect(() => {
    refresh();
    const unsub = subscribe(refresh);
    return unsub;
  }, [refresh]);

  const vote = useCallback(
    (choice: PredictionChoice) => {
      castPrediction(matchId, choice, homeRank, awayRank);
    },
    [matchId, homeRank, awayRank],
  );

  const odds = useMemo(() => {
    return getMatchOdds(matchId, homeRank, awayRank, isHost, kickoff);
  }, [matchId, homeRank, awayRank, isHost, kickoff]);

  const pct = stats ? toPercent(stats) : { home: 33, draw: 34, away: 33 };

  // Legacy previewOdds for backward compat
  const previewOdds = {
    home: odds.home,
    draw: odds.draw,
    away: odds.away,
  };

  return {
    stats,
    pct,
    previewOdds,
    odds,
    myChoice: stats?.myChoice ?? null,
    total: stats?.total ?? 0,
    vote,
    loaded: stats !== null,
  };
}
