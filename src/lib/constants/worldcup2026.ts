export interface TeamData {
  name: string;
  code: string;
  fifaRanking: number;
  group: string;
  isHost: boolean;
}

export const WORLD_CUP_2026_TEAMS: TeamData[] = [
  // GROUP A
  { name: "Mexico", code: "mx", fifaRanking: 16, group: "A", isHost: true },
  { name: "South Korea", code: "kr", fifaRanking: 22, group: "A", isHost: false },
  { name: "South Africa", code: "za", fifaRanking: 60, group: "A", isHost: false },
  { name: "Czechia", code: "cz", fifaRanking: 37, group: "A", isHost: false },
  // GROUP B
  { name: "Canada", code: "ca", fifaRanking: 40, group: "B", isHost: true },
  { name: "Bosnia & Herzegovina", code: "ba", fifaRanking: 65, group: "B", isHost: false },
  { name: "Qatar", code: "qa", fifaRanking: 58, group: "B", isHost: false },
  { name: "Switzerland", code: "ch", fifaRanking: 19, group: "B", isHost: false },
  // GROUP C
  { name: "Brazil", code: "br", fifaRanking: 5, group: "C", isHost: false },
  { name: "Morocco", code: "ma", fifaRanking: 14, group: "C", isHost: false },
  { name: "Haiti", code: "ht", fifaRanking: 83, group: "C", isHost: false },
  { name: "Scotland", code: "gb-sct", fifaRanking: 39, group: "C", isHost: false },
  // GROUP D
  { name: "United States", code: "us", fifaRanking: 13, group: "D", isHost: true },
  { name: "Paraguay", code: "py", fifaRanking: 62, group: "D", isHost: false },
  { name: "Australia", code: "au", fifaRanking: 24, group: "D", isHost: false },
  { name: "Turkey", code: "tr", fifaRanking: 29, group: "D", isHost: false },
  // GROUP E
  { name: "Germany", code: "de", fifaRanking: 12, group: "E", isHost: false },
  { name: "Ivory Coast", code: "ci", fifaRanking: 48, group: "E", isHost: false },
  { name: "Ecuador", code: "ec", fifaRanking: 44, group: "E", isHost: false },
  { name: "Curacao", code: "cw", fifaRanking: 85, group: "E", isHost: false },
  // GROUP F
  { name: "Netherlands", code: "nl", fifaRanking: 7, group: "F", isHost: false },
  { name: "Japan", code: "jp", fifaRanking: 15, group: "F", isHost: false },
  { name: "Sweden", code: "se", fifaRanking: 25, group: "F", isHost: false },
  { name: "Tunisia", code: "tn", fifaRanking: 30, group: "F", isHost: false },
  // GROUP G
  { name: "Belgium", code: "be", fifaRanking: 3, group: "G", isHost: false },
  { name: "Egypt", code: "eg", fifaRanking: 35, group: "G", isHost: false },
  { name: "Iran", code: "ir", fifaRanking: 21, group: "G", isHost: false },
  { name: "New Zealand", code: "nz", fifaRanking: 95, group: "G", isHost: false },
  // GROUP H
  { name: "Spain", code: "es", fifaRanking: 2, group: "H", isHost: false },
  { name: "Cape Verde", code: "cv", fifaRanking: 72, group: "H", isHost: false },
  { name: "Saudi Arabia", code: "sa", fifaRanking: 56, group: "H", isHost: false },
  { name: "Uruguay", code: "uy", fifaRanking: 17, group: "H", isHost: false },
  // GROUP I
  { name: "France", code: "fr", fifaRanking: 4, group: "I", isHost: false },
  { name: "Senegal", code: "sn", fifaRanking: 20, group: "I", isHost: false },
  { name: "Iraq", code: "iq", fifaRanking: 68, group: "I", isHost: false },
  { name: "Norway", code: "no", fifaRanking: 27, group: "I", isHost: false },
  // GROUP J
  { name: "Argentina", code: "ar", fifaRanking: 1, group: "J", isHost: false },
  { name: "Algeria", code: "dz", fifaRanking: 52, group: "J", isHost: false },
  { name: "Austria", code: "at", fifaRanking: 26, group: "J", isHost: false },
  { name: "Jordan", code: "jo", fifaRanking: 74, group: "J", isHost: false },
  // GROUP K
  { name: "Portugal", code: "pt", fifaRanking: 6, group: "K", isHost: false },
  { name: "DR Congo", code: "cd", fifaRanking: 55, group: "K", isHost: false },
  { name: "Uzbekistan", code: "uz", fifaRanking: 70, group: "K", isHost: false },
  { name: "Colombia", code: "co", fifaRanking: 11, group: "K", isHost: false },
  // GROUP L
  { name: "England", code: "gb-eng", fifaRanking: 5, group: "L", isHost: false },
  { name: "Croatia", code: "hr", fifaRanking: 10, group: "L", isHost: false },
  { name: "Ghana", code: "gh", fifaRanking: 66, group: "L", isHost: false },
  { name: "Panama", code: "pa", fifaRanking: 49, group: "L", isHost: false },
];

export const WORLD_CUP_2026_GROUPS: Record<string, TeamData[]> = {
  A: WORLD_CUP_2026_TEAMS.filter(t => t.group === "A"),
  B: WORLD_CUP_2026_TEAMS.filter(t => t.group === "B"),
  C: WORLD_CUP_2026_TEAMS.filter(t => t.group === "C"),
  D: WORLD_CUP_2026_TEAMS.filter(t => t.group === "D"),
  E: WORLD_CUP_2026_TEAMS.filter(t => t.group === "E"),
  F: WORLD_CUP_2026_TEAMS.filter(t => t.group === "F"),
  G: WORLD_CUP_2026_TEAMS.filter(t => t.group === "G"),
  H: WORLD_CUP_2026_TEAMS.filter(t => t.group === "H"),
  I: WORLD_CUP_2026_TEAMS.filter(t => t.group === "I"),
  J: WORLD_CUP_2026_TEAMS.filter(t => t.group === "J"),
  K: WORLD_CUP_2026_TEAMS.filter(t => t.group === "K"),
  L: WORLD_CUP_2026_TEAMS.filter(t => t.group === "L"),
};

export const TOURNAMENT_INFO = {
  name: "2026 FIFA World Cup",
  hosts: ["United States", "Canada", "Mexico"],
  kickoff: "2026-06-11T00:00:00Z",
  final: "2026-07-19T00:00:00Z",
  venue: "MetLife Stadium, East Rutherford, NJ",
  teams: 48,
  groups: 12,
  matches: 104,
};
