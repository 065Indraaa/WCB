export type MatchStatus = 'NS' | '1H' | 'HT' | '2H' | 'ET' | 'PEN' | 'FT' | 'AET' | 'CANC' | 'PST';

export type MatchDisplayStatus = 'UPCOMING' | 'LIVE' | 'HALFTIME' | 'FINISHED';

export interface Team {
  id: number;
  name: string;
  code: string;
  logo: string;
  fifaRanking?: number;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  kickoff: string;
  status: MatchStatus;
  displayStatus: MatchDisplayStatus;
  score: MatchScore;
  group: string;
  round: string;
  venue: string;
  elapsed?: number;
}
