# Requirements Document

## Introduction

$WCBLIVE (WorldCupBetLive) is a World Cup 2026 community prediction platform built on the Solana blockchain ecosystem, powered by a memecoin token launched on Pump.fun. The website is designed to capture World Cup 2026 hype and convert it into organic token buying momentum. It is NOT a real gambling or betting platform — it is a community-driven prediction experience that uses live World Cup data, real-time sports content, and FOMO-driven UX to create demand for the $WCBLIVE token.

The platform operates in three phases:
- **Pre-launch (Now — May 20, 2026):** Website live with all prediction features marked "Coming Soon". Focus on early adopter acquisition and token awareness.
- **Whitelist Phase (May 20 — June 1, 2026):** NFT whitelist opens, early adopter leaderboard activates.
- **NFT & Beta Phase (June 1 — June 11, 2026):** NFT drop, staking preview, beta access for top holders.
- **Live Phase (June 11, 2026+):** World Cup kickoff, predictions open, full platform active.

The website is built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and React Query, hosted on Vercel.

---

## Glossary

- **Website**: The $WCBLIVE Next.js 14 web application hosted on Vercel.
- **User**: Any visitor to the Website, whether or not they hold $WCBLIVE tokens.
- **Holder**: A User whose connected Solana wallet contains $WCBLIVE tokens.
- **Countdown_Timer**: The animated countdown component displaying time remaining until World Cup 2026 kickoff (June 11, 2026 00:00 UTC).
- **Match_Card**: A UI component displaying two competing teams, their flags, kickoff time, and current match status.
- **Match_Center**: The section of the Website displaying all Match_Cards with live and upcoming match data.
- **Group_Explorer**: The section displaying all 12 World Cup 2026 groups with mini standings tables and match details.
- **Standings_Section**: The section displaying top scorers, assist leaders, clean sheets, card statistics, and the knockout bracket.
- **Token_Section**: The section displaying real-time $WCBLIVE token price, market cap, holder count, and buy CTAs.
- **Leaderboard**: The Early Adopters Leaderboard ranking wallets by $WCBLIVE token holdings.
- **Milestone_Tracker**: The component displaying progress bars toward community milestones.
- **Community_Wall**: The section embedding the Twitter/X feed and Telegram announcements.
- **Coming_Soon_Modal**: The modal dialog shown when a User interacts with any prediction or wallet feature before June 11, 2026.
- **Live_Score_API**: The third-party API providing match schedules, live scores, standings, and player statistics.
- **CoinGecko_API**: The third-party API providing $WCBLIVE token price, market cap, and holder data.
- **Pump_fun**: The Solana-based token launchpad where $WCBLIVE was created and can be purchased.
- **Jupiter**: The Solana DEX aggregator where $WCBLIVE can be swapped.
- **NFT_Pass**: The "World Cup Prediction Pass" NFT collection dropping June 1, 2026.
- **Tier**: A Leaderboard rank level — Bronze, Silver, Gold, or Platinum — assigned based on token holdings.
- **Badge**: A special achievement marker on the Leaderboard — "Diamond Hands", "Early Bird", or "Whale".
- **Bracket**: The knockout stage bracket visualization from Round of 32 to the Final.
- **React_Query**: The data-fetching and caching library used for all API calls.
- **Framer_Motion**: The animation library used for transitions, counters, and celebration effects.

---

## Requirements

### Requirement 1: Landing Page and Hero Section

**User Story:** As a football fan or crypto user visiting the Website for the first time, I want to immediately understand what $WCBLIVE is and feel the excitement of the upcoming World Cup, so that I am motivated to explore the platform and buy the token.

#### Acceptance Criteria

1. THE Website SHALL display a full-viewport hero section as the first visible content on the landing page.
2. THE Website SHALL display the headline "World Cup 2026. Live. On Solana. Predict Everything." prominently in the hero section.
3. THE Website SHALL display the subheadline "Hold $WCBLIVE. Unlock the game. Win the cup." below the main headline.
4. THE Countdown_Timer SHALL display the time remaining until June 11, 2026 00:00 UTC in days, hours, minutes, and seconds format.
5. WHEN the Countdown_Timer reaches zero, THE Countdown_Timer SHALL transition to display "Predictions Are Live!" and cease countdown.
6. THE Countdown_Timer SHALL update every second in real time without requiring a page refresh.
7. THE Website SHALL display a primary "Buy $WCBLIVE" call-to-action button in the hero section that redirects the User to Pump.fun in a new browser tab.
8. THE Website SHALL display a secondary "Explore Matches" call-to-action button in the hero section that scrolls the User to the Match_Center section.
9. THE Website SHALL render the hero section with a visually immersive background incorporating football and Solana/crypto visual themes.
10. IF the User's device viewport width is less than 768px, THEN THE Website SHALL render the hero section in a single-column mobile-optimized layout.

---

### Requirement 2: Navigation Bar

**User Story:** As a User, I want a persistent navigation bar that lets me jump to any section of the Website and access the wallet connection flow, so that I can navigate efficiently and understand the platform's structure.

#### Acceptance Criteria

1. THE Website SHALL display a sticky navigation bar visible at all times while scrolling.
2. THE Website SHALL display the $WCBLIVE logo and brand name in the navigation bar.
3. THE Website SHALL display navigation links to: Match Center, Groups, Standings, Token, Leaderboard, and Community sections.
4. WHEN a User clicks a navigation link, THE Website SHALL smoothly scroll to the corresponding section.
5. THE Website SHALL display a "Connect Wallet" button in the navigation bar.
6. WHEN a User clicks the "Connect Wallet" button before June 11, 2026, THE Website SHALL display the Coming_Soon_Modal.
7. THE Coming_Soon_Modal SHALL display the Countdown_Timer, the message "Predictions Open June 11, 2026 — Early holders get priority access.", and a "Get $WCBLIVE Early — Buy on Pump.fun" CTA button.
8. WHEN a User clicks the "Get $WCBLIVE Early — Buy on Pump.fun" CTA button inside the Coming_Soon_Modal, THE Website SHALL redirect the User to Pump.fun in a new browser tab.
9. IF the User's device viewport width is less than 768px, THEN THE Website SHALL collapse the navigation links into a hamburger menu.
10. WHEN a User opens the hamburger menu, THE Website SHALL display all navigation links in a full-screen or dropdown overlay.

---

### Requirement 3: Live Match Center

**User Story:** As a football fan, I want to see all World Cup 2026 matches with live scores and statuses in real time, so that I feel engaged with the tournament and am motivated to participate in predictions.

#### Acceptance Criteria

1. THE Match_Center SHALL display Match_Cards for all scheduled, live, and completed World Cup 2026 matches sourced from the Live_Score_API.
2. EACH Match_Card SHALL display the home team flag, home team name, away team flag, away team name, kickoff time in the User's local timezone, and current match status.
3. WHEN a match status is "Live", THE Match_Card SHALL display an animated blinking green dot indicator alongside the "LIVE" label.
4. WHEN a match status is "Live", THE Match_Card SHALL display the current score updated in real time.
5. THE Match_Center SHALL refresh live match data from the Live_Score_API at an interval no greater than 60 seconds without requiring a page reload.
6. THE Match_Center SHALL display matches grouped by date, with the current day's matches shown first.
7. EACH Match_Card SHALL display a "Predict" button.
8. WHEN a User clicks the "Predict" button on any Match_Card before June 11, 2026, THE Website SHALL display the Coming_Soon_Modal with the message "Predictions Open June 11, 2026 — Connect Wallet to Join" and the CTA "Get $WCBLIVE Early — Buy on Pump.fun".
9. IF the Live_Score_API returns an error or is unavailable, THEN THE Match_Center SHALL display the last successfully cached match data and show a non-blocking "Data may be delayed" notice.
10. IF no matches are scheduled for the current day, THEN THE Match_Center SHALL display the next upcoming match date's matches.
11. THE Match_Center SHALL support filtering Match_Cards by status: All, Live, Upcoming, Finished.
12. WHEN a User applies a filter, THE Match_Center SHALL display only Match_Cards matching the selected status without a page reload.

---

### Requirement 4: Group Stage Explorer

**User Story:** As a football fan, I want to explore all 12 World Cup 2026 groups with standings and match results, so that I can follow my favorite team's progress and feel invested in the tournament.

#### Acceptance Criteria

1. THE Group_Explorer SHALL display all 12 World Cup 2026 groups, each identified by their group letter (A through L).
2. EACH group card SHALL display a mini standings table with columns: Position, Team, Played (P), Wins (W), Draws (D), Losses (L), Goals For (GF), Goals Against (GA), Goal Difference (GD), and Points (Pts).
3. THE Group_Explorer SHALL source all standings data from the Live_Score_API.
4. WHEN a group stage match finishes, THE Group_Explorer SHALL update the affected group's standings table within 120 seconds of the final whistle.
5. EACH group card SHALL be expandable to reveal the individual match schedule and results within that group.
6. WHEN a User clicks to expand a group card, THE Website SHALL display all matches within that group with scores, dates, and statuses using a smooth Framer_Motion animation.
7. EACH group card SHALL display a "Predict" button.
8. WHEN a User clicks the "Predict" button on any group card before June 11, 2026, THE Website SHALL display the Coming_Soon_Modal.
9. THE Group_Explorer SHALL display teams that have qualified for the knockout stage with a visual "Qualified" indicator.
10. IF the Live_Score_API standings data is unavailable, THEN THE Group_Explorer SHALL display the last cached standings data and indicate the last successful update timestamp.
11. THE Group_Explorer SHALL render all 12 group cards in a responsive grid layout — 3 columns on desktop, 2 columns on tablet, 1 column on mobile.

---

### Requirement 5: Standings and Statistics Section

**User Story:** As a football fan, I want to see top scorers, assist leaders, disciplinary stats, and the knockout bracket, so that I can follow individual player performances and the tournament's progression toward the Final.

#### Acceptance Criteria

1. THE Standings_Section SHALL display a top scorers leaderboard sourced from the Live_Score_API, showing player name, team flag, and goals scored.
2. THE Standings_Section SHALL display an assist leaders leaderboard sourced from the Live_Score_API, showing player name, team flag, and assists.
3. THE Standings_Section SHALL display clean sheet statistics sourced from the Live_Score_API, showing goalkeeper or team name and clean sheet count.
4. THE Standings_Section SHALL display disciplinary statistics sourced from the Live_Score_API, showing yellow card and red card counts per player or team.
5. THE Standings_Section SHALL display the "Road to Knockout" Bracket visualization covering all knockout rounds from Round of 32 to the Final.
6. EACH Bracket node SHALL display the team name and flag for qualified teams, and "TBD" for unqualified slots.
7. EACH Bracket node SHALL display a "Predict Winner" button.
8. WHEN a User clicks the "Predict Winner" button on any Bracket node before June 11, 2026, THE Website SHALL display the Coming_Soon_Modal.
9. WHEN a knockout match result is confirmed, THE Bracket SHALL update the winning team into the next round's node within 120 seconds.
10. THE Standings_Section SHALL update all statistics from the Live_Score_API at an interval no greater than 300 seconds.
11. IF the Live_Score_API statistics data is unavailable, THEN THE Standings_Section SHALL display the last cached statistics and indicate the last successful update timestamp.

---

### Requirement 6: Token Section ($WCBLIVE)

**User Story:** As a crypto user or football fan, I want to see real-time $WCBLIVE token metrics and understand the token's value proposition, so that I am informed and motivated to buy and hold the token.

#### Acceptance Criteria

1. THE Token_Section SHALL display the current $WCBLIVE token price in USD sourced from the CoinGecko_API.
2. THE Token_Section SHALL display the current $WCBLIVE market capitalization in USD sourced from the CoinGecko_API.
3. THE Token_Section SHALL display the current $WCBLIVE holder count sourced from the CoinGecko_API or an on-chain data provider.
4. THE Token_Section SHALL display the total burned $WCBLIVE token supply.
5. THE Token_Section SHALL refresh token metrics from the CoinGecko_API at an interval no greater than 60 seconds.
6. THE Token_Section SHALL display a "Buy $WCBLIVE" button that redirects the User to Pump.fun in a new browser tab.
7. THE Token_Section SHALL display a secondary "Swap on Jupiter" button that redirects the User to the Jupiter swap interface for $WCBLIVE in a new browser tab.
8. THE Token_Section SHALL display a preview card for the NFT_Pass labeled "World Cup Prediction Pass" with the text "Drops June 1, 2026".
9. THE Token_Section SHALL display the copy: "$WCBLIVE is the official token of WorldCupBetLive. Hold to unlock predictions, climb the leaderboard, and win exclusive rewards."
10. IF the CoinGecko_API returns an error or is unavailable, THEN THE Token_Section SHALL display the last successfully cached token metrics and show a non-blocking "Price data may be delayed" notice.
11. WHEN the token price changes between two consecutive API polls, THE Token_Section SHALL animate the price display to indicate the direction of change (green for increase, red for decrease).

---

### Requirement 7: Early Adopters Leaderboard

**User Story:** As a $WCBLIVE token holder, I want to see my rank among other holders and earn badges for my loyalty, so that I feel recognized and motivated to hold and accumulate more tokens.

#### Acceptance Criteria

1. THE Leaderboard SHALL display wallet addresses ranked in descending order by $WCBLIVE token holdings amount.
2. THE Leaderboard SHALL display each entry with: rank position, truncated wallet address (first 4 and last 4 characters), token holdings amount, Tier badge, and any earned achievement Badges.
3. THE Leaderboard SHALL assign Tiers based on token holdings: Bronze (lowest tier), Silver, Gold, and Platinum (highest tier), with specific thresholds defined in the design document.
4. THE Leaderboard SHALL award the "Diamond Hands" Badge to wallets that have held $WCBLIVE continuously for 30 or more days.
5. THE Leaderboard SHALL award the "Early Bird" Badge to wallets that purchased $WCBLIVE on the day of the token's launch.
6. THE Leaderboard SHALL award the "Whale" Badge to wallets holding 10,000,000 or more $WCBLIVE tokens.
7. THE Leaderboard SHALL refresh rankings at an interval no greater than 300 seconds.
8. IF a wallet qualifies for multiple Badges, THEN THE Leaderboard SHALL display all earned Badges for that wallet entry.
9. THE Leaderboard SHALL display a minimum of the top 100 ranked wallets.
10. THE Leaderboard SHALL support pagination or infinite scroll to display rankings beyond the top 100.
11. IF on-chain data is unavailable, THEN THE Leaderboard SHALL display the last cached rankings and indicate the last successful update timestamp.

---

### Requirement 8: Milestone Tracker

**User Story:** As a community member, I want to see the community's progress toward key milestones, so that I feel part of a growing movement and am motivated to contribute by buying tokens and spreading the word.

#### Acceptance Criteria

1. THE Milestone_Tracker SHALL display progress bars for the following milestones: 10,000 Holders, $1,000,000 Market Cap, 5,000 Discord Members, and Feature Launch.
2. EACH progress bar SHALL display the current value, the target value, and the percentage completion.
3. THE Milestone_Tracker SHALL update milestone progress data at an interval no greater than 300 seconds.
4. WHEN a milestone reaches 100% completion, THE Website SHALL display a celebration animation using Framer_Motion on the corresponding milestone bar.
5. WHEN a milestone reaches 100% completion, THE Milestone_Tracker SHALL mark the milestone as "Achieved" with a distinct visual indicator.
6. THE Milestone_Tracker SHALL source holder count and market cap data from the same CoinGecko_API or on-chain data provider used by the Token_Section.
7. IF milestone data is unavailable, THEN THE Milestone_Tracker SHALL display the last cached progress values and indicate the last successful update timestamp.

---

### Requirement 9: Community Wall

**User Story:** As a User, I want to see live community activity from Twitter/X and Telegram, so that I can gauge community sentiment, discover new content, and feel part of the $WCBLIVE movement.

#### Acceptance Criteria

1. THE Community_Wall SHALL display an embedded Twitter/X feed showing posts tagged with #WCBLIVE.
2. THE Community_Wall SHALL display an embedded Telegram announcement feed from the official $WCBLIVE Telegram channel.
3. THE Community_Wall SHALL display partner badges: "Powered by Solana", "Built on Pump.fun", and "Data by Live Score API".
4. WHEN a new tweet containing #WCBLIVE is published, THE Community_Wall SHALL display it in the Twitter/X feed within the platform's standard embed refresh interval.
5. WHEN a new announcement is posted to the official Telegram channel, THE Community_Wall SHALL display it in the Telegram feed within 60 seconds.
6. IF the Twitter/X embed fails to load, THEN THE Community_Wall SHALL display a fallback message: "Follow @WCBLIVE on X for the latest updates" with a link to the official account.
7. IF the Telegram embed fails to load, THEN THE Community_Wall SHALL display a fallback message: "Join our Telegram for announcements" with a link to the official channel.

---

### Requirement 10: Coming Soon UX and Pre-Launch State

**User Story:** As a User visiting before June 11, 2026, I want to clearly understand that predictions are not yet open while still feeling the excitement and urgency to buy the token early, so that I take action before the platform goes live.

#### Acceptance Criteria

1. WHILE the current date is before June 11, 2026, THE Website SHALL display all prediction-related buttons (Predict, Predict Winner, Connect Wallet) in a visually distinct "Coming Soon" state.
2. WHEN a User interacts with any Coming Soon element before June 11, 2026, THE Website SHALL display the Coming_Soon_Modal without navigating away from the current page.
3. THE Coming_Soon_Modal SHALL always display: the Countdown_Timer, a phase-appropriate message, and a "Get $WCBLIVE Early — Buy on Pump.fun" CTA button.
4. WHEN a User hovers over a live match card before June 11, 2026, THE Website SHALL display the tooltip "Live Predictions Coming Soon — Follow @WCBLIVE for updates".
5. THE Website SHALL display the NFT_Pass preview with the label "Drops June 1, 2026 — Hold $WCBLIVE for Whitelist" before June 1, 2026.
6. WHEN the current date reaches or passes June 11, 2026, THE Website SHALL automatically transition all Coming Soon elements to their active state without requiring a deployment.
7. THE Website SHALL determine the pre-launch vs. live state based on a server-side or build-time environment variable representing the launch date, enabling date override for testing.

---

### Requirement 11: Responsive Design and Accessibility

**User Story:** As a User on any device, I want the Website to be fully usable on mobile, tablet, and desktop, so that I can access $WCBLIVE content wherever I am.

#### Acceptance Criteria

1. THE Website SHALL render correctly and be fully functional on viewport widths of 320px, 768px, and 1280px and above.
2. THE Website SHALL achieve a Lighthouse performance score of 70 or above on mobile.
3. THE Website SHALL use semantic HTML elements (header, nav, main, section, article, footer) throughout.
4. THE Website SHALL provide descriptive alt text for all images, including team flag images.
5. THE Website SHALL ensure all interactive elements (buttons, links, modals) are keyboard navigable and focusable.
6. THE Website SHALL maintain a color contrast ratio of at least 4.5:1 for all body text against its background, per WCAG 2.1 AA standards.
7. THE Website SHALL display all monetary values (token price, market cap) with appropriate currency formatting (e.g., "$0.000042", "$1,234,567").
8. THE Website SHALL display all dates and times in the User's local timezone with the timezone abbreviation shown.
9. IF a User has the operating system "prefers-reduced-motion" setting enabled, THEN THE Website SHALL disable or reduce all Framer_Motion animations.

---

### Requirement 12: Performance and Data Caching

**User Story:** As a User, I want the Website to load quickly and remain responsive even when external APIs are slow or unavailable, so that I have a smooth experience at all times.

#### Acceptance Criteria

1. THE Website SHALL achieve a First Contentful Paint (FCP) of under 2.5 seconds on a standard broadband connection.
2. THE React_Query client SHALL cache all Live_Score_API responses with a stale time of no less than 30 seconds.
3. THE React_Query client SHALL cache all CoinGecko_API responses with a stale time of no less than 30 seconds.
4. THE Website SHALL serve static assets (images, fonts, scripts) with cache headers of at least 1 year for versioned assets.
5. WHEN an API request fails, THE React_Query client SHALL retry the request up to 3 times with exponential backoff before displaying an error state.
6. THE Website SHALL use Next.js Image Optimization for all team flag and hero images to serve appropriately sized images per viewport.
7. THE Website SHALL implement code splitting via Next.js App Router so that each major section loads its JavaScript bundle independently.

---

### Requirement 13: SEO and Social Sharing

**User Story:** As the $WCBLIVE team, I want the Website to rank well in search engines and generate compelling social media previews, so that organic traffic and sharing amplify token awareness.

#### Acceptance Criteria

1. THE Website SHALL include a unique `<title>` tag and `<meta name="description">` tag on the root page optimized for "World Cup 2026 predictions Solana crypto".
2. THE Website SHALL include Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:url`) for rich social media link previews.
3. THE Website SHALL include Twitter Card meta tags for rich Twitter/X link previews.
4. THE Website SHALL include a `robots.txt` file allowing all search engine crawlers.
5. THE Website SHALL include a `sitemap.xml` file listing all public pages.
6. THE Website SHALL use canonical URL tags to prevent duplicate content indexing.

---

## Correctness Properties for Property-Based Testing

### Property 1: Countdown Timer Correctness

**Target:** Countdown_Timer component

**Property:** FOR ALL moments in time T where T is before June 11, 2026 00:00 UTC, the Countdown_Timer SHALL display a non-negative value for days, hours, minutes, and seconds, and the sum of all displayed units SHALL equal the total remaining seconds until the target date.

**Pattern:** Invariant — the decomposition of remaining duration into days/hours/minutes/seconds must always be consistent and non-negative.

**Test approach:** Generate random timestamps before June 11, 2026. For each timestamp, compute the expected remaining duration and verify that `days * 86400 + hours * 3600 + minutes * 60 + seconds` equals the total remaining seconds, and all components are non-negative integers.

---

### Property 2: Leaderboard Ranking Consistency

**Target:** Leaderboard ranking logic

**Property:** FOR ALL sets of wallet holdings data, the Leaderboard ranking SHALL be a total ordering where rank N always has token holdings greater than or equal to rank N+1, and no two wallets share the same rank position.

**Pattern:** Invariant — sorted order must be preserved and ranks must be unique and contiguous.

**Test approach:** Generate random arrays of wallet/holdings pairs. Apply the ranking function and verify: (1) the output is sorted in descending order by holdings, (2) ranks are assigned 1..N with no gaps or duplicates, (3) the set of wallets in output equals the set of wallets in input (no data loss).

---

### Property 3: Tier Assignment Completeness

**Target:** Leaderboard Tier assignment logic

**Property:** FOR ALL valid token holding amounts, the Tier assignment function SHALL return exactly one Tier (Bronze, Silver, Gold, or Platinum), and the assignment SHALL be deterministic — the same holdings amount always produces the same Tier.

**Pattern:** Invariant + Idempotence — every input maps to exactly one output, and repeated application returns the same result.

**Test approach:** Generate random non-negative token holding amounts. Verify: (1) the result is always one of {Bronze, Silver, Gold, Platinum}, (2) calling the function twice with the same input returns the same Tier, (3) the Tier boundaries are monotonically ordered (higher holdings never produce a lower Tier than lower holdings).

---

### Property 4: Badge Award Correctness

**Target:** Badge eligibility logic

**Property:** FOR ALL wallet histories, the Badge award function SHALL be idempotent — evaluating badge eligibility twice on the same wallet history SHALL produce the same set of badges, and awarding a badge that is already awarded SHALL not duplicate it.

**Pattern:** Idempotence — f(x) = f(f(x)) for badge sets.

**Test approach:** Generate random wallet histories (purchase date, holding duration, current balance). Apply badge evaluation twice. Verify the resulting badge set is identical both times and contains no duplicate badge entries.

---

### Property 5: Match Card Status Consistency

**Target:** Match_Card status rendering logic

**Property:** FOR ALL match data objects returned by the Live_Score_API, the Match_Card status display SHALL be a deterministic function of the match's status field — the same status value always renders the same visual state (Upcoming, Live with blinking dot, Finished).

**Pattern:** Invariant — status rendering is a pure function of input data.

**Test approach:** Generate match data objects with all possible status values. Verify: (1) "Live" status always produces the blinking dot indicator, (2) "Upcoming" status never produces a score display, (3) "Finished" status always produces a final score display, (4) no status value produces an undefined or error render state.

---

### Property 6: Group Standings Table Arithmetic

**Target:** Group standings calculation logic

**Property:** FOR ALL sets of match results within a group, the computed standings table SHALL satisfy: (1) Points = (Wins × 3) + (Draws × 1), (2) Played = Wins + Draws + Losses, (3) GD = GF − GA, (4) the sum of all teams' GF equals the sum of all teams' GA within the group.

**Pattern:** Invariant — mathematical relationships between standings columns must always hold.

**Test approach:** Generate random sets of group match results (home score, away score for each match). Compute standings and verify all four arithmetic invariants hold for every team in the group.

---

### Property 7: Token Price Display Formatting

**Target:** Token price and market cap formatting utility

**Property:** FOR ALL valid positive numeric token price values, the price formatting function SHALL produce a string that: (1) begins with "$", (2) contains exactly one decimal point, (3) represents a value numerically equal to the input (round-trip: parse(format(x)) ≈ x within floating-point tolerance), (4) uses comma separators for values ≥ 1,000.

**Pattern:** Round-trip + Invariant — formatting and parsing must be consistent.

**Test approach:** Generate random positive floats representing token prices across a wide range (0.000001 to 1,000,000). Apply the format function, then parse the result back to a number. Verify the parsed value equals the original within a tolerance of 0.0001%, and all structural invariants hold.

---

### Property 8: Milestone Progress Bar Bounds

**Target:** Milestone_Tracker progress calculation

**Property:** FOR ALL current value and target value pairs, the progress percentage computed by the Milestone_Tracker SHALL always be a number in the range [0, 100] inclusive, and SHALL never exceed 100 even when the current value exceeds the target.

**Pattern:** Invariant — progress percentage is always clamped to [0, 100].

**Test approach:** Generate random (current, target) pairs including edge cases where current > target, current = 0, current = target, and target = 0. Verify the computed percentage is always within [0, 100] and equals `min(100, (current / target) * 100)` for target > 0.

---

### Property 9: Coming Soon State Determinism

**Target:** Pre-launch / live state determination logic

**Property:** FOR ALL input timestamps, the launch state function SHALL be deterministic and consistent — any timestamp before June 11, 2026 00:00 UTC SHALL return "pre-launch", and any timestamp at or after that moment SHALL return "live", with no timestamp producing an undefined or error state.

**Pattern:** Invariant — the state function is a total function over all valid timestamps.

**Test approach:** Generate random timestamps spanning from January 1, 2020 to December 31, 2030. Verify: (1) all timestamps before the launch date return "pre-launch", (2) all timestamps at or after the launch date return "live", (3) the boundary timestamp (June 11, 2026 00:00:00 UTC) returns "live", (4) no input produces a result outside {"pre-launch", "live"}.

---

### Property 10: API Response Caching Round-Trip

**Target:** React_Query caching layer for Live_Score_API and CoinGecko_API

**Property:** FOR ALL valid API responses, storing a response in the React_Query cache and immediately retrieving it SHALL return data that is structurally and value-equivalent to the original response (round-trip property).

**Pattern:** Round-trip — cache(store(x)) = x.

**Test approach:** Generate random valid API response objects conforming to the Live_Score_API and CoinGecko_API response schemas. Store each in the React_Query cache with a known query key, then retrieve by the same key. Verify the retrieved data deep-equals the stored data with no field loss, type coercion, or mutation.
