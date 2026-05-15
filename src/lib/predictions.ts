/**
 * Client-side prediction system for pre-launch market sentiment.
 *
 * All data lives in memory (no localStorage, no API).
 * This avoids ALL hydration mismatches.
 *
 * Baseline votes are seeded deterministically from matchId + FIFA rankings
 * so percentages look realistic from day 1.
 *
 * When user votes, the in-memory store updates and all subscribers re-render.
 */

export type PredictionChoice = 'home' | 'draw' | 'away';

export interface PredictionStats {
  matchId: number;
  totals: { home: number; draw: number; away: number };
  total: number;
  myChoice: PredictionChoice | null;
}

// In-memory store

interface Store {
  votes: Record<number, { home: number; draw: number; away: number }>;
  myVotes: Record<number, PredictionChoice>;
  listeners: Set<() => void>;
}

const store: Store = {
  votes: {},
  myVotes: {},
  listeners: new Set(),
};

function notify() {
  store.listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}

// Seed

/**
 * Deterministic baseline votes per match.
 * Stronger team (lower FIFA rank) gets more baseline votes.
 * Numbers are large enough to look like real community data.
 */
function seedFor(matchId: number, homeRank: number, awayRank: number) {
  const r = (matchId * 9301 + 49297) % 233280;
  const noise = r / 233280;

  const homeStrength = 100 - Math.min(homeRank, 100);
  const awayStrength = 100 - Math.min(awayRank, 100);
  const total = homeStrength + awayStrength;

  // Base percentages weighted by strength
  const homePct = Math.max(20, Math.min(65, Math.round(50 + ((homeStrength - awayStrength) / total) * 28 + (noise - 0.5) * 6)));
  const drawPct = Math.max(12, Math.min(30, Math.round(22 + noise * 6)));
  const awayPct = Math.max(20, 100 - homePct - drawPct);

  // Scale to realistic vote counts (800-2400 baseline).
  const scale = 800 + Math.round(noise * 1600);
  return {
    home: Math.round((homePct / 100) * scale),
    draw: Math.round((drawPct / 100) * scale),
    away: Math.round((awayPct / 100) * scale),
  };
}

function ensureSeeded(matchId: number, homeRank: number, awayRank: number) {
  if (!store.votes[matchId]) {
    store.votes[matchId] = seedFor(matchId, homeRank, awayRank);
  }
}

// Public API

export function getPrediction(
  matchId: number,
  homeRank = 50,
  awayRank = 50,
): PredictionStats {
  ensureSeeded(matchId, homeRank, awayRank);
  const totals = store.votes[matchId];
  return {
    matchId,
    totals,
    total: totals.home + totals.draw + totals.away,
    myChoice: store.myVotes[matchId] ?? null,
  };
}

export function castPrediction(
  matchId: number,
  choice: PredictionChoice,
  homeRank = 50,
  awayRank = 50,
): PredictionStats {
  ensureSeeded(matchId, homeRank, awayRank);

  // Remove previous vote
  const prev = store.myVotes[matchId];
  if (prev) {
    store.votes[matchId][prev] = Math.max(0, store.votes[matchId][prev] - 1);
  }

  // Add new vote
  store.votes[matchId][choice] += 1;
  store.myVotes[matchId] = choice;

  notify(); // trigger all subscribers to re-render
  return getPrediction(matchId, homeRank, awayRank);
}

export function toPercent(stats: PredictionStats): { home: number; draw: number; away: number } {
  const { home, draw, away } = stats.totals;
  const total = home + draw + away;
  if (total === 0) return { home: 33, draw: 34, away: 33 };
  // Ensure they sum to 100
  const h = Math.round((home / total) * 100);
  const d = Math.round((draw / total) * 100);
  const a = 100 - h - d;
  return { home: h, draw: d, away: a };
}

export function toPreviewOdds(percent: number): string {
  const safePercent = Math.max(1, Math.min(95, percent));
  const fairDecimal = 100 / safePercent;
  const previewPrice = fairDecimal * 0.96;
  return Math.max(1.05, Math.min(15, previewPrice)).toFixed(2);
}
