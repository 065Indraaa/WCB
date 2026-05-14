import type { Match, MatchStatus } from '@/types/match';
import type { Group, PlayerStat } from '@/types/standings';

export type StatType = 'goals' | 'assists' | 'cleansheets' | 'cards';

/**
 * Fetch World Cup 2026 matches from the proxy route.
 * Runs in the browser; the proxy keeps the API key server-side.
 */
export async function getMatches(params: {
  date?: string;
  status?: MatchStatus;
  league?: number;
}): Promise<Match[]> {
  const searchParams = new URLSearchParams();
  if (params.date) searchParams.set('date', params.date);
  if (params.status) searchParams.set('status', params.status);
  if (params.league) searchParams.set('league', String(params.league));

  const res = await fetch(`/api/matches?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch matches: ${res.status}`);
  return res.json() as Promise<Match[]>;
}

/**
 * Fetch group standings from the proxy route.
 * Pass a group letter (e.g. "A") to filter to a single group.
 */
export async function getGroupStandings(group?: string): Promise<Group[]> {
  const searchParams = new URLSearchParams();
  if (group) searchParams.set('group', group);

  const res = await fetch(`/api/standings?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch standings: ${res.status}`);
  return res.json() as Promise<Group[]>;
}

/**
 * Fetch top-scorer / stat-leader data from the proxy route.
 * @param type - 'goals' | 'assists' | 'cleansheets' | 'cards'
 */
export async function getTopScorers(type: StatType): Promise<PlayerStat[]> {
  const res = await fetch(`/api/topscorers?type=${encodeURIComponent(type)}`);
  if (!res.ok) throw new Error(`Failed to fetch top scorers: ${res.status}`);
  return res.json() as Promise<PlayerStat[]>;
}
