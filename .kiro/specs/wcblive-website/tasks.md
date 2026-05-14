# Implementation Plan: $WCBLIVE Website

## Overview

Build the $WCBLIVE World Cup 2026 community prediction platform as a Next.js 14 (App Router) single-page application. The implementation proceeds from project scaffolding and pure utility logic, through API integration and data hooks, to UI sections and final wiring. All prediction features are gated behind the pre-launch state until June 11, 2026.

## Tasks

- [x] 1. Project scaffolding and configuration
  - Initialize Next.js 14 App Router project with TypeScript 5 and Tailwind CSS
  - Configure `tailwind.config.ts` with the Solana color palette (`--solana-purple`, `--solana-green`, `--bg-primary`, `--bg-secondary`, `--bg-card`, `--gold`, `--live-green`, `--error-red`, `--text-secondary`)
  - Add `globals.css` with CSS custom properties and Tailwind base layers
  - Install and configure Framer Motion 11, TanStack Query v5, and `canvas-confetti`
  - Install and configure Vitest + React Testing Library + fast-check for property-based tests
  - Set up `.env.local` with all environment variable stubs (`NEXT_PUBLIC_LAUNCH_DATE`, `LIVESCORE_API_KEY`, `COINGECKO_API_KEY`, `HELIUS_API_KEY`, `NEXT_PUBLIC_PUMPFUN_URL`, `NEXT_PUBLIC_JUPITER_URL`, etc.)
  - Configure `next.config.ts` with image domains (`flagcdn.com`) and Edge Runtime settings
  - _Requirements: 11.1, 12.1, 12.4, 12.7_

- [x] 2. TypeScript types and static data
  - [x] 2.1 Create all TypeScript type definitions
    - Write `src/types/match.ts`: `MatchStatus`, `MatchDisplayStatus`, `Team`, `MatchScore`, `Match`
    - Write `src/types/standings.ts`: `StandingsRow`, `Group`, `PlayerStat`, `BracketSlot`
    - Write `src/types/token.ts`: `TokenMetrics`, `PriceDirection`
    - Write `src/types/leaderboard.ts`: `Tier`, `Badge`, `WalletEntry`
    - _Requirements: 3.2, 4.2, 6.1, 7.2_

  - [x] 2.2 Create static World Cup 2026 data constants
    - Write `src/lib/constants/worldcup2026.ts` with all 48 teams across 12 groups (Groups A–L), `WORLD_CUP_2026_GROUPS` record, and `TOURNAMENT_INFO`
    - Write `src/lib/constants/milestones.ts` with milestone targets and labels
    - _Requirements: 4.1, 8.1_

- [x] 3. Pure utility functions
  - [x] 3.1 Implement launch state utility
    - Write `src/lib/utils/launchState.ts`: `LAUNCH_DATES` constants, `getLaunchState(now)`, `isLive(now)` — pure functions with no side effects
    - Support `NEXT_PUBLIC_LAUNCH_DATE` environment variable override
    - _Requirements: 10.6, 10.7_

  - [ ]* 3.2 Write property test for launch state (Property 2)
    - **Property 2: Launch State Totality and Determinism**
    - **Validates: Requirements 10.7**
    - File: `src/lib/utils/__tests__/launchState.property.test.ts`
    - Generate timestamps spanning 2020–2030; verify totality, determinism, and boundary correctness at May 20 / June 1 / June 11, 2026

  - [x] 3.3 Implement formatter utilities
    - Write `src/lib/utils/formatters.ts`: `formatPrice(price)`, `formatMarketCap(value)`, `formatWallet(address)`, `formatMatchTime(isoDate)`, `computeCountdown(target, now)`
    - `formatPrice` must start with "$", use appropriate decimal places, and comma-separate values ≥ 1,000
    - `computeCountdown` returns `{ days, hours, minutes, seconds }` as non-negative integers or `null` if target has passed
    - _Requirements: 1.4, 1.6, 11.7, 11.8_

  - [ ]* 3.4 Write property test for countdown decomposition (Property 1)
    - **Property 1: Countdown Timer Decomposition Correctness**
    - **Validates: Requirements 1.4**
    - File: `src/lib/utils/__tests__/countdown.property.test.ts`
    - Generate random timestamps before June 11, 2026; verify `days * 86400 + hours * 3600 + minutes * 60 + seconds` equals total remaining seconds within ±1s tolerance, and all components are non-negative integers

  - [ ]* 3.5 Write property test for token price formatting (Property 7)
    - **Property 7: Token Price Formatting Round-Trip**
    - **Validates: Requirements 6.1, 11.7**
    - File: `src/lib/utils/__tests__/formatters.property.test.ts`
    - Generate random positive floats (0.000001 to 1,000,000); verify output starts with "$", contains exactly one decimal point, and `parseFloat(result.replace(/[$,]/g, '')) ≈ input` within 0.01% tolerance

  - [x] 3.6 Implement standings calculation utilities
    - Write `src/lib/utils/standings.ts`: `computeStandings(matches)` and `sortStandings(rows, matches)` enforcing all arithmetic invariants
    - _Requirements: 4.2, 4.3_

  - [ ]* 3.7 Write property test for group standings arithmetic (Property 3)
    - **Property 3: Group Standings Arithmetic Invariants**
    - **Validates: Requirements 4.2**
    - File: `src/lib/utils/__tests__/standings.property.test.ts`
    - Generate random sets of group match results; verify Points = (Wins × 3) + (Draws × 1), Played = Wins + Draws + Losses, GD = GF − GA, and sum(GF) = sum(GA) across all teams

  - [x] 3.8 Implement tier and badge logic
    - Write `src/lib/utils/tiers.ts`: `TIER_THRESHOLDS`, `assignTier(holdings)`, `assignBadges(wallet)`
    - `assignTier` must be a total function mapping every non-negative amount to exactly one of Bronze/Silver/Gold/Platinum
    - `assignBadges` must be idempotent with no duplicate badges in output
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.8_

  - [ ]* 3.9 Write property test for tier assignment (Property 5)
    - **Property 5: Tier Assignment Completeness and Monotonicity**
    - **Validates: Requirements 7.3**
    - File: `src/lib/utils/__tests__/tiers.property.test.ts`
    - Generate random non-negative holdings; verify result is always one of {Bronze, Silver, Gold, Platinum}, is deterministic, and is monotonic (higher holdings never produce a lower tier)

  - [ ]* 3.10 Write property test for badge award idempotence (Property 6)
    - **Property 6: Badge Award Idempotence**
    - **Validates: Requirements 7.4, 7.5, 7.6, 7.8**
    - File: `src/lib/utils/__tests__/tiers.property.test.ts`
    - Generate random wallet histories; verify calling `assignBadges` twice returns identical sets with no duplicate entries

- [x] 4. Checkpoint — Ensure all utility tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. API client functions and Vercel proxy routes
  - [x] 5.1 Implement Live Score API client and proxy routes
    - Write `src/lib/api/livescore.ts`: `getMatches(params)`, `getGroupStandings(group?)`, `getTopScorers(type)`
    - Write `src/app/api/matches/route.ts`, `src/app/api/standings/route.ts`, `src/app/api/topscorers/route.ts` as Vercel Edge proxy routes keeping `LIVESCORE_API_KEY` server-side
    - _Requirements: 3.1, 3.5, 4.3, 5.1, 5.10_

  - [x] 5.2 Implement CoinGecko API client and proxy route
    - Write `src/lib/api/coingecko.ts`: `getTokenMetrics()`
    - Write `src/app/api/token/route.ts` as Vercel Edge proxy route keeping `COINGECKO_API_KEY` server-side
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [x] 5.3 Implement Helius API client and proxy route
    - Write `src/lib/api/helius.ts`: `getTokenHolders(page, limit)` using `getTokenLargestAccounts` RPC method
    - Write `src/app/api/leaderboard/route.ts` as Vercel Edge proxy route keeping `HELIUS_API_KEY` server-side
    - _Requirements: 7.1, 7.7, 7.9_

- [x] 6. React Query hooks and cache configuration
  - [x] 6.1 Configure React Query client
    - Write `src/lib/queryClient.ts` with `staleTime: 30_000`, `gcTime: 5 * 60_000`, `retry: 3`, exponential backoff `retryDelay`, and `refetchOnWindowFocus: false`
    - Define `queryKeys` object for all query key factories
    - _Requirements: 12.2, 12.3, 12.5_

  - [x] 6.2 Implement data-fetching hooks
    - Write `src/lib/hooks/useMatches.ts`: 60s refetch for live matches, 300s otherwise
    - Write `src/lib/hooks/useStandings.ts`: 300s refetch interval
    - Write `src/lib/hooks/useTokenMetrics.ts`: 60s refetch interval
    - Write `src/lib/hooks/useLeaderboard.ts`: 300s refetch interval with pagination support
    - Write `src/lib/hooks/useLaunchState.ts`: returns current `LaunchState` using `getLaunchState()`
    - _Requirements: 3.5, 4.4, 5.10, 6.5, 7.7_

  - [ ]* 6.3 Write property test for API response cache round-trip (Property 10)
    - **Property 10: API Response Cache Round-Trip**
    - **Validates: Requirements 12.2, 12.3**
    - File: `src/lib/__tests__/queryCache.property.test.ts`
    - Generate random valid API response objects; store in QueryClient cache with a known key, retrieve by same key, verify deep-equality with no field loss or mutation

- [x] 7. Shared and layout components
  - [x] 7.1 Implement shared utility components
    - Write `src/components/shared/SolanaLogo.tsx`: Solana gradient SVG logo component
    - Write `src/components/shared/TeamFlag.tsx`: `<img>` via `flagcdn.com` with descriptive `alt` text (e.g., "Brazil flag")
    - Write `src/components/shared/PriceDisplay.tsx`: animated price with Framer Motion green/red flash on direction change
    - Write `src/components/shared/PumpFunBadge.tsx`: "Launched on Pump.fun 🚀" pill badge
    - _Requirements: 6.11, 11.4_

  - [x] 7.2 Implement ComingSoonModal
    - Write `src/components/shared/ComingSoonModal.tsx` with slide-up spring animation, backdrop blur, compact `CountdownTimer`, "Get $WCBLIVE Early — Buy on Pump.fun" primary CTA opening `NEXT_PUBLIC_PUMPFUN_URL` in new tab, "Follow @WCBLIVE on X" secondary CTA, Pump.fun logo, and Solana logo in footer
    - Modal must be keyboard navigable and focusable; close on Escape key and backdrop click
    - _Requirements: 2.7, 2.8, 10.2, 10.3, 11.5_

  - [x] 7.3 Implement layout components
    - Write `src/components/layout/TickerBar.tsx`: CSS marquee animation with "$WCBLIVE • SOLANA • PUMP.FUN •" text, pauses on hover, accepts optional `price` prop
    - Write `src/components/layout/Navbar.tsx`: sticky with `backdrop-blur` on scroll (Framer Motion `useScroll`), Solana gradient logo, "◎ Built on Solana" chip, nav links with smooth scroll, "Connect Wallet" button triggering `ComingSoonModal` before launch, hamburger menu on mobile (< 768px) with full-screen overlay
    - Write `src/components/layout/Footer.tsx`: Solana logo + "Powered by Solana", Pump.fun logo + "Built on Pump.fun", contract address with clipboard copy, disclaimer text
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.9, 2.10, 11.3_

- [ ] 8. Hero section and countdown timer
  - [-] 8.1 Implement CountdownTimer component
    - Write `src/components/hero/CountdownTimer.tsx` with per-second `setInterval`, Framer Motion `AnimatePresence` digit flip animation, "Predictions Are Live!" state when target reached, `compact` prop for modal use, and `prefers-reduced-motion` support via `useReducedMotion`
    - _Requirements: 1.4, 1.5, 1.6, 11.9_

  - [ ]* 8.2 Write property test for match status rendering determinism (Property 9)
    - **Property 9: Match Status Rendering Determinism**
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - File: `src/components/matches/__tests__/MatchCard.property.test.ts`
    - Generate match data objects with all possible `MatchStatus` values; verify `getDisplayStatus` is a pure function — same input always produces same `MatchDisplayStatus`, no input produces undefined or error

  - [~] 8.3 Implement HeroSection component
    - Write `src/components/hero/HeroSection.tsx` with full-viewport layout, CSS radial gradient + Framer Motion floating particle background (football + Solana icons), "Launched on Pump.fun 🚀" `PumpFunBadge`, headline with Solana gradient on "On Solana", subheadline, "Buy $WCBLIVE" primary CTA → `NEXT_PUBLIC_PUMPFUN_URL` in new tab, "Explore Matches" secondary CTA scrolling to `#match-center`, and embedded `CountdownTimer`
    - Mobile single-column layout at < 768px
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8, 1.9, 1.10_

- [ ] 9. Match Center section
  - [-] 9.1 Implement MatchCard component
    - Write `src/components/matches/MatchCard.tsx` with glass morphism styling, home/away team flags via `TeamFlag`, kickoff time in user's local timezone via `formatMatchTime`, status badge variants (UPCOMING gray / LIVE green pulsing `animate-pulse` / HALFTIME yellow / FINISHED muted), live score in `text-3xl font-black`, "Predict" button triggering `ComingSoonModal` before launch, and hover tooltip "Live Predictions Coming Soon — Follow @WCBLIVE for updates" before launch
    - _Requirements: 3.2, 3.3, 3.4, 3.7, 3.8, 10.4_

  - [~] 9.2 Implement MatchFilter and MatchCenter components
    - Write `src/components/matches/MatchFilter.tsx`: All / Live / Upcoming / Finished filter tabs with client-side filtering (no page reload)
    - Write `src/components/matches/MatchCenter.tsx`: uses `useMatches` hook, groups matches by date with current day first, falls back to next upcoming date if no matches today, shows "Data may be delayed" non-blocking notice on API error, responsive 3→2→1 column grid
    - _Requirements: 3.1, 3.5, 3.6, 3.9, 3.10, 3.11, 3.12_

- [ ] 10. Group Stage Explorer section
  - [-] 10.1 Implement GroupStandingsTable and GroupCard components
    - Write `src/components/groups/GroupStandingsTable.tsx`: mini standings table with columns P/W/D/L/GF/GA/GD/Pts, "QUALIFIED" badge on top 2 teams when applicable
    - Write `src/components/groups/GroupCard.tsx`: expandable card with Framer Motion spring expand/collapse (`AnimatePresence`), group letter header with 4 team flags, standings table, match schedule when expanded, "Predict Group" button triggering `ComingSoonModal`
    - _Requirements: 4.2, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [~] 10.2 Implement GroupExplorer section
    - Write `src/components/groups/GroupExplorer.tsx`: uses `useStandings` hook, renders all 12 group cards in responsive 3→2→1 column grid, shows last-updated timestamp on API error
    - _Requirements: 4.1, 4.3, 4.4, 4.10, 4.11_

- [ ] 11. Standings and Statistics section
  - [-] 11.1 Implement TopScorers and KnockoutBracket components
    - Write `src/components/standings/TopScorers.tsx`: leaderboard for goals, assists, clean sheets, and disciplinary stats sourced from `useStandings` hook
    - Write `src/components/standings/BracketNode.tsx`: team flag + name (or "TBD"), "Predict Winner" button triggering `ComingSoonModal`, SVG connecting lines to next round
    - Write `src/components/standings/KnockoutBracket.tsx`: horizontally scrollable bracket R32→R16→QF→SF→Final, touch-friendly on mobile
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

  - [~] 11.2 Implement StandingsSection container
    - Write `src/components/standings/StandingsSection.tsx`: assembles TopScorers and KnockoutBracket, shows last-updated timestamp on API error, 300s refresh via `useStandings`
    - _Requirements: 5.10, 5.11_

- [ ] 12. Token Section
  - [-] 12.1 Implement TokenMetrics and NFTPreview components
    - Write `src/components/token/TokenMetrics.tsx`: 4-metric grid (Price / Market Cap / Holders / Burned) with `PriceDisplay` for animated price direction flash, formatted via `formatPrice` and `formatMarketCap`, 4-col desktop → 2×2 mobile
    - Write `src/components/token/NFTPreview.tsx`: "World Cup Prediction Pass" preview card with "Drops June 1, 2026 — Hold $WCBLIVE for Whitelist" label and compact countdown
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.8, 6.9, 6.11_

  - [~] 12.2 Implement TokenSection container
    - Write `src/components/token/TokenSection.tsx`: glass card with Solana gradient border, uses `useTokenMetrics` hook, "Buy $WCBLIVE on Pump.fun" primary CTA, "Swap on Jupiter" secondary CTA, `PumpFunBadge`, `SolanaLogo`, contract address with clipboard copy, "Price data may be delayed" notice on API error
    - _Requirements: 6.5, 6.6, 6.7, 6.10_

- [ ] 13. Leaderboard section
  - [-] 13.1 Implement LeaderboardEntry and TierBadge components
    - Write `src/components/leaderboard/TierBadge.tsx`: Bronze/Silver/Gold/Platinum badge with correct colors and Solana gradient for Platinum
    - Write `src/components/leaderboard/LeaderboardEntry.tsx`: rank, truncated wallet address via `formatWallet`, holdings amount, `TierBadge`, all earned `Badge` icons; full table on desktop, card layout on mobile
    - _Requirements: 7.2, 7.3, 7.8_

  - [~] 13.2 Implement LeaderboardSection container
    - Write `src/components/leaderboard/LeaderboardSection.tsx`: uses `useLeaderboard` hook, renders top 100+ entries, "Load More" pagination, shows last-updated timestamp on API error
    - _Requirements: 7.1, 7.7, 7.9, 7.10, 7.11_

  - [ ]* 13.3 Write property test for leaderboard ranking total ordering (Property 4)
    - **Property 4: Leaderboard Ranking Total Ordering**
    - **Validates: Requirements 7.1, 7.2**
    - File: `src/lib/__tests__/leaderboard.property.test.ts`
    - Generate random arrays of wallet/holdings pairs; verify output is sorted descending by holdings, ranks are 1..N with no gaps or duplicates, and the wallet set is preserved (no data loss or duplication)

- [ ] 14. Milestone Tracker section
  - [-] 14.1 Implement MilestoneBar component
    - Write `src/components/milestones/MilestoneBar.tsx`: animated progress bar with glow effect, displays current value, target value, and percentage; clamps progress to [0, 100]; triggers `canvas-confetti` burst + Framer Motion glow pulse on 100% completion; marks milestone as "Achieved" with distinct visual indicator
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ]* 14.2 Write property test for milestone progress bar bounds (Property 8)
    - **Property 8: Milestone Progress Bar Bounds**
    - **Validates: Requirements 8.2**
    - File: `src/components/milestones/__tests__/MilestoneBar.property.test.ts`
    - Generate random (current, target) pairs including current > target, current = 0, current = target, and target = 0; verify computed percentage is always in [0, 100] and equals `min(100, (current / target) * 100)` for target > 0

  - [~] 14.3 Implement MilestoneTracker section
    - Write `src/components/milestones/MilestoneTracker.tsx`: renders all 4 milestone bars (10K Holders, $1M Market Cap, 5K Discord Members, Feature Launch), sources holder count and market cap from `useTokenMetrics`, shows last-updated timestamp on data unavailability, 300s refresh
    - _Requirements: 8.1, 8.3, 8.6, 8.7_

- [ ] 15. Community Wall section
  - [ ] 15.1 Implement TwitterFeed and TelegramFeed components
    - Write `src/components/community/TwitterFeed.tsx`: Twitter/X embed for #WCBLIVE feed with fallback message "Follow @WCBLIVE on X for the latest updates" and link on embed failure
    - Write `src/components/community/TelegramFeed.tsx`: Telegram channel embed with fallback message "Join our Telegram for announcements" and link on embed failure
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6, 9.7_

  - [~] 15.2 Implement CommunityWall section
    - Write `src/components/community/CommunityWall.tsx`: assembles TwitterFeed and TelegramFeed side by side, displays partner badges ("Powered by Solana", "Built on Pump.fun", "Data by Live Score API")
    - _Requirements: 9.3_

- [~] 16. Checkpoint — Ensure all section component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Root layout, page assembly, and SEO
  - [~] 17.1 Assemble root layout and main page
    - Write `src/app/layout.tsx`: wraps app with `QueryClientProvider`, renders `Navbar`, `TickerBar`, and `Footer` around `{children}`; includes full `metadata` export with `<title>`, `<meta name="description">`, Open Graph tags, Twitter Card tags, canonical URL, and `robots` config
    - Write `src/app/page.tsx`: stacks all sections in order — `HeroSection`, `MatchCenter`, `GroupExplorer`, `StandingsSection`, `TokenSection`, `LeaderboardSection`, `MilestoneTracker`, `CommunityWall` — each with correct `id` anchor for smooth scroll navigation
    - _Requirements: 2.4, 13.1, 13.2, 13.3, 13.6_

  - [~] 17.2 Add SEO and crawlability files
    - Create `public/robots.txt` allowing all crawlers
    - Create `public/sitemap.xml` listing the root page
    - _Requirements: 13.4, 13.5_

- [ ] 18. Accessibility and responsive design polish
  - [~] 18.1 Audit and fix semantic HTML and accessibility
    - Ensure all sections use semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`)
    - Verify all `TeamFlag` images have descriptive `alt` text
    - Verify all interactive elements (buttons, links, modals) are keyboard navigable and focusable with visible focus rings
    - Verify color contrast ratio ≥ 4.5:1 for all body text against background
    - Integrate `axe-core` into Vitest for automated WCAG 2.1 AA checks on all components
    - _Requirements: 11.3, 11.4, 11.5, 11.6_

  - [~] 18.2 Implement reduced-motion support
    - Write `src/lib/hooks/useReducedMotion.ts` wrapping Framer Motion's `useReducedMotion`
    - Apply hook in `CountdownTimer`, `MatchCard`, `GroupCard`, `ComingSoonModal`, `MilestoneBar`, `Navbar`, and `PriceDisplay` to disable or simplify animations when `prefers-reduced-motion` is set
    - _Requirements: 11.9_

  - [~] 18.3 Verify responsive layouts at all breakpoints
    - Confirm `GroupExplorer` renders 3 cols at ≥ 1280px, 2 cols at 768–1279px, 1 col at < 768px
    - Confirm `MatchCenter` card grid follows same breakpoints
    - Confirm `TokenMetrics` renders 4-col at desktop, 2×2 at mobile
    - Confirm `LeaderboardSection` renders full table at desktop, card list at mobile
    - Confirm `KnockoutBracket` is horizontally scrollable with touch support
    - _Requirements: 1.10, 4.11, 11.1_

- [ ] 19. Performance optimizations
  - [~] 19.1 Apply Next.js Image Optimization and code splitting
    - Replace all `<img>` tags for team flags and hero images with `next/image` components with appropriate `width`, `height`, and `alt` props
    - Verify each major section's JavaScript bundle loads independently via Next.js App Router code splitting
    - Add 1-year cache headers for versioned static assets in `next.config.ts`
    - _Requirements: 12.1, 12.4, 12.6, 12.7_

- [~] 20. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using **fast-check**
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — no language selection required
- All API keys are server-side only and never exposed to the browser bundle
- The `NEXT_PUBLIC_LAUNCH_DATE` environment variable enables date override for testing the pre-launch vs. live state transition without a deployment

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2"] },
    { "id": 1, "tasks": ["3.1", "3.3", "3.6", "3.8"] },
    { "id": 2, "tasks": ["3.2", "3.4", "3.5", "3.7", "3.9", "3.10"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2"] },
    { "id": 6, "tasks": ["6.3", "7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["8.1", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1", "15.1"] },
    { "id": 9, "tasks": ["8.2", "8.3", "9.2", "10.2", "11.2", "12.2", "13.2", "14.2", "14.3", "15.2"] },
    { "id": 10, "tasks": ["13.3"] },
    { "id": 11, "tasks": ["17.1", "17.2"] },
    { "id": 12, "tasks": ["18.1", "18.2", "18.3", "19.1"] }
  ]
}
```
