/**
 * Sportsbook-grade odds engine for WCB Live Markets.
 *
 * Pre-match odds are driven by:
 *  1. True probability (FIFA ranking, home advantage)
 *  2. Time-based micro-fluctuation (30s buckets, volatile near kickoff)
 *  3. Market pressure (simulated public money shifting the line)
 *  4. News shocks (occasional sharp moves mimicking injury/lineup news)
 *  5. Standard vig overlay (7.5%)
 *
 * Live odds are driven by:
 *  1. Simulated score (deterministic seeded chunks)
 *  2. Win-probability model from score diff + elapsed time
 *  3. Live drift (10s buckets)
 *  4. Market suspension on goals/red cards
 *
 * This produces realistic decimal odds that shift visibly over time,
 * just like a real sportsbook.
 */

export type OddsMovement = 'up' | 'down' | 'flat';

export interface ComputedOdds {
  home: string;
  draw: string;
  away: string;
  implied: { home: number; draw: number; away: number };
  vig: number;
  movement: { home: OddsMovement; draw: OddsMovement; away: OddsMovement };
  suspended: boolean;
  suspensionReason?: string;
  publicMoney: { home: number; draw: number; away: number };
  lastUpdated: number;
  liveScore?: { home: number; away: number };
  elapsed?: number;
}

const VIG = 0.075; // 7.5% book margin

/* ================================================================
   Seeded noise (deterministic per match)
   ================================================================ */

function seededNoise(matchId: number, offset = 0): number {
  const x = Math.sin(matchId * 9301 + offset * 49297) * 10000;
  return x - Math.floor(x);
}

/* ================================================================
   True Probability Model
   ================================================================ */

function trueProbability(
  homeRank = 50,
  awayRank = 50,
  isHost = false
): { home: number; draw: number; away: number } {
  const homeStrength = Math.max(5, 105 - homeRank);
  const awayStrength = Math.max(5, 105 - awayRank);
  const homeBoost = isHost ? 0.12 : 0.08;
  const total = homeStrength + awayStrength;

  let homeWin = (homeStrength / total) * (1 - homeBoost) + homeBoost;
  let awayWin = (awayStrength / total) * (1 - homeBoost);

  const diff = Math.abs(homeStrength - awayStrength) / total;
  let draw = 0.25 + 0.10 * (1 - diff);

  const sum = homeWin + draw + awayWin;
  homeWin /= sum;
  draw /= sum;
  awayWin /= sum;

  return { home: homeWin, draw, away: awayWin };
}

/* ================================================================
   Pre-match dynamics
   ================================================================ */

function timeDrift(matchId: number, kickoff: string): number {
  const now = Date.now();
  const ko = new Date(kickoff).getTime();
  const minutesUntil = (ko - now) / 60000;

  // 30-second buckets
  const bucket = Math.floor(now / 30000);

  // Volatility ramps up to 4x on matchday
  const volatility =
    minutesUntil > 0 && minutesUntil < 1440
      ? 1 + (1 - minutesUntil / 1440) * 3
      : 1;

  // ±4% baseline drift, up to ±16% near kickoff
  return (seededNoise(matchId, bucket) - 0.5) * 0.08 * volatility;
}

function marketPressure(
  matchId: number,
  base: { home: number; draw: number; away: number }
): { home: number; draw: number; away: number } {
  // Simulates where public money goes. Favorites attract more money,
  // so bookies shorten the favorite (raise its implied prob) to balance liability.
  const bucket = Math.floor(Date.now() / 60000); // 1-minute buckets
  const walk = seededNoise(matchId, bucket + 1000);
  const favorite = base.home >= base.away ? 'home' : 'away';
  const pressure = (walk - 0.5) * 0.06; // ±3% line shift

  if (favorite === 'home') {
    return {
      home: pressure * 0.8,
      draw: -pressure * 0.2,
      away: -pressure * 0.6,
    };
  }
  return {
    home: -pressure * 0.6,
    draw: -pressure * 0.2,
    away: pressure * 0.8,
  };
}

function newsShock(matchId: number): { home: number; draw: number; away: number } {
  // Occasional sharp move (~8% of matches at any moment) mimicking injury/lineup news.
  const bucket = Math.floor(Date.now() / 120000); // 2-minute buckets
  const n = seededNoise(matchId, bucket + 2000);
  if (n > 0.92) {
    const magnitude = (seededNoise(matchId, bucket + 3000) - 0.5) * 0.06;
    return { home: Math.abs(magnitude), draw: -magnitude * 0.3, away: -magnitude * 0.7 };
  }
  if (n < 0.08) {
    const magnitude = (seededNoise(matchId, bucket + 3000) - 0.5) * 0.06;
    return { home: -magnitude * 0.7, draw: -magnitude * 0.3, away: Math.abs(magnitude) };
  }
  return { home: 0, draw: 0, away: 0 };
}

/* ================================================================
   Live match model
   ================================================================ */

function simulatedScore(
  matchId: number,
  homeRank: number,
  awayRank: number,
  elapsed: number
): { home: number; away: number } {
  const homeStrength = Math.max(5, 105 - homeRank);
  const awayStrength = Math.max(5, 105 - awayRank);
  const total = homeStrength + awayStrength;

  const homeLambda = (homeStrength / total) * 1.5; // xG per 90
  const awayLambda = (awayStrength / total) * 1.1;

  let homeGoals = 0;
  let awayGoals = 0;
  const chunks = Math.max(0, Math.floor(elapsed / 5));

  for (let i = 0; i < chunks; i++) {
    const homeNoise = seededNoise(matchId, i + 100);
    const awayNoise = seededNoise(matchId, i + 200);
    const homeChunkProb = 1 - Math.exp((-homeLambda * 5) / 90);
    const awayChunkProb = 1 - Math.exp((-awayLambda * 5) / 90);
    if (homeNoise < homeChunkProb) homeGoals++;
    if (awayNoise < awayChunkProb) awayGoals++;
  }

  return { home: homeGoals, away: awayGoals };
}

function liveWinProbability(
  homeGoals: number,
  awayGoals: number,
  elapsed: number
): { home: number; draw: number; away: number } {
  const diff = homeGoals - awayGoals;
  const remaining = Math.max(1, 90 - elapsed);

  // Steepness increases with elapsed time (harder to overcome deficit late)
  const k = 0.4 + 1.6 * (elapsed / 90);

  const rawHome = 1 / (1 + Math.exp(-k * diff));
  const rawAway = 1 / (1 + Math.exp(k * diff));
  const rawDraw = Math.max(
    0.03,
    0.32 * Math.sqrt(remaining / 90) * (1 - 0.12 * Math.abs(diff))
  );

  const sum = rawHome + rawDraw + rawAway;
  return {
    home: rawHome / sum,
    draw: rawDraw / sum,
    away: rawAway / sum,
  };
}

/* ================================================================
   Market suspension tracking (module-level state)
   ================================================================ */

const suspensionMap = new Map<number, { until: number; reason: string }>();
const previousScores = new Map<number, { home: number; away: number }>();

function checkSuspension(
  matchId: number,
  currentScore: { home: number; away: number },
  elapsed: number
): { suspended: boolean; reason?: string } {
  const prev = previousScores.get(matchId);
  const now = Date.now();

  // Expire old suspension
  const existing = suspensionMap.get(matchId);
  if (existing && now > existing.until) {
    suspensionMap.delete(matchId);
  } else if (existing) {
    return { suspended: true, reason: existing.reason };
  }

  // Goal event
  if (prev && (prev.home !== currentScore.home || prev.away !== currentScore.away)) {
    const duration = 15000 + Math.round(seededNoise(matchId, Math.floor(now / 1000)) * 10000);
    suspensionMap.set(matchId, { until: now + duration, reason: 'GOAL — updating odds' });
    previousScores.set(matchId, { ...currentScore });
    return { suspended: true, reason: 'GOAL — updating odds' };
  }

  // Red card simulation (rare)
  if (prev && elapsed > 0) {
    const chunk = Math.floor(elapsed / 5);
    const prevChunk = Math.floor((elapsed - 5) / 5);
    if (chunk !== prevChunk) {
      const cardNoise = seededNoise(matchId, chunk + 500);
      if (cardNoise < 0.02) {
        const duration = 12000 + Math.round(seededNoise(matchId, chunk + 600) * 8000);
        suspensionMap.set(matchId, { until: now + duration, reason: 'RED CARD — updating odds' });
      }
    }
  }

  previousScores.set(matchId, { ...currentScore });
  return { suspended: false };
}

/* ================================================================
   History tracking for movement arrows
   ================================================================ */

const history = new Map<number, Array<{ ts: number; home: number; draw: number; away: number }>>();

function pruneHistory(matchId: number, now: number) {
  const h = history.get(matchId);
  if (!h) return;
  const cutoff = now - 120000; // 2 min window
  const filtered = h.filter((x) => x.ts > cutoff);
  if (filtered.length === 0) history.delete(matchId);
  else history.set(matchId, filtered);
}

function recordHistory(
  matchId: number,
  odds: { home: number; draw: number; away: number }
) {
  const now = Date.now();
  const h = history.get(matchId) ?? [];
  h.push({ ts: now, ...odds });
  history.set(matchId, h);
  pruneHistory(matchId, now);
}

function getMovement(
  matchId: number,
  current: { home: number; draw: number; away: number }
): { home: OddsMovement; draw: OddsMovement; away: OddsMovement } {
  const h = history.get(matchId);
  if (!h || h.length < 2) {
    return { home: 'flat', draw: 'flat', away: 'flat' };
  }
  const oldest = h[0];
  const threshold = 0.02;
  return {
    home: current.home - oldest.home > threshold ? 'up' : current.home - oldest.home < -threshold ? 'down' : 'flat',
    draw: current.draw - oldest.draw > threshold ? 'up' : current.draw - oldest.draw < -threshold ? 'down' : 'flat',
    away: current.away - oldest.away > threshold ? 'up' : current.away - oldest.away < -threshold ? 'down' : 'flat',
  };
}

/* ================================================================
   Public money simulation
   ================================================================ */

function publicMoney(
  matchId: number,
  base: { home: number; draw: number; away: number }
): { home: number; draw: number; away: number } {
  const h = base.home * 100 + (seededNoise(matchId, 4000) - 0.5) * 30;
  const d = base.draw * 100 + (seededNoise(matchId, 4001) - 0.5) * 20;
  const a = base.away * 100 + (seededNoise(matchId, 4002) - 0.5) * 30;
  const sum = Math.max(1, h + d + a);
  return {
    home: Math.max(5, Math.min(90, Math.round((h / sum) * 100))),
    draw: Math.max(5, Math.min(90, Math.round((d / sum) * 100))),
    away: Math.max(5, Math.min(90, Math.round((a / sum) * 100))),
  };
}

/* ================================================================
   Helpers
   ================================================================ */

function probToDecimal(prob: number): string {
  const decimal = 1 / Math.max(0.01, Math.min(0.99, prob));
  return Math.max(1.01, Math.min(50, decimal)).toFixed(2);
}

function applyVig(
  probs: { home: number; draw: number; away: number },
  margin: number
) {
  const fairSum = probs.home + probs.draw + probs.away;
  const viggedSum = fairSum * (1 + margin);
  return {
    home: probs.home / viggedSum,
    draw: probs.draw / viggedSum,
    away: probs.away / viggedSum,
  };
}

/* ================================================================
   Public API
   ================================================================ */

export function computeOdds(
  matchId: number,
  homeRank = 50,
  awayRank = 50,
  isHost = false,
  kickoff = new Date().toISOString(),
  displayStatus: 'UPCOMING' | 'LIVE' | 'HALFTIME' | 'FINISHED' = 'UPCOMING',
  elapsed?: number
): ComputedOdds {
  const now = Date.now();
  const base = trueProbability(homeRank, awayRank, isHost);

  let probs: { home: number; draw: number; away: number };
  let liveScore: { home: number; away: number } | undefined;
  let actualElapsed = elapsed ?? 0;

  if (displayStatus === 'LIVE' || displayStatus === 'HALFTIME') {
    actualElapsed = elapsed ?? Math.floor((now - new Date(kickoff).getTime()) / 60000);
    actualElapsed = Math.max(0, Math.min(120, actualElapsed));
    liveScore = simulatedScore(matchId, homeRank, awayRank, actualElapsed);
    probs = liveWinProbability(liveScore.home, liveScore.away, actualElapsed);

    // Minor live drift every 10s
    const liveBucket = Math.floor(now / 10000);
    const liveDrift = (seededNoise(matchId, liveBucket + 8000) - 0.5) * 0.04;
    probs.home += liveDrift;
    probs.away -= liveDrift;
  } else {
    const tDrift = timeDrift(matchId, kickoff);
    const pressure = marketPressure(matchId, base);
    const shock = newsShock(matchId);

    probs = {
      home: base.home + tDrift + pressure.home + shock.home,
      draw: base.draw + tDrift * 0.3 + pressure.draw + shock.draw,
      away: base.away - tDrift + pressure.away + shock.away,
    };
  }

  // Clamp individual probabilities
  probs.home = Math.max(0.06, Math.min(0.78, probs.home));
  probs.away = Math.max(0.06, Math.min(0.78, probs.away));
  probs.draw = Math.max(0.08, Math.min(0.45, probs.draw));

  // Re-normalize
  const sum = probs.home + probs.draw + probs.away;
  probs.home /= sum;
  probs.draw /= sum;
  probs.away /= sum;

  // Apply vig
  const vigged = applyVig(probs, VIG);
  const baselineVigged = applyVig(base, VIG);

  const decimal = {
    home: probToDecimal(vigged.home),
    draw: probToDecimal(vigged.draw),
    away: probToDecimal(vigged.away),
  };

  const current = {
    home: parseFloat(decimal.home),
    draw: parseFloat(decimal.draw),
    away: parseFloat(decimal.away),
  };

  recordHistory(matchId, current);
  const movement = getMovement(matchId, current);

  let suspended = false;
  let suspensionReason: string | undefined;
  if ((displayStatus === 'LIVE' || displayStatus === 'HALFTIME') && liveScore) {
    const s = checkSuspension(matchId, liveScore, actualElapsed);
    suspended = s.suspended;
    suspensionReason = s.reason;
  }

  const pub = publicMoney(matchId, base);

  return {
    home: decimal.home,
    draw: decimal.draw,
    away: decimal.away,
    implied: {
      home: Math.round(vigged.home * 100),
      draw: Math.round(vigged.draw * 100),
      away: Math.round(vigged.away * 100),
    },
    vig: VIG,
    movement,
    suspended,
    suspensionReason,
    publicMoney: pub,
    lastUpdated: now,
    liveScore,
    elapsed: actualElapsed,
  };
}
