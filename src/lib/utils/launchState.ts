/**
 * Launch state utility for the $WCB platform.
 *
 * Determines the current platform phase based on the current date/time.
 * All functions are pure with no side effects.
 *
 * Platform phases:
 *   - pre-launch : before May 20, 2026
 *   - whitelist  : May 20 – June 1, 2026
 *   - nft-beta   : June 1 – June 11, 2026
 *   - live        : June 11, 2026+
 */

export type LaunchState = 'pre-launch' | 'whitelist' | 'nft-beta' | 'live';

/**
 * Key launch date boundaries.
 *
 * Each date can be overridden via environment variables, which is useful for
 * testing the pre-launch → live transition without a deployment.
 *
 * Supported overrides:
 *   NEXT_PUBLIC_WHITELIST_DATE  — start of the whitelist phase (default: 2026-05-20T00:00:00Z)
 *   NEXT_PUBLIC_NFT_DATE        — start of the NFT & Beta phase (default: 2026-06-01T00:00:00Z)
 *   NEXT_PUBLIC_LAUNCH_DATE     — start of the live phase (default: 2026-06-11T00:00:00Z)
 */
export const LAUNCH_DATES = {
  whitelist: new Date(
    process.env.NEXT_PUBLIC_WHITELIST_DATE ?? '2026-05-20T00:00:00Z'
  ),
  nftBeta: new Date(
    process.env.NEXT_PUBLIC_NFT_DATE ?? '2026-06-01T00:00:00Z'
  ),
  live: new Date(
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-06-11T00:00:00Z'
  ),
} as const;

/**
 * Returns the current platform phase for a given moment in time.
 *
 * @param now - The moment to evaluate. Defaults to `new Date()` (current time).
 * @returns The `LaunchState` that corresponds to `now`.
 *
 * @example
 * getLaunchState(new Date('2026-01-01T00:00:00Z')); // 'pre-launch'
 * getLaunchState(new Date('2026-05-25T00:00:00Z')); // 'whitelist'
 * getLaunchState(new Date('2026-06-05T00:00:00Z')); // 'nft-beta'
 * getLaunchState(new Date('2026-06-11T00:00:00Z')); // 'live'
 */
export function getLaunchState(now: Date = new Date()): LaunchState {
  if (now >= LAUNCH_DATES.live) return 'live';
  if (now >= LAUNCH_DATES.nftBeta) return 'nft-beta';
  if (now >= LAUNCH_DATES.whitelist) return 'whitelist';
  return 'pre-launch';
}

/**
 * Convenience helper — returns `true` when the platform is in the `'live'` phase.
 *
 * @param now - The moment to evaluate. Defaults to `new Date()` (current time).
 */
export function isLive(now: Date = new Date()): boolean {
  return getLaunchState(now) === 'live';
}
