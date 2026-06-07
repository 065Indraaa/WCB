/**
 * Launch state utility for the $WCB platform.
 *
 * Platform phases:
 *   - pre-launch : before May 20, 2026
 *   - whitelist  : May 20 — June 1, 2026
 *   - nft-beta   : June 1 — June 11, 2026
 *   - live       : June 11, 2026+
 */

export type LaunchState = 'pre-launch' | 'whitelist' | 'nft-beta' | 'live';

/**
 * Key launch dates.
 * Can be overridden via NEXT_PUBLIC_LAUNCH_DATE for testing the live phase.
 */
export const LAUNCH_DATES = {
  whitelist: new Date('2026-05-20T00:00:00Z'),
  nftDrop:   new Date('2026-06-01T00:00:00Z'),
  live:      new Date(
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-06-11T00:00:00Z'
  ),
} as const;

/**
 * Returns the current platform phase.
 *
 * @example
 * getLaunchState(new Date('2026-01-01T00:00:00Z')); // 'pre-launch'
 * getLaunchState(new Date('2026-05-25T00:00:00Z')); // 'whitelist'
 * getLaunchState(new Date('2026-06-05T00:00:00Z')); // 'nft-beta'
 * getLaunchState(new Date('2026-06-11T00:00:00Z')); // 'live'
 */
export function getLaunchState(now: Date = new Date()): LaunchState {
  if (now >= LAUNCH_DATES.live)      return 'live';
  if (now >= LAUNCH_DATES.nftDrop)   return 'nft-beta';
  if (now >= LAUNCH_DATES.whitelist) return 'whitelist';
  return 'pre-launch';
}

export function isLive(now: Date = new Date()): boolean {
  return getLaunchState(now) === 'live';
}

export function isPreLaunch(now: Date = new Date()): boolean {
  return getLaunchState(now) === 'pre-launch';
}
