import type { Match } from '@/types/match';
import type { StandingsRow } from '@/types/standings';
import type { Team } from '@/types/match';

/**
 * Compute standings from a list of matches.
 * Enforces arithmetic invariants:
 * - Points = (Wins × 3) + (Draws × 1)
 * - Played = Wins + Draws + Losses
 * - GD = GF − GA
 */
export function computeStandings(matches: Match[]): StandingsRow[] {
  const teamMap = new Map<number, StandingsRow & { team: Team }>();

  // Initialize teams from matches
  for (const match of matches) {
    for (const team of [match.homeTeam, match.awayTeam]) {
      if (!teamMap.has(team.id)) {
        teamMap.set(team.id, {
          position: 0,
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        });
      }
    }

    // Only count finished matches
    if (match.displayStatus !== 'FINISHED') continue;
    if (match.score.home === null || match.score.away === null) continue;

    const home = teamMap.get(match.homeTeam.id)!;
    const away = teamMap.get(match.awayTeam.id)!;
    const homeGoals = match.score.home;
    const awayGoals = match.score.away;

    home.played++;
    away.played++;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.wins++;
      away.losses++;
    } else if (homeGoals < awayGoals) {
      away.wins++;
      home.losses++;
    } else {
      home.draws++;
      away.draws++;
    }
  }

  // Compute derived fields enforcing arithmetic invariants:
  // Points = (Wins × 3) + (Draws × 1)
  // GD = GF − GA
  // (Played = Wins + Draws + Losses is maintained by construction above)
  teamMap.forEach((row) => {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    row.points = row.wins * 3 + row.draws;
  });

  const result: StandingsRow[] = [];
  teamMap.forEach((row) => result.push(row));
  return result;
}

/**
 * Sort standings rows by: Points desc, GD desc, GF desc, team name asc.
 * Assigns position numbers 1..N.
 */
export function sortStandings(rows: StandingsRow[]): StandingsRow[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });

  return sorted.map((row, index) => ({ ...row, position: index + 1 }));
}
