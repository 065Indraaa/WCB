/**
 * Persistent betting store.
 *
 * Bets are keyed per wallet. In production they live in Upstash Redis /
 * Vercel KV via the REST API; when no credentials are configured the store
 * falls back to in-memory maps so local dev, tests, and builds work without
 * any infrastructure.
 *
 * Credits are NOT stored here — they are derived from on-chain $WCB locks
 * (see src/lib/server/credits.ts). This store only records bets and their
 * settlement state, which feeds credit accounting.
 *
 * Configure persistence with either pair of env vars:
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN   (Upstash)
 *   KV_REST_API_URL        + KV_REST_API_TOKEN          (Vercel KV)
 *
 * NOTE: read-modify-write on a per-wallet JSON blob is not transactional.
 * Concurrent writes to the same wallet can race; acceptable at current scale,
 * revisit with Redis transactions / per-bet keys if volume grows.
 */

import type { Bet } from '@/types/betting';
import type { PredictionChoice } from '@/lib/predictions';

/** Fraction of a losing stake returned to the bettor (Rule 2: 20% loss refund). */
export const LOSS_REFUND_RATE = 0.2;

function walletKey(wallet: string): string {
  return wallet.toLowerCase();
}

// ---------------------------------------------------------------------------
// Storage backend
// ---------------------------------------------------------------------------

interface Backend {
  read(key: string): Promise<Bet[]>;
  write(key: string, bets: Bet[]): Promise<void>;
  listKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

const DATA_PREFIX = 'wcb:bets:';
const WALLETS_SET = 'wcb:bets:wallets';

/** In-memory fallback (dev / tests / no credentials). */
class MemoryBackend implements Backend {
  private db = new Map<string, Bet[]>();
  async read(key: string): Promise<Bet[]> {
    return (this.db.get(key) ?? []).map((b) => ({ ...b }));
  }
  async write(key: string, bets: Bet[]): Promise<void> {
    this.db.set(key, bets.map((b) => ({ ...b })));
  }
  async listKeys(): Promise<string[]> {
    return Array.from(this.db.keys());
  }
  async clear(): Promise<void> {
    this.db.clear();
  }
}

/** Upstash / Vercel KV REST backend. */
class UpstashBackend implements Backend {
  constructor(private url: string, private token: string) {}

  private async cmd(args: string[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Redis ${args[0]} failed: ${res.status}`);
    const data = (await res.json()) as { result?: unknown; error?: string };
    if (data.error) throw new Error(`Redis error: ${data.error}`);
    return data.result;
  }

  async read(key: string): Promise<Bet[]> {
    const r = await this.cmd(['GET', DATA_PREFIX + key]);
    if (typeof r !== 'string' || !r) return [];
    try {
      return JSON.parse(r) as Bet[];
    } catch {
      return [];
    }
  }

  async write(key: string, bets: Bet[]): Promise<void> {
    await this.cmd(['SET', DATA_PREFIX + key, JSON.stringify(bets)]);
    await this.cmd(['SADD', WALLETS_SET, key]);
  }

  async listKeys(): Promise<string[]> {
    const r = await this.cmd(['SMEMBERS', WALLETS_SET]);
    return Array.isArray(r) ? r.map(String) : [];
  }

  async clear(): Promise<void> {
    const keys = await this.listKeys();
    if (keys.length) await this.cmd(['DEL', ...keys.map((k) => DATA_PREFIX + k)]);
    await this.cmd(['DEL', WALLETS_SET]);
  }
}

function resolveBackend(): Backend {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return new UpstashBackend(url, token);
  return new MemoryBackend();
}

const backend = resolveBackend();

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function getBets(wallet: string): Promise<Bet[]> {
  return backend.read(walletKey(wallet));
}

export async function getActiveBets(wallet: string): Promise<Bet[]> {
  return (await getBets(wallet)).filter((b) => b.status === 'pending');
}

/** Net delta from a single bet on already-settled credit accounting. */
function settlementDelta(bet: Bet): number {
  if (bet.status === 'won') {
    const odds = parseFloat(bet.odds) || 1;
    return bet.amount * (odds - 1);
  }
  if (bet.status === 'lost') {
    return -bet.amount * (1 - LOSS_REFUND_RATE);
  }
  return 0;
}

export interface BetAccounting {
  /** Credits tied up in pending bets. */
  lockedInBets: number;
  /** Net credit delta from settled bets (wins add, losses subtract 80%). */
  settledNet: number;
  /** Cumulative 20% refunds received on losing bets. */
  totalRefunded: number;
}

/** Single-read accounting summary used by credit balance computation. */
export async function getBetAccounting(wallet: string): Promise<BetAccounting> {
  const bets = await getBets(wallet);
  let lockedInBets = 0;
  let settledNet = 0;
  let totalRefunded = 0;
  for (const b of bets) {
    if (b.status === 'pending') lockedInBets += b.amount;
    settledNet += settlementDelta(b);
    if (b.status === 'lost') totalRefunded += b.amount * LOSS_REFUND_RATE;
  }
  return { lockedInBets, settledNet, totalRefunded };
}

export async function getTotalLockedInBets(wallet: string): Promise<number> {
  return (await getActiveBets(wallet)).reduce((sum, b) => sum + b.amount, 0);
}

export async function getSettledNet(wallet: string): Promise<number> {
  return (await getBets(wallet)).reduce((sum, b) => sum + settlementDelta(b), 0);
}

export async function getTotalRefunded(wallet: string): Promise<number> {
  return (await getBets(wallet))
    .filter((b) => b.status === 'lost')
    .reduce((sum, b) => sum + b.amount * LOSS_REFUND_RATE, 0);
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export async function addBet(
  wallet: string,
  matchId: number,
  choice: PredictionChoice,
  amount: number,
  odds: string,
): Promise<Bet> {
  const key = walletKey(wallet);
  const list = await backend.read(key);
  const bet: Bet = {
    id: `${key}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    wallet,
    matchId,
    choice,
    amount,
    odds,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  list.push(bet);
  await backend.write(key, list);
  return { ...bet };
}

export async function cancelBet(wallet: string, betId: string): Promise<Bet | null> {
  const key = walletKey(wallet);
  const list = await backend.read(key);
  const idx = list.findIndex((b) => b.id === betId);
  if (idx === -1 || list[idx].status !== 'pending') return null;

  const updated: Bet = { ...list[idx], status: 'cancelled' };
  list[idx] = updated;
  await backend.write(key, list);
  return { ...updated };
}

export async function settleBet(
  wallet: string,
  betId: string,
  result: 'won' | 'lost',
): Promise<Bet | null> {
  const key = walletKey(wallet);
  const list = await backend.read(key);
  const idx = list.findIndex((b) => b.id === betId);
  if (idx === -1 || list[idx].status !== 'pending') return null;

  const updated: Bet = { ...list[idx], status: result, settledAt: new Date().toISOString() };
  list[idx] = updated;
  await backend.write(key, list);
  return { ...updated };
}

/** Derive the 1X2 outcome from a final score. */
export function outcomeFromScore(homeScore: number, awayScore: number): PredictionChoice {
  if (homeScore > awayScore) return 'home';
  if (homeScore < awayScore) return 'away';
  return 'draw';
}

/**
 * Settle every pending bet on a match across all wallets.
 *
 * A bet whose choice matches the outcome is marked `won`; otherwise `lost`
 * (the 20% refund is applied via credit accounting). Returns settled bets.
 */
export async function settleMatch(matchId: number, outcome: PredictionChoice): Promise<Bet[]> {
  const keys = await backend.listKeys();
  const settled: Bet[] = [];
  const settledAt = new Date().toISOString();

  for (const key of keys) {
    const list = await backend.read(key);
    let changed = false;
    for (let i = 0; i < list.length; i++) {
      const bet = list[i];
      if (bet.matchId !== matchId || bet.status !== 'pending') continue;
      const result: Bet['status'] = bet.choice === outcome ? 'won' : 'lost';
      list[i] = { ...bet, status: result, settledAt };
      settled.push({ ...list[i] });
      changed = true;
    }
    if (changed) await backend.write(key, list);
  }
  return settled;
}

export async function clearAllBets(): Promise<void> {
  await backend.clear();
}


// ---------------------------------------------------------------------------
// Leaderboard aggregation
// ---------------------------------------------------------------------------

export interface BettingLeaderboardEntry {
  wallet: string;
  totalBets: number;
  won: number;
  lost: number;
  cancelled: number;
  winRate: number;
  totalProfit: number;
  totalWagered: number;
  biggestWin: number;
}

export async function getLeaderboardStats(): Promise<BettingLeaderboardEntry[]> {
  const keys = await backend.listKeys();
  const map = new Map<string, BettingLeaderboardEntry>();

  for (const key of keys) {
    const bets = await backend.read(key);
    for (const bet of bets) {
      const entry = map.get(key) ?? {
        wallet: bet.wallet,
        totalBets: 0,
        won: 0,
        lost: 0,
        cancelled: 0,
        winRate: 0,
        totalProfit: 0,
        totalWagered: 0,
        biggestWin: 0,
      };

      entry.totalBets += 1;
      entry.totalWagered += bet.amount;

      if (bet.status === 'won') {
        entry.won += 1;
        const odds = parseFloat(bet.odds) || 1;
        const profit = bet.amount * (odds - 1);
        entry.totalProfit += profit;
        if (profit > entry.biggestWin) entry.biggestWin = profit;
      } else if (bet.status === 'lost') {
        entry.lost += 1;
        entry.totalProfit -= bet.amount * (1 - LOSS_REFUND_RATE);
      } else if (bet.status === 'cancelled') {
        entry.cancelled += 1;
      }

      map.set(key, entry);
    }
  }

  const results = Array.from(map.values());
  for (const r of results) {
    const decided = r.won + r.lost;
    r.winRate = decided > 0 ? Math.round((r.won / decided) * 1000) / 10 : 0;
  }

  return results.sort((a, b) => b.totalProfit - a.totalProfit);
}
