'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * usePredictionPoll
 *
 * Lightweight client-side prediction poll that persists votes in localStorage.
 * No real betting — votes are aggregated locally to show a community sentiment
 * percentage. Each match/group/bracket slot gets its own poll keyed by `pollId`.
 *
 * Generates a stable, plausible base count per pollId so first-load percentages
 * feel realistic (not 0/0). Once a user votes, their choice is stored and
 * counted toward the total.
 */

export type PollOption = 'home' | 'draw' | 'away' | string;

interface PollData {
  // counts per option
  counts: Record<string, number>;
  // user's selected option (if any)
  userChoice: string | null;
}

const STORAGE_PREFIX = 'wcb_poll_v1_';

/** Hash a string to a stable integer (used to seed plausible baseline counts) */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Generate plausible baseline vote counts derived from pollId for stability */
function generateBaseline(pollId: string, options: string[]): Record<string, number> {
  const seed = hashString(pollId);
  const result: Record<string, number> = {};
  let remaining = 1000 + (seed % 4000); // baseline 1000–5000 votes
  const weights = options.map((_, i) => {
    // pseudo-random weight using seed
    const w = ((seed >> (i * 3)) & 0xff) + 50;
    return w;
  });
  const totalW = weights.reduce((a, b) => a + b, 0);
  options.forEach((opt, i) => {
    if (i === options.length - 1) {
      result[opt] = remaining;
    } else {
      const share = Math.floor((weights[i] / totalW) * remaining);
      result[opt] = share;
      remaining -= share;
    }
  });
  return result;
}

function loadPoll(pollId: string, options: string[]): PollData {
  if (typeof window === 'undefined') {
    return { counts: generateBaseline(pollId, options), userChoice: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + pollId);
    if (!raw) {
      const baseline = generateBaseline(pollId, options);
      return { counts: baseline, userChoice: null };
    }
    const parsed = JSON.parse(raw) as PollData;
    // Ensure all options are present
    options.forEach((opt) => {
      if (typeof parsed.counts[opt] !== 'number') parsed.counts[opt] = 0;
    });
    return parsed;
  } catch {
    return { counts: generateBaseline(pollId, options), userChoice: null };
  }
}

function savePoll(pollId: string, data: PollData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + pollId, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

export interface UsePredictionPollResult {
  counts: Record<string, number>;
  total: number;
  percentages: Record<string, number>;
  userChoice: string | null;
  vote: (option: string) => void;
  reset: () => void;
}

export function usePredictionPoll(
  pollId: string,
  options: string[],
): UsePredictionPollResult {
  const [data, setData] = useState<PollData>(() => loadPoll(pollId, options));

  // Re-load if pollId changes
  useEffect(() => {
    setData(loadPoll(pollId, options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  const vote = useCallback(
    (option: string) => {
      setData((prev) => {
        // Already voted — switch the vote
        const counts = { ...prev.counts };
        if (prev.userChoice && counts[prev.userChoice] > 0) {
          counts[prev.userChoice]--;
        }
        counts[option] = (counts[option] ?? 0) + 1;
        const next: PollData = { counts, userChoice: option };
        savePoll(pollId, next);
        return next;
      });
    },
    [pollId],
  );

  const reset = useCallback(() => {
    setData((prev) => {
      const counts = { ...prev.counts };
      if (prev.userChoice && counts[prev.userChoice] > 0) {
        counts[prev.userChoice]--;
      }
      const next: PollData = { counts, userChoice: null };
      savePoll(pollId, next);
      return next;
    });
  }, [pollId]);

  const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  for (const opt of options) {
    percentages[opt] = total > 0 ? (data.counts[opt] / total) * 100 : 0;
  }

  return {
    counts: data.counts,
    total,
    percentages,
    userChoice: data.userChoice,
    vote,
    reset,
  };
}
