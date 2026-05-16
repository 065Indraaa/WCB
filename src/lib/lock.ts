/**
 * $WCB Token Lock System
 *
 * Users lock $WCB via Streamflow for a fixed 60-day duration.
 * In return they receive wallet-bound platform credits.
 *
 * Credits are used for WCB platform entries, access, leaderboard ranking, and
 * future redeem/withdraw flows. Credit redeem is coming soon and is not active
 * in the current product.
 *
 * Rules:
 * - No early unlock: tokens are locked until the Streamflow unlock date
 * - Fixed duration: 60 days
 * - Early rate before launch: 100 $WCB locked = 1 credit
 * - Post-launch rate: 200 $WCB locked = 1 credit
 * - Credits are wallet-bound until redeem/withdraw rules are enabled
 */

export interface LockTier {
  days: number;
  label: string;
  multiplier: number;
  badge: string;
  color: string;
  highlight?: boolean;
}

export const FIXED_LOCK_DAYS = 60;
export const MIN_LOCK_AMOUNT = 100;
export const EARLY_TOKENS_PER_CREDIT = 100;
export const POST_LAUNCH_TOKENS_PER_CREDIT = 200;
export const TOKENS_PER_CREDIT = EARLY_TOKENS_PER_CREDIT;
export const SECONDS_PER_DAY = 86_400;
export const LOCK_DURATION_TOLERANCE_SECONDS = 3_600;
export const LOCK_LAUNCH_ISO = '2026-06-11T00:00:00Z';
export const CREDIT_REDEEM_STATUS = 'coming-soon';

export const LOCK_TIERS: LockTier[] = [
  {
    days: FIXED_LOCK_DAYS,
    label: '60 Days',
    multiplier: 1,
    badge: 'Locker',
    color: '#F2B544',
    highlight: true,
  },
];

function resolveLaunchTimestamp(): number {
  const fallback = Math.floor(Date.parse(LOCK_LAUNCH_ISO) / 1000);
  const parsed = Date.parse(process.env.NEXT_PUBLIC_LAUNCH_DATE ?? LOCK_LAUNCH_ISO);
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : fallback;
}

export const LOCK_LAUNCH_TIMESTAMP = resolveLaunchTimestamp();

export interface LockSchedule {
  createdAt?: number;
  start?: number;
  cliff?: number;
  end?: number;
}

export function currentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function isEarlyCreditWindow(timestamp = currentUnixTimestamp()): boolean {
  return timestamp < LOCK_LAUNCH_TIMESTAMP;
}

export function getTokensPerCreditForTimestamp(timestamp = currentUnixTimestamp()): number {
  return isEarlyCreditWindow(timestamp) ? EARLY_TOKENS_PER_CREDIT : POST_LAUNCH_TOKENS_PER_CREDIT;
}

function validUnixTimestamp(value: number | undefined): number | null {
  return Number.isFinite(value) && value !== undefined && value > 0 ? value : null;
}

export function getLockCreditStartTimestamp(schedule: LockSchedule): number {
  return (
    validUnixTimestamp(schedule.createdAt) ??
    validUnixTimestamp(schedule.start) ??
    validUnixTimestamp(schedule.cliff) ??
    validUnixTimestamp(schedule.end) ??
    0
  );
}

export function getLockDurationStartTimestamp(schedule: LockSchedule): number {
  return (
    validUnixTimestamp(schedule.start) ??
    validUnixTimestamp(schedule.createdAt) ??
    validUnixTimestamp(schedule.cliff) ??
    validUnixTimestamp(schedule.end) ??
    0
  );
}

export function getLockUnlockTimestamp(schedule: LockSchedule): number {
  const candidates = [schedule.end, schedule.cliff, schedule.start]
    .map(validUnixTimestamp)
    .filter((value): value is number => value !== null);

  return candidates.length > 0 ? Math.max(...candidates) : 0;
}

/**
 * Convert a Streamflow lock timestamp range to the app's displayed duration.
 * WCB only supports 60-day locks going forward, but existing Streamflow records
 * may have slight timestamp drift, so this reports the real rounded duration.
 */
export function getCreditDurationDays(startTs: number, endTs: number): number {
  const rawDays = Math.max(0, (endTs - startTs) / SECONDS_PER_DAY);
  return Math.max(1, Math.ceil(rawDays));
}

export function getLockCreditDurationDays(schedule: LockSchedule): number {
  return getCreditDurationDays(
    getLockDurationStartTimestamp(schedule),
    getLockUnlockTimestamp(schedule),
  );
}

export function isCreditEligibleDuration(days: number): boolean {
  return days === FIXED_LOCK_DAYS;
}

export function isCreditEligibleLockSchedule(schedule: LockSchedule): boolean {
  const startTs = getLockDurationStartTimestamp(schedule);
  const endTs = getLockUnlockTimestamp(schedule);
  if (startTs <= 0 || endTs <= startTs) return false;

  const expected = FIXED_LOCK_DAYS * SECONDS_PER_DAY;
  const actual = endTs - startTs;
  return actual >= expected && actual <= expected + LOCK_DURATION_TOLERANCE_SECONDS;
}

export function calculateLockCredits(amount: number, schedule: LockSchedule): number {
  if (!isCreditEligibleLockSchedule(schedule)) return 0;
  return calculateCredits(amount, getLockCreditStartTimestamp(schedule));
}

/**
 * Calculate wallet-bound platform credits.
 *
 * Before launch: floor(amount / 100)
 * After launch: floor(amount / 200)
 */
export function calculateCredits(amount: number, lockTimestamp = currentUnixTimestamp()): number {
  return Math.floor(Math.max(0, amount) / getTokensPerCreditForTimestamp(lockTimestamp));
}

/**
 * Duration multipliers are no longer used. This remains for legacy display
 * paths that still expect a multiplier value.
 */
export function getMultiplierForDays(days: number): number {
  return days > 0 ? 1 : 0;
}

export function getTierForDays(days: number): LockTier | null {
  return days > 0 ? LOCK_TIERS[0] : null;
}

export function formatCredits(credits: number): string {
  if (credits >= 1_000_000) return `${(credits / 1_000_000).toFixed(1)}M`;
  if (credits >= 1_000) return `${(credits / 1_000).toFixed(1)}K`;
  return credits.toString();
}

export function formatTokenAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
}
