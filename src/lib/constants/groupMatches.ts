/**
 * World Cup 2026 — Group Stage Match Schedule
 *
 * 12 groups × 6 matches each = 72 group stage matches.
 * Schedule follows the announced FIFA format: June 11 – June 27, 2026.
 *
 * Note: actual fixture dates/venues will be set by FIFA closer to the event.
 * This is a plausible schedule used for display before the API connects.
 * Once `LIVESCORE_API_KEY` is set, the API hook overrides this static data.
 */

export interface StaticMatch {
  id: number;
  group: string; // "A" through "L"
  homeCode: string;
  homeName: string;
  awayCode: string;
  awayName: string;
  /** ISO 8601 UTC kickoff */
  kickoff: string;
  venue: string;
  city: string;
  matchday: 1 | 2 | 3;
}

const HOST_VENUES = {
  // USA
  metlife: { venue: "MetLife Stadium", city: "East Rutherford, NJ" },
  sofi: { venue: "SoFi Stadium", city: "Inglewood, CA" },
  att: { venue: "AT&T Stadium", city: "Arlington, TX" },
  arrowhead: { venue: "Arrowhead Stadium", city: "Kansas City, MO" },
  mercedes: { venue: "Mercedes-Benz Stadium", city: "Atlanta, GA" },
  hardrock: { venue: "Hard Rock Stadium", city: "Miami Gardens, FL" },
  lincoln: { venue: "Lincoln Financial Field", city: "Philadelphia, PA" },
  gillette: { venue: "Gillette Stadium", city: "Foxborough, MA" },
  levis: { venue: "Levi's Stadium", city: "Santa Clara, CA" },
  nrg: { venue: "NRG Stadium", city: "Houston, TX" },
  lumen: { venue: "Lumen Field", city: "Seattle, WA" },
  // Canada
  bmo: { venue: "BMO Field", city: "Toronto, ON" },
  bcplace: { venue: "BC Place", city: "Vancouver, BC" },
  // Mexico
  azteca: { venue: "Estadio Azteca", city: "Mexico City" },
  guadalajara: { venue: "Estadio Akron", city: "Guadalajara" },
  monterrey: { venue: "Estadio BBVA", city: "Monterrey" },
} as const;

let id = 1;
const m = (
  group: string,
  homeCode: string,
  homeName: string,
  awayCode: string,
  awayName: string,
  kickoff: string,
  venue: keyof typeof HOST_VENUES,
  matchday: 1 | 2 | 3,
): StaticMatch => ({
  id: id++,
  group,
  homeCode,
  homeName,
  awayCode,
  awayName,
  kickoff,
  venue: HOST_VENUES[venue].venue,
  city: HOST_VENUES[venue].city,
  matchday,
});

export const GROUP_STAGE_MATCHES: StaticMatch[] = [
  // ===== Matchday 1 (June 11–17, 2026) =====
  // Group A — Mexico hosts opener
  m("A", "mx", "Mexico", "kr", "South Korea", "2026-06-11T19:00:00Z", "azteca", 1),
  m("A", "za", "South Africa", "cz", "Czechia", "2026-06-13T19:00:00Z", "guadalajara", 1),
  // Group B — Canada
  m("B", "ca", "Canada", "ba", "Bosnia & Herzegovina", "2026-06-12T20:00:00Z", "bmo", 1),
  m("B", "qa", "Qatar", "ch", "Switzerland", "2026-06-13T16:00:00Z", "bcplace", 1),
  // Group C
  m("C", "br", "Brazil", "ma", "Morocco", "2026-06-14T19:00:00Z", "metlife", 1),
  m("C", "ht", "Haiti", "gb-sct", "Scotland", "2026-06-14T22:00:00Z", "hardrock", 1),
  // Group D — USA opener
  m("D", "us", "United States", "py", "Paraguay", "2026-06-12T00:00:00Z", "sofi", 1),
  m("D", "au", "Australia", "tr", "Turkey", "2026-06-13T22:00:00Z", "att", 1),
  // Group E
  m("E", "de", "Germany", "ci", "Ivory Coast", "2026-06-15T18:00:00Z", "mercedes", 1),
  m("E", "ec", "Ecuador", "cw", "Curacao", "2026-06-15T21:00:00Z", "lincoln", 1),
  // Group F
  m("F", "nl", "Netherlands", "jp", "Japan", "2026-06-16T17:00:00Z", "gillette", 1),
  m("F", "se", "Sweden", "tn", "Tunisia", "2026-06-16T20:00:00Z", "levis", 1),
  // Group G
  m("G", "be", "Belgium", "eg", "Egypt", "2026-06-17T19:00:00Z", "nrg", 1),
  m("G", "ir", "Iran", "nz", "New Zealand", "2026-06-17T22:00:00Z", "lumen", 1),
  // Group H
  m("H", "es", "Spain", "cv", "Cape Verde", "2026-06-15T16:00:00Z", "arrowhead", 1),
  m("H", "sa", "Saudi Arabia", "uy", "Uruguay", "2026-06-16T22:00:00Z", "monterrey", 1),
  // Group I
  m("I", "fr", "France", "sn", "Senegal", "2026-06-12T17:00:00Z", "metlife", 1),
  m("I", "iq", "Iraq", "no", "Norway", "2026-06-13T13:00:00Z", "lincoln", 1),
  // Group J
  m("J", "ar", "Argentina", "dz", "Algeria", "2026-06-11T22:00:00Z", "sofi", 1),
  m("J", "at", "Austria", "jo", "Jordan", "2026-06-12T22:00:00Z", "hardrock", 1),
  // Group K
  m("K", "pt", "Portugal", "cd", "DR Congo", "2026-06-14T16:00:00Z", "att", 1),
  m("K", "uz", "Uzbekistan", "co", "Colombia", "2026-06-14T20:00:00Z", "mercedes", 1),
  // Group L
  m("L", "gb-eng", "England", "hr", "Croatia", "2026-06-13T16:00:00Z", "gillette", 1),
  m("L", "gh", "Ghana", "pa", "Panama", "2026-06-14T19:00:00Z", "levis", 1),

  // ===== Matchday 2 (June 18–22, 2026) =====
  m("A", "mx", "Mexico", "za", "South Africa", "2026-06-18T19:00:00Z", "guadalajara", 2),
  m("A", "kr", "South Korea", "cz", "Czechia", "2026-06-19T19:00:00Z", "monterrey", 2),
  m("B", "ca", "Canada", "qa", "Qatar", "2026-06-19T22:00:00Z", "bmo", 2),
  m("B", "ba", "Bosnia & Herzegovina", "ch", "Switzerland", "2026-06-20T16:00:00Z", "bcplace", 2),
  m("C", "br", "Brazil", "ht", "Haiti", "2026-06-20T19:00:00Z", "hardrock", 2),
  m("C", "ma", "Morocco", "gb-sct", "Scotland", "2026-06-21T16:00:00Z", "lincoln", 2),
  m("D", "us", "United States", "au", "Australia", "2026-06-20T22:00:00Z", "sofi", 2),
  m("D", "py", "Paraguay", "tr", "Turkey", "2026-06-21T19:00:00Z", "att", 2),
  m("E", "de", "Germany", "ec", "Ecuador", "2026-06-22T18:00:00Z", "mercedes", 2),
  m("E", "ci", "Ivory Coast", "cw", "Curacao", "2026-06-22T21:00:00Z", "arrowhead", 2),
  m("F", "nl", "Netherlands", "se", "Sweden", "2026-06-21T17:00:00Z", "gillette", 2),
  m("F", "jp", "Japan", "tn", "Tunisia", "2026-06-22T20:00:00Z", "levis", 2),
  m("G", "be", "Belgium", "ir", "Iran", "2026-06-22T19:00:00Z", "nrg", 2),
  m("G", "eg", "Egypt", "nz", "New Zealand", "2026-06-23T22:00:00Z", "lumen", 2),
  m("H", "es", "Spain", "sa", "Saudi Arabia", "2026-06-20T16:00:00Z", "arrowhead", 2),
  m("H", "cv", "Cape Verde", "uy", "Uruguay", "2026-06-21T22:00:00Z", "monterrey", 2),
  m("I", "fr", "France", "iq", "Iraq", "2026-06-18T17:00:00Z", "metlife", 2),
  m("I", "sn", "Senegal", "no", "Norway", "2026-06-19T13:00:00Z", "lincoln", 2),
  m("J", "ar", "Argentina", "at", "Austria", "2026-06-18T22:00:00Z", "sofi", 2),
  m("J", "dz", "Algeria", "jo", "Jordan", "2026-06-19T22:00:00Z", "hardrock", 2),
  m("K", "pt", "Portugal", "uz", "Uzbekistan", "2026-06-20T16:00:00Z", "att", 2),
  m("K", "cd", "DR Congo", "co", "Colombia", "2026-06-20T20:00:00Z", "mercedes", 2),
  m("L", "gb-eng", "England", "gh", "Ghana", "2026-06-19T16:00:00Z", "gillette", 2),
  m("L", "hr", "Croatia", "pa", "Panama", "2026-06-20T19:00:00Z", "levis", 2),

  // ===== Matchday 3 (June 23–27, 2026) =====
  m("A", "mx", "Mexico", "cz", "Czechia", "2026-06-24T19:00:00Z", "azteca", 3),
  m("A", "kr", "South Korea", "za", "South Africa", "2026-06-24T19:00:00Z", "guadalajara", 3),
  m("B", "ca", "Canada", "ch", "Switzerland", "2026-06-25T22:00:00Z", "bmo", 3),
  m("B", "ba", "Bosnia & Herzegovina", "qa", "Qatar", "2026-06-25T22:00:00Z", "bcplace", 3),
  m("C", "br", "Brazil", "gb-sct", "Scotland", "2026-06-26T19:00:00Z", "metlife", 3),
  m("C", "ma", "Morocco", "ht", "Haiti", "2026-06-26T19:00:00Z", "hardrock", 3),
  m("D", "us", "United States", "tr", "Turkey", "2026-06-26T22:00:00Z", "sofi", 3),
  m("D", "py", "Paraguay", "au", "Australia", "2026-06-26T22:00:00Z", "att", 3),
  m("E", "de", "Germany", "cw", "Curacao", "2026-06-27T18:00:00Z", "mercedes", 3),
  m("E", "ci", "Ivory Coast", "ec", "Ecuador", "2026-06-27T18:00:00Z", "arrowhead", 3),
  m("F", "nl", "Netherlands", "tn", "Tunisia", "2026-06-26T17:00:00Z", "gillette", 3),
  m("F", "jp", "Japan", "se", "Sweden", "2026-06-26T17:00:00Z", "levis", 3),
  m("G", "be", "Belgium", "nz", "New Zealand", "2026-06-27T19:00:00Z", "nrg", 3),
  m("G", "eg", "Egypt", "ir", "Iran", "2026-06-27T19:00:00Z", "lumen", 3),
  m("H", "es", "Spain", "uy", "Uruguay", "2026-06-25T19:00:00Z", "arrowhead", 3),
  m("H", "cv", "Cape Verde", "sa", "Saudi Arabia", "2026-06-25T19:00:00Z", "monterrey", 3),
  m("I", "fr", "France", "no", "Norway", "2026-06-23T17:00:00Z", "metlife", 3),
  m("I", "sn", "Senegal", "iq", "Iraq", "2026-06-23T17:00:00Z", "lincoln", 3),
  m("J", "ar", "Argentina", "jo", "Jordan", "2026-06-24T22:00:00Z", "sofi", 3),
  m("J", "dz", "Algeria", "at", "Austria", "2026-06-24T22:00:00Z", "hardrock", 3),
  m("K", "pt", "Portugal", "co", "Colombia", "2026-06-25T20:00:00Z", "att", 3),
  m("K", "cd", "DR Congo", "uz", "Uzbekistan", "2026-06-25T20:00:00Z", "mercedes", 3),
  m("L", "gb-eng", "England", "pa", "Panama", "2026-06-25T19:00:00Z", "gillette", 3),
  m("L", "hr", "Croatia", "gh", "Ghana", "2026-06-25T19:00:00Z", "levis", 3),
];

/** Group matches by group letter. */
export const GROUP_MATCHES_BY_GROUP: Record<string, StaticMatch[]> = (() => {
  const result: Record<string, StaticMatch[]> = {};
  for (const match of GROUP_STAGE_MATCHES) {
    if (!result[match.group]) result[match.group] = [];
    result[match.group].push(match);
  }
  return result;
})();
