/**
 * Client-side prediction system for pre-launch market sentiment.
 *
 * Baseline market data is deterministic. User votes are persisted locally in
 * the browser so the preview feels stable across refreshes without requiring
 * a backend yet.
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

interface PersistedStore {
  votes?: Record<string, { home: number; draw: number; away: number }>;
  myVotes?: Record<string, PredictionChoice>;
}

const STORAGE_KEY = 'wcblive.predictions.v1';

const store: Store = {
  votes: {},
  myVotes: {},
  listeners: new Set(),
};
let hydrated = false;

function notify() {
  store.listeners.forEach((fn) => fn());
}

function isTotals(value: unknown): value is { home: number; draw: number; away: number } {
  return !!value && typeof value === 'object'
    && Number.isFinite((value as { home?: unknown }).home as number)
    && Number.isFinite((value as { draw?: unknown }).draw as number)
    && Number.isFinite((value as { away?: unknown }).away as number);
}

function hydrateStore() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as PersistedStore;

    if (parsed.votes) {
      Object.entries(parsed.votes).forEach(([matchId, totals]) => {
        const id = Number(matchId);
        if (Number.isFinite(id) && isTotals(totals)) {
          store.votes[id] = {
            home: Math.max(0, Math.round(totals.home)),
            draw: Math.max(0, Math.round(totals.draw)),
            away: Math.max(0, Math.round(totals.away)),
          };
        }
      });
    }

    if (parsed.myVotes) {
      Object.entries(parsed.myVotes).forEach(([matchId, choice]) => {
        const id = Number(matchId);
        if (Number.isFinite(id) && (choice === 'home' || choice === 'draw' || choice === 'away')) {
          store.myVotes[id] = choice;
        }
      });
    }
  } catch {
    // Ignore malformed local storage and keep the seeded preview.
  }
}

function persistStore() {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistedStore = {
      votes: Object.fromEntries(
        Object.entries(store.votes).map(([matchId, totals]) => [matchId, { ...totals }]),
      ),
      myVotes: { ...store.myVotes },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota/private mode failures.
  }
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
  hydrateStore();
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
  hydrateStore();
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
  hydrateStore();
  ensureSeeded(matchId, homeRank, awayRank);

  // Remove previous vote
  const prev = store.myVotes[matchId];
  if (prev) {
    store.votes[matchId][prev] = Math.max(0, store.votes[matchId][prev] - 1);
  }

  // Add new vote
  store.votes[matchId][choice] += 1;
  store.myVotes[matchId] = choice;

  persistStore();
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
