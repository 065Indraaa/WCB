'use client';

import { useEffect, useMemo, useReducer } from 'react';
import { computeOdds, type ComputedOdds } from '@/lib/oddsEngine';
import type { MatchDisplayStatus } from '@/types/match';

/* ================================================================
   Global 10-second ticker shared across all useOdds instances.
   One interval for the entire app — each hook just re-computes.
   ================================================================ */

const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let tickCount = 0;

function ensureTicker() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    tickCount++;
    listeners.forEach((fn) => fn());
  }, 10000);
}

export function useOdds(
  matchId: number,
  homeRank = 50,
  awayRank = 50,
  isHost = false,
  kickoff?: string,
  displayStatus?: MatchDisplayStatus,
  elapsed?: number
): ComputedOdds {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    ensureTicker();
    const cb = () => forceUpdate();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  const odds = useMemo(() => {
    return computeOdds(
      matchId,
      homeRank,
      awayRank,
      isHost,
      kickoff,
      displayStatus,
      elapsed
    );
    // tickCount is intentionally included to trigger recomputation every 10s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, homeRank, awayRank, isHost, kickoff, displayStatus, elapsed, tickCount]);

  return odds;
}
