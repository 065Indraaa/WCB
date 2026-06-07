/**
 * Sportsbook-grade odds engine for WCB Live Markets.
 *
 * Odds are derived from:
 *  1. True probability model (FIFA ranking, home advantage, team strength)
 *  2. Vig/margin overlay (7% typical book margin)
 *  3. Time-based micro-fluctuation (simulates live market movement)
 *  4. Community sentiment drift (user votes nudge the line)
 *
 * This produces realistic decimal odds that shift over time,
 * just like a real sportsbook.
 */

export type PredictionChoice = 'home' | 'draw' | 'away';

export interface PredictionStats {
  matchId: number;
  totals: { home: number; draw: number; away: number };
  total: number;
  myChoice: PredictionChoice | null;
}

export interface MatchOdds {
  home: string;
  draw: string;
  away: string;
  implied: { home: number; draw: number; away: number };
  vig: number;
  movement: { home: 'up' | 'down' | 'flat'; draw: 'up' | 'down' | 'flat'; away: 'up' | 'down' | 'flat' };
}

/* ================================================================
   In-memory sentiment store (user votes)
   ================================================================ */

interface Store {
  votes: Record<number, { home: number; draw: number; away: number }>;
  myVotes: Record<number, PredictionChoice>;
  listeners: Set<() => void>;
}

interface PersistedStore {
  votes?: Record<string, { home: number; draw: number; away: number }>;
  myVotes?: Record<string, PredictionChoice>;
}

const STORAGE_KEY = 'wcblive.predictions.v2';

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
    // ignore
  }
}

function persistStore() {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistedStore = {
      votes: Object.fromEntries(Object.entries(store.votes).map(([k, v]) => [k, { ...v }])),
      myVotes: { ...store.myVotes },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function subscribe(fn: () => void): () => void {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}

/* ================================================================
   True Probability Model
   ================================================================ */

function trueProbability(homeRank: number, awayRank: number, isHost: boolean): { home: number; draw: number; away: number } {
  // Convert ranking to strength (lower rank = higher strength)
  const homeStrength = Math.max(5, 105 - homeRank);
  const awayStrength = Math.max(5, 105 - awayRank);

  // Home advantage ~+12% win probability for hosts
  const homeBoost = isHost ? 0.12 : 0.08; // all teams get +8%, hosts extra +4%

  // Raw win probability based on strength ratio
  const total = homeStrength + awayStrength;
  let homeWin = (homeStrength / total) * (1 - homeBoost) + homeBoost;
  let awayWin = (awayStrength / total) * (1 - homeBoost);

  // Draw probability: higher when teams are closely matched
  const diff = Math.abs(homeStrength - awayStrength) / total;
  let draw = 0.25 + (0.10 * (1 - diff)); // 25-35% draw rate

  // Normalize
  const sum = homeWin + draw + awayWin;
  homeWin /= sum;
  draw /= sum;
  awayWin /= sum;

  return { home: homeWin, draw, away: awayWin };
}

/* ================================================================
   Seeded noise (deterministic per match)
   ================================================================ */

function seededNoise(matchId: number, offset = 0): number {
  const x = Math.sin(matchId * 9301 + offset * 49297) * 10000;
  return x - Math.floor(x);
}

/* ================================================================
   Time-based market drift
   Odds fluctuate slightly every few minutes to simulate live book
   ================================================================ */

function timeDrift(matchId: number, kickoff: string): number {
  const now = Date.now();
  const ko = new Date(kickoff).getTime();
  const minutesUntil = (ko - now) / 60000;

  // Market becomes more volatile closer to kickoff
  const volatility = minutesUntil > 0 && minutesUntil < 1440
    ? 1 + (1 - minutesUntil / 1440) * 2  // up to 3x volatility on matchday
    : 1;

  // 5-minute buckets
  const bucket = Math.floor(now / 300000);
  const drift = (seededNoise(matchId, bucket) - 0.5) * 0.06 * volatility; // ±3% baseline, up to ±9% near kickoff
  return drift;
}

/* ================================================================
   Sentiment drift from user votes
   ================================================================ */

function sentimentDrift(matchId: number, homeRank: number, awayRank: number): { home: number; draw: number; away: number } {
  hydrateStore();
  if (!store.votes[matchId]) return { home: 0, draw: 0, away: 0 };

  const { home, draw, away } = store.votes[matchId];
  const total = home + draw + away;
  if (total < 50) return { home: 0, draw: 0, away: 0 };

  const sentimentHome = home / total;
  const sentimentDraw = draw / total;
  const sentimentAway = away / total;

  // Compare sentiment to true probability baseline
  const base = trueProbability(homeRank, awayRank, false);
  const driftHome = (sentimentHome - base.home) * 0.08;  // sentiment moves line up to 8%
  const driftDraw = (sentimentDraw - base.draw) * 0.05;
  const driftAway = (sentimentAway - base.away) * 0.08;

  return { home: driftHome, draw: driftDraw, away: driftAway };
}

/* ================================================================
   Odds Engine: combine everything into final decimal odds
   ================================================================ */

const VIG = 0.072; // 7.2% margin (typical retail sportsbook)

function applyVig(probs: { home: number; draw: number; away: number }, margin: number): { home: number; draw: number; away: number } {
  // Proportional vig: each outcome pays slightly worse than fair
  const fairSum = probs.home + probs.draw + probs.away;
  const viggedSum = fairSum * (1 + margin);
  return {
    home: probs.home / viggedSum,
    draw: probs.draw / viggedSum,
    away: probs.away / viggedSum,
  };
}

function probToDecimal(prob: number): string {
  const decimal = 1 / Math.max(0.01, Math.min(0.99, prob));
  // Round to 2 decimals, but ensure sensible bounds
  const clamped = Math.max(1.01, Math.min(50, decimal));
  return clamped.toFixed(2);
}

function calcMovement(current: number, baseline: number): 'up' | 'down' | 'flat' {
  const delta = current - baseline;
  if (delta > 0.015) return 'up';   // odds lengthened (less likely)
  if (delta < -0.015) return 'down'; // odds shortened (more likely)
  return 'flat';
}

/** Public: get current sportsbook odds for a match. */
export function getMatchOdds(
  matchId: number,
  homeRank = 50,
  awayRank = 50,
  isHost = false,
  kickoff = new Date().toISOString(),
): MatchOdds {
  // 1. True probability
  const base = trueProbability(homeRank, awayRank, isHost);

  // 2. Time drift
  const tDrift = timeDrift(matchId, kickoff);

  // 3. Sentiment drift
  const sDrift = sentimentDrift(matchId, homeRank, awayRank);

  // Combine (cap each at ±0.12 to prevent absurd lines)
  let homeProb = base.home + tDrift + sDrift.home;
  let drawProb = base.draw + (tDrift * 0.3) + sDrift.draw; // draw less volatile
  let awayProb = base.away - tDrift + sDrift.away;

  // Clamp individual probs
  homeProb = Math.max(0.08, Math.min(0.75, homeProb));
  awayProb = Math.max(0.08, Math.min(0.75, awayProb));
  drawProb = Math.max(0.12, Math.min(0.40, drawProb));

  // Re-normalize
  const sum = homeProb + drawProb + awayProb;
  homeProb /= sum;
  drawProb /= sum;
  awayProb /= sum;

  // 4. Apply vig
  const vigged = applyVig({ home: homeProb, draw: drawProb, away: awayProb }, VIG);

  // 5. Baseline (for movement calc) = true prob with vig, no drift
  const baselineVigged = applyVig(base, VIG);

  return {
    home: probToDecimal(vigged.home),
    draw: probToDecimal(vigged.draw),
    away: probToDecimal(vigged.away),
    implied: {
      home: Math.round(vigged.home * 100),
      draw: Math.round(vigged.draw * 100),
      away: Math.round(vigged.away * 100),
    },
    vig: VIG,
    movement: {
      home: calcMovement(vigged.home, baselineVigged.home),
      draw: calcMovement(vigged.draw, baselineVigged.draw),
      away: calcMovement(vigged.away, baselineVigged.away),
    },
  };
}

/* ================================================================
   Legacy / compatibility: prediction voting
   ================================================================ */

function seedVotes(matchId: number, homeRank: number, awayRank: number) {
  const noise = seededNoise(matchId);
  const homeStrength = 100 - Math.min(homeRank, 100);
  const awayStrength = 100 - Math.min(awayRank, 100);
  const total = homeStrength + awayStrength;

  const homePct = Math.max(20, Math.min(65, Math.round(50 + ((homeStrength - awayStrength) / total) * 28 + (noise - 0.5) * 6)));
  const drawPct = Math.max(12, Math.min(30, Math.round(22 + noise * 6)));
  const awayPct = Math.max(20, 100 - homePct - drawPct);

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
    store.votes[matchId] = seedVotes(matchId, homeRank, awayRank);
  }
}

export function getPrediction(matchId: number, homeRank = 50, awayRank = 50): PredictionStats {
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

export function castPrediction(matchId: number, choice: PredictionChoice, homeRank = 50, awayRank = 50): PredictionStats {
  hydrateStore();
  ensureSeeded(matchId, homeRank, awayRank);
  const prev = store.myVotes[matchId];
  if (prev) {
    store.votes[matchId][prev] = Math.max(0, store.votes[matchId][prev] - 1);
  }
  store.votes[matchId][choice] += 1;
  store.myVotes[matchId] = choice;
  persistStore();
  notify();
  return getPrediction(matchId, homeRank, awayRank);
}

export function toPercent(stats: PredictionStats): { home: number; draw: number; away: number } {
  const { home, draw, away } = stats.totals;
  const total = home + draw + away;
  if (total === 0) return { home: 33, draw: 34, away: 33 };
  const h = Math.round((home / total) * 100);
  const d = Math.round((draw / total) * 100);
  const a = 100 - h - d;
  return { home: h, draw: d, away: a };
}

/** @deprecated Use getMatchOdds instead for real sportsbook odds */
export function toPreviewOdds(percent: number): string {
  const safePercent = Math.max(1, Math.min(95, percent));
  const fairDecimal = 100 / safePercent;
  const previewPrice = fairDecimal * 0.96;
  return Math.max(1.05, Math.min(15, previewPrice)).toFixed(2);
}
