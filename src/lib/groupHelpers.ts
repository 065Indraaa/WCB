import type { Group, StandingsRow } from '@/types/standings';
import { WORLD_CUP_2026_GROUPS } from '@/lib/constants/worldcup2026';
import { getGroupMatches } from '@/lib/constants/matches2026';
import { computeStandings, sortStandings } from '@/lib/utils/standings';

/**
 * Build all 12 groups with full data: teams, computed standings, and matches.
 * Used as fallback / pre-launch view before Live Score API is wired.
 */
export function buildAllGroups(): Group[] {
  return Object.entries(WORLD_CUP_2026_GROUPS).map(([letter, teams]) => {
    const matches = getGroupMatches(letter);

    // Compute standings from matches (or seed with empty rows if none played)
    let rows: StandingsRow[];
    const computed = computeStandings(matches);

    if (computed.length === teams.length) {
      rows = sortStandings(computed);
    } else {
      // Fallback: seed standings rows from team list
      rows = teams.map((t, i) => ({
        position: i + 1,
        team: {
          id: i + 1,
          name: t.name,
          code: t.code,
          logo: '',
          fifaRanking: t.fifaRanking,
        },
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      }));
    }

    return {
      letter,
      teams: rows,
      matches,
    };
  });
}

/** Get a single group by letter (case-insensitive) */
export function getGroupByLetter(letter: string): Group | null {
  const groups = buildAllGroups();
  return groups.find((g) => g.letter.toUpperCase() === letter.toUpperCase()) ?? null;
}
