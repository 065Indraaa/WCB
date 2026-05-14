/**
 * Static World Cup 2026 group stage match schedule.
 * Used as fallback / pre-launch data before Live Score API is wired.
 *
 * 12 groups × 6 matches each = 72 group-stage matches.
 * Round of 32 → R16 → QF → SF → 3rd Place → Final = 32 knockout matches.
 *
 * Dates and venues based on the publicly announced FIFA schedule.
 * Once the Live Score API is live, these will be overridden by real data.
 */

import type { Match } from '@/types/match';
import { WORLD_CUP_2026_TEAMS } from './worldcup2026';

const VENUES = {
  // USA
  metlife: 'MetLife Stadium, East Rutherford',
  sofi: 'SoFi Stadium, Los Angeles',
  attDallas: 'AT&T Stadium, Arlington',
  mercedes: 'Mercedes-Benz Stadium, Atlanta',
  arrowhead: 'Arrowhead Stadium, Kansas City',
  hardrock: 'Hard Rock Stadium, Miami',
  geha: 'GEHA Field at Arrowhead',
  lincoln: 'Lincoln Financial Field, Philadelphia',
  levis: 'Levi\'s Stadium, Santa Clara',
  lumen: 'Lumen Field, Seattle',
  nrg: 'NRG Stadium, Houston',
  gillette: 'Gillette Stadium, Foxborough',
  // Canada
  bmo: 'BMO Field, Toronto',
  bcplace: 'BC Place, Vancouver',
  // Mexico
  azteca: 'Estadio Azteca, Mexico City',
  akron: 'Estadio Akron, Guadalajara',
  bbva: 'Estadio BBVA, Monterrey',
};

let matchIdCounter = 1;

function team(name: string) {
  const t = WORLD_CUP_2026_TEAMS.find((x) => x.name === name);
  if (!t) throw new Error(`Team not found: ${name}`);
  return {
    id: WORLD_CUP_2026_TEAMS.indexOf(t) + 1,
    name: t.name,
    code: t.code,
    logo: '',
    fifaRanking: t.fifaRanking,
  };
}

function makeMatch(
  homeName: string,
  awayName: string,
  group: string,
  kickoffISO: string,
  venue: string,
  round = 'Group Stage',
): Match {
  return {
    id: matchIdCounter++,
    homeTeam: team(homeName),
    awayTeam: team(awayName),
    kickoff: kickoffISO,
    status: 'NS',
    displayStatus: 'UPCOMING',
    score: { home: null, away: null },
    group,
    round,
    venue,
  };
}

/**
 * Group Stage — full schedule (matchday 1, 2, 3 for each group)
 * Each group plays a round-robin: T1-T2, T3-T4, T1-T3, T2-T4, T1-T4, T2-T3
 */
function buildGroupStage(): Match[] {
  const matches: Match[] = [];

  const groups = [
    {
      letter: 'A',
      teams: ['Mexico', 'South Korea', 'South Africa', 'Czechia'],
      venue: VENUES.azteca,
      startDate: '2026-06-11',
    },
    {
      letter: 'B',
      teams: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
      venue: VENUES.bmo,
      startDate: '2026-06-12',
    },
    {
      letter: 'C',
      teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
      venue: VENUES.metlife,
      startDate: '2026-06-13',
    },
    {
      letter: 'D',
      teams: ['United States', 'Paraguay', 'Australia', 'Turkey'],
      venue: VENUES.sofi,
      startDate: '2026-06-12',
    },
    {
      letter: 'E',
      teams: ['Germany', 'Ivory Coast', 'Ecuador', 'Curacao'],
      venue: VENUES.mercedes,
      startDate: '2026-06-13',
    },
    {
      letter: 'F',
      teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
      venue: VENUES.attDallas,
      startDate: '2026-06-14',
    },
    {
      letter: 'G',
      teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
      venue: VENUES.lincoln,
      startDate: '2026-06-14',
    },
    {
      letter: 'H',
      teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
      venue: VENUES.hardrock,
      startDate: '2026-06-15',
    },
    {
      letter: 'I',
      teams: ['France', 'Senegal', 'Iraq', 'Norway'],
      venue: VENUES.levis,
      startDate: '2026-06-15',
    },
    {
      letter: 'J',
      teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
      venue: VENUES.bbva,
      startDate: '2026-06-16',
    },
    {
      letter: 'K',
      teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
      venue: VENUES.lumen,
      startDate: '2026-06-16',
    },
    {
      letter: 'L',
      teams: ['England', 'Croatia', 'Ghana', 'Panama'],
      venue: VENUES.gillette,
      startDate: '2026-06-17',
    },
  ];

  for (const g of groups) {
    const [t1, t2, t3, t4] = g.teams;
    const start = new Date(`${g.startDate}T18:00:00Z`);
    const day = 86400000;

    // Matchday 1
    matches.push(makeMatch(t1, t2, `Group ${g.letter}`, new Date(start.getTime()).toISOString(), g.venue));
    matches.push(makeMatch(t3, t4, `Group ${g.letter}`, new Date(start.getTime() + 3 * 3600000).toISOString(), g.venue));

    // Matchday 2 (5 days later)
    matches.push(makeMatch(t1, t3, `Group ${g.letter}`, new Date(start.getTime() + 5 * day).toISOString(), g.venue));
    matches.push(makeMatch(t2, t4, `Group ${g.letter}`, new Date(start.getTime() + 5 * day + 3 * 3600000).toISOString(), g.venue));

    // Matchday 3 (10 days later)
    matches.push(makeMatch(t1, t4, `Group ${g.letter}`, new Date(start.getTime() + 10 * day).toISOString(), g.venue));
    matches.push(makeMatch(t2, t3, `Group ${g.letter}`, new Date(start.getTime() + 10 * day + 3 * 3600000).toISOString(), g.venue));
  }

  return matches;
}

export const WC_2026_GROUP_MATCHES: Match[] = buildGroupStage();

/** Get all matches for a specific group letter */
export function getGroupMatches(letter: string): Match[] {
  return WC_2026_GROUP_MATCHES.filter((m) => m.group === `Group ${letter}`);
}

/** Get all upcoming/live/finished matches */
export function getAllMatches(): Match[] {
  return WC_2026_GROUP_MATCHES;
}
