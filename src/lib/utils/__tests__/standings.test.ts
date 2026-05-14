import { describe, it, expect } from 'vitest';
import { computeStandings, sortStandings } from '../standings';
import type { Match } from '@/types/match';

// Helper to build a minimal Match fixture
function makeMatch(
  id: number,
  homeId: number,
  homeName: string,
  awayId: number,
  awayName: string,
  homeGoals: number | null,
  awayGoals: number | null,
  finished = true,
): Match {
  return {
    id,
    homeTeam: { id: homeId, name: homeName, code: homeName.toLowerCase(), logo: '' },
    awayTeam: { id: awayId, name: awayName, code: awayName.toLowerCase(), logo: '' },
    kickoff: '2026-06-11T00:00:00Z',
    status: finished ? 'FT' : 'NS',
    displayStatus: finished ? 'FINISHED' : 'UPCOMING',
    score: { home: homeGoals, away: awayGoals },
    group: 'Group A',
    round: 'Group Stage',
    venue: 'Test Stadium',
  };
}

describe('computeStandings', () => {
  it('returns an empty array for no matches', () => {
    expect(computeStandings([])).toEqual([]);
  });

  it('initialises teams with zero stats even for unplayed matches', () => {
    const matches = [makeMatch(1, 1, 'Alpha', 2, 'Beta', null, null, false)];
    const rows = computeStandings(matches);
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.played).toBe(0);
      expect(row.wins).toBe(0);
      expect(row.draws).toBe(0);
      expect(row.losses).toBe(0);
      expect(row.goalsFor).toBe(0);
      expect(row.goalsAgainst).toBe(0);
      expect(row.goalDifference).toBe(0);
      expect(row.points).toBe(0);
    }
  });

  it('correctly records a home win', () => {
    const matches = [makeMatch(1, 1, 'Alpha', 2, 'Beta', 3, 1)];
    const rows = computeStandings(matches);
    const alpha = rows.find(r => r.team.id === 1)!;
    const beta = rows.find(r => r.team.id === 2)!;

    expect(alpha.played).toBe(1);
    expect(alpha.wins).toBe(1);
    expect(alpha.draws).toBe(0);
    expect(alpha.losses).toBe(0);
    expect(alpha.goalsFor).toBe(3);
    expect(alpha.goalsAgainst).toBe(1);
    expect(alpha.goalDifference).toBe(2);   // GD = GF − GA
    expect(alpha.points).toBe(3);           // Points = Wins × 3

    expect(beta.played).toBe(1);
    expect(beta.wins).toBe(0);
    expect(beta.draws).toBe(0);
    expect(beta.losses).toBe(1);
    expect(beta.goalsFor).toBe(1);
    expect(beta.goalsAgainst).toBe(3);
    expect(beta.goalDifference).toBe(-2);
    expect(beta.points).toBe(0);
  });

  it('correctly records an away win', () => {
    const matches = [makeMatch(1, 1, 'Alpha', 2, 'Beta', 0, 2)];
    const rows = computeStandings(matches);
    const alpha = rows.find(r => r.team.id === 1)!;
    const beta = rows.find(r => r.team.id === 2)!;

    expect(alpha.wins).toBe(0);
    expect(alpha.losses).toBe(1);
    expect(alpha.points).toBe(0);

    expect(beta.wins).toBe(1);
    expect(beta.losses).toBe(0);
    expect(beta.points).toBe(3);
  });

  it('correctly records a draw', () => {
    const matches = [makeMatch(1, 1, 'Alpha', 2, 'Beta', 1, 1)];
    const rows = computeStandings(matches);
    const alpha = rows.find(r => r.team.id === 1)!;
    const beta = rows.find(r => r.team.id === 2)!;

    expect(alpha.draws).toBe(1);
    expect(alpha.points).toBe(1);           // Points = Draws × 1
    expect(beta.draws).toBe(1);
    expect(beta.points).toBe(1);
  });

  it('enforces arithmetic invariants across multiple matches', () => {
    const matches = [
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 2, 0),  // Alpha wins
      makeMatch(2, 1, 'Alpha', 3, 'Gamma', 1, 1),  // Draw
      makeMatch(3, 2, 'Beta', 3, 'Gamma', 0, 3),   // Gamma wins
    ];
    const rows = computeStandings(matches);

    for (const row of rows) {
      // Points = (Wins × 3) + (Draws × 1)
      expect(row.points).toBe(row.wins * 3 + row.draws);
      // Played = Wins + Draws + Losses
      expect(row.played).toBe(row.wins + row.draws + row.losses);
      // GD = GF − GA
      expect(row.goalDifference).toBe(row.goalsFor - row.goalsAgainst);
    }

    // sum(GF) === sum(GA) across all teams
    const totalGF = rows.reduce((s, r) => s + r.goalsFor, 0);
    const totalGA = rows.reduce((s, r) => s + r.goalsAgainst, 0);
    expect(totalGF).toBe(totalGA);
  });

  it('ignores non-FINISHED matches', () => {
    const matches = [
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 3, 0, true),
      makeMatch(2, 1, 'Alpha', 3, 'Gamma', 2, 1, false), // UPCOMING — should be ignored
    ];
    const rows = computeStandings(matches);
    const alpha = rows.find(r => r.team.id === 1)!;
    expect(alpha.played).toBe(1);
    expect(alpha.wins).toBe(1);
  });

  it('ignores matches with null scores even if FINISHED', () => {
    const matches = [makeMatch(1, 1, 'Alpha', 2, 'Beta', null, null, true)];
    // Override displayStatus manually to FINISHED with null scores
    matches[0].displayStatus = 'FINISHED';
    const rows = computeStandings(matches);
    for (const row of rows) {
      expect(row.played).toBe(0);
    }
  });
});

describe('sortStandings', () => {
  it('returns an empty array for empty input', () => {
    expect(sortStandings([])).toEqual([]);
  });

  it('assigns positions 1..N', () => {
    const rows = computeStandings([
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 2, 0),
      makeMatch(2, 3, 'Gamma', 4, 'Delta', 1, 1),
    ]);
    const sorted = sortStandings(rows);
    const positions = sorted.map(r => r.position);
    expect(positions).toEqual([1, 2, 3, 4]);
  });

  it('sorts by points descending', () => {
    const rows = computeStandings([
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 0, 3), // Beta wins (3 pts)
      makeMatch(2, 3, 'Gamma', 4, 'Delta', 1, 1), // Draw (1 pt each)
    ]);
    const sorted = sortStandings(rows);
    expect(sorted[0].team.name).toBe('Beta');
  });

  it('breaks points ties by goal difference descending', () => {
    // Both teams have 3 points (one win each), but different GD
    const rows = computeStandings([
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 3, 0),  // Alpha: +3 GD
      makeMatch(2, 3, 'Gamma', 4, 'Delta', 1, 0), // Gamma: +1 GD
    ]);
    const sorted = sortStandings(rows);
    expect(sorted[0].team.name).toBe('Alpha');
    expect(sorted[1].team.name).toBe('Gamma');
  });

  it('breaks GD ties by goals for descending', () => {
    // Both teams: 3 pts, GD = +1, but different GF
    const rows = computeStandings([
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 2, 1),  // Alpha: GF=2, GD=+1
      makeMatch(2, 3, 'Gamma', 4, 'Delta', 1, 0), // Gamma: GF=1, GD=+1
    ]);
    const sorted = sortStandings(rows);
    expect(sorted[0].team.name).toBe('Alpha');
    expect(sorted[1].team.name).toBe('Gamma');
  });

  it('breaks remaining ties alphabetically by team name', () => {
    // Two teams with identical stats — sort by name
    const rows = computeStandings([
      makeMatch(1, 1, 'Zebra', 2, 'Aardvark', 0, 0),
    ]);
    const sorted = sortStandings(rows);
    expect(sorted[0].team.name).toBe('Aardvark');
    expect(sorted[1].team.name).toBe('Zebra');
  });

  it('does not mutate the input array', () => {
    const rows = computeStandings([
      makeMatch(1, 1, 'Alpha', 2, 'Beta', 0, 3),
    ]);
    const original = [...rows];
    sortStandings(rows);
    expect(rows).toEqual(original);
  });
});
