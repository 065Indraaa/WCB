import type { Match, MatchDisplayStatus } from '@/types/match';
import { GROUP_STAGE_MATCHES, type StaticMatch } from '@/lib/constants/groupMatches';

let teamId = 1;
const teamIdCache = new Map<string, number>();
function ensureTeamId(code: string): number {
  if (!teamIdCache.has(code)) {
    teamIdCache.set(code, teamId++);
  }
  return teamIdCache.get(code)!;
}

function deriveDisplayStatus(kickoff: string, now: Date): MatchDisplayStatus {
  const kickoffTime = new Date(kickoff).getTime();
  const nowTime = now.getTime();
  const diff = nowTime - kickoffTime;

  // Match window heuristic — 0 to 105 min after kickoff = LIVE/HALFTIME
  if (diff < 0) return 'UPCOMING';
  if (diff > 105 * 60 * 1000) return 'FINISHED';
  if (diff >= 45 * 60 * 1000 && diff <= 60 * 60 * 1000) return 'HALFTIME';
  return 'LIVE';
}

/** Convert a static match into the canonical Match shape. */
export function staticToMatch(s: StaticMatch, now: Date = new Date()): Match {
  const displayStatus = deriveDisplayStatus(s.kickoff, now);
  return {
    id: s.id,
    homeTeam: {
      id: ensureTeamId(s.homeCode),
      name: s.homeName,
      code: s.homeCode,
      logo: '',
    },
    awayTeam: {
      id: ensureTeamId(s.awayCode),
      name: s.awayName,
      code: s.awayCode,
      logo: '',
    },
    kickoff: s.kickoff,
    status:
      displayStatus === 'LIVE'
        ? '1H'
        : displayStatus === 'HALFTIME'
        ? 'HT'
        : displayStatus === 'FINISHED'
        ? 'FT'
        : 'NS',
    displayStatus,
    score: { home: null, away: null },
    group: `Group ${s.group}`,
    round: 'Group Stage',
    venue: `${s.venue}, ${s.city}`,
  };
}

/** Get all group stage matches as canonical Match objects. */
export function getAllStaticMatches(now: Date = new Date()): Match[] {
  return GROUP_STAGE_MATCHES.map((s) => staticToMatch(s, now));
}

/** Get static matches filtered by group letter. */
export function getStaticMatchesByGroup(letter: string, now: Date = new Date()): Match[] {
  return GROUP_STAGE_MATCHES.filter((m) => m.group === letter).map((s) =>
    staticToMatch(s, now),
  );
}
