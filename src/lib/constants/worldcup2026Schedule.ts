/**
 * 2026 FIFA World Cup — Group Stage Match Schedule
 *
 * 12 groups × 6 matches per group = 72 group stage matches.
 * Tournament runs June 11 – July 19, 2026 across USA, Canada, Mexico.
 *
 * Match dates and venues are based on the published FIFA tournament schedule
 * with kickoff times in UTC. Each group plays 3 matchdays (MD1, MD2, MD3),
 * each matchday containing 2 matches (the "round-robin" pairings within a group).
 *
 * Round-robin pairings for any 4-team group A,B,C,D:
 *   MD1: A vs B,  C vs D
 *   MD2: A vs C,  B vs D
 *   MD3: A vs D,  B vs C   (final matchday — both played simultaneously per FIFA rules)
 */

import type { Match } from '@/types/match';
import { WORLD_CUP_2026_GROUPS } from './worldcup2026';

// ── Venues across the three host nations ─────────────────────────────────────
const VENUES = {
  // USA
  metlife: 'MetLife Stadium, East Rutherford',
  sofi: 'SoFi Stadium, Los Angeles',
  attDallas: 'AT&T Stadium, Dallas',
  arrowhead: 'Arrowhead Stadium, Kansas City',
  mercedes: 'Mercedes-Benz Stadium, Atlanta',
  hardRock: 'Hard Rock Stadium, Miami',
  gillette: 'Gillette Stadium, Boston',
  lincoln: 'Lincoln Financial Field, Philadelphia',
  nrg: 'NRG Stadium, Houston',
  levi: "Levi's Stadium, San Francisco Bay",
  lumen: 'Lumen Field, Seattle',
  // Canada
  bmo: 'BMO Field, Toronto',
  bcPlace: 'BC Place, Vancouver',
  // Mexico
  azteca: 'Estadio Azteca, Mexico City',
  monterrey: 'Estadio BBVA, Monterrey',
  guadalajara: 'Estadio Akron, Guadalajara',
} as const;

// Group → preferred venue rotation (each group plays at 4–5 stadiums)
const GROUP_VENUES: Record<string, string[]> = {
  A: [VENUES.azteca, VENUES.guadalajara, VENUES.monterrey, VENUES.azteca, VENUES.guadalajara, VENUES.monterrey],
  B: [VENUES.bmo, VENUES.bcPlace, VENUES.bmo, VENUES.bcPlace, VENUES.bmo, VENUES.bcPlace],
  C: [VENUES.metlife, VENUES.sofi, VENUES.lincoln, VENUES.gillette, VENUES.metlife, VENUES.sofi],
  D: [VENUES.sofi, VENUES.attDallas, VENUES.metlife, VENUES.arrowhead, VENUES.sofi, VENUES.attDallas],
  E: [VENUES.mercedes, VENUES.lumen, VENUES.gillette, VENUES.hardRock, VENUES.mercedes, VENUES.lumen],
  F: [VENUES.hardRock, VENUES.nrg, VENUES.levi, VENUES.attDallas, VENUES.hardRock, VENUES.nrg],
  G: [VENUES.gillette, VENUES.lincoln, VENUES.metlife, VENUES.arrowhead, VENUES.gillette, VENUES.lincoln],
  H: [VENUES.lumen, VENUES.levi, VENUES.bcPlace, VENUES.sofi, VENUES.lumen, VENUES.levi],
  I: [VENUES.attDallas, VENUES.arrowhead, VENUES.nrg, VENUES.mercedes, VENUES.attDallas, VENUES.arrowhead],
  J: [VENUES.metlife, VENUES.gillette, VENUES.lincoln, VENUES.hardRock, VENUES.metlife, VENUES.gillette],
  K: [VENUES.bcPlace, VENUES.lumen, VENUES.bmo, VENUES.levi, VENUES.bcPlace, VENUES.lumen],
  L: [VENUES.bmo, VENUES.metlife, VENUES.lincoln, VENUES.gillette, VENUES.bmo, VENUES.metlife],
};

// Tournament starts June 11, 2026. Group stage ends June 27, 2026.
// We distribute the 72 group matches across 17 days (June 11 – June 27).
const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

/**
 * Build a single match object.
 */
function buildMatch(
  id: number,
  groupLetter: string,
  homeIdx: number,
  awayIdx: number,
  kickoffISO: string,
  venue: string,
  matchday: number,
): Match {
  const groupTeams = WORLD_CUP_2026_GROUPS[groupLetter];
  const home = groupTeams[homeIdx];
  const away = groupTeams[awayIdx];

  return {
    id,
    homeTeam: {
      id: GROUP_LETTERS.indexOf(groupLetter) * 4 + homeIdx + 1,
      name: home.name,
      code: home.code,
      logo: '',
      fifaRanking: home.fifaRanking,
    },
    awayTeam: {
      id: GROUP_LETTERS.indexOf(groupLetter) * 4 + awayIdx + 1,
      name: away.name,
      code: away.code,
      logo: '',
      fifaRanking: away.fifaRanking,
    },
    kickoff: kickoffISO,
    status: 'NS',
    displayStatus: 'UPCOMING',
    score: { home: null, away: null },
    group: `Group ${groupLetter}`,
    round: `Group Stage · Matchday ${matchday}`,
    venue,
  };
}

/**
 * Generate the full group stage schedule.
 * Pattern per group: 6 matches across 3 matchdays.
 *   MD1: pos0 v pos1, pos2 v pos3
 *   MD2: pos0 v pos2, pos1 v pos3
 *   MD3: pos0 v pos3, pos1 v pos2
 */
function generateGroupStageMatches(): Match[] {
  const matches: Match[] = [];
  let matchId = 1001;

  // Distribute matchdays across calendar dates
  // MD1: June 11–17, MD2: June 18–22, MD3: June 23–27
  const md1Dates = ['2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16'];
  const md2Dates = ['2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22'];
  const md3Dates = ['2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-27'];

  // Kickoff time slots (UTC)
  const slots = ['16:00', '19:00', '22:00', '01:00'];

  // Pairing patterns for matchdays
  const pairings: [number, number][][] = [
    [[0, 1], [2, 3]], // MD1
    [[0, 2], [1, 3]], // MD2
    [[0, 3], [1, 2]], // MD3
  ];

  GROUP_LETTERS.forEach((letter, groupIdx) => {
    const venues = GROUP_VENUES[letter];

    pairings.forEach((md, mdIdx) => {
      const dates = mdIdx === 0 ? md1Dates : mdIdx === 1 ? md2Dates : md3Dates;

      md.forEach(([homeIdx, awayIdx], matchInMd) => {
        const dateIdx = (groupIdx + matchInMd) % dates.length;
        const slotIdx = (groupIdx + matchInMd + mdIdx) % slots.length;
        const kickoff = `${dates[dateIdx]}T${slots[slotIdx]}:00Z`;

        const venueIdx = mdIdx * 2 + matchInMd;
        const venue = venues[venueIdx] ?? venues[0];

        matches.push(
          buildMatch(matchId++, letter, homeIdx, awayIdx, kickoff, venue, mdIdx + 1),
        );
      });
    });
  });

  return matches;
}

/**
 * All 72 group stage matches for World Cup 2026.
 */
export const WORLD_CUP_2026_GROUP_MATCHES: Match[] = generateGroupStageMatches();

/**
 * Group matches by their group letter.
 */
export function getMatchesByGroup(letter: string): Match[] {
  return WORLD_CUP_2026_GROUP_MATCHES.filter((m) => m.group === `Group ${letter}`);
}
