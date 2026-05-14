import type { Team } from './match';
import type { MatchScore } from './match';
import type { Match } from './match';

export interface StandingsRow {
  position: number;
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualified?: boolean;
}

export interface Group {
  letter: string;
  teams: StandingsRow[];
  matches: Match[];
}

export interface PlayerStat {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  team: Team;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface BracketSlot {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  position: number;
  team?: Team;
  score?: MatchScore;
  nextSlotId?: string;
}
