/**
 * Launch state utility for the $WCB platform.
 *
 * Platform phases:
 *   - pre-launch : before June 11, 2026
 *   - live        : June 11, 2026+
 */

export type LaunchState = 'pre-launch' | 'live';

/**
 * Key launch date.
 * Can be overridden via NEXT_PUBLIC_LAUNCH_DATE for testing.
 */
export const LAUNCH_DATES = {
  live: new Date(
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-06-11T00:00:00Z'
  ),
} as const;

/**
 * Returns the current platform phase.
 *
 * @example
 * getLaunchState(new Date('2026-01-01T00:00:00Z')); // 'pre-launch'
 * getLaunchState(new Date('2026-06-11T00:00:00Z')); // 'live'
 */
export function getLaunchState(now: Date = new Date()): LaunchState {
  if (now >= LAUNCH_DATES.live) return 'live';
  return 'pre-launch';
}

export function isLive(now: Date = new Date()): boolean {
  return getLaunchState(now) === 'live';
}
