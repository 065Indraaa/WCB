/**
 * $WCB Token Lock System
 *
 * Users lock $WCB via Streamflow for a minimum 30-day duration.
 * In return they receive wallet-bound platform credits.
 *
 * Credits are used for WCB platform entries, access, leaderboard ranking, and
 * future redeem/withdraw flows. Credit redeem is coming soon and is not active
 * in the current product.
 *
 * Rules:
 * - No early unlock: tokens are locked until the Streamflow unlock date
 * - Minimum duration: 30 days
 * - Default duration: 60 days
 * - Early rate before launch: 100 $WCB locked = 1 credit
 * - Post-launch rate: 200 $WCB locked = 1 credit
 * - Credits are wallet-bound until redeem/withdraw rules are enabled
 */

export interface LockTier {
  minDays: number;
  label: string;
  multiplier: number;
  badge: string;
  color: string;
  highlight?: boolean;
}

export const MIN_LOCK_DAYS = 30;
export const DEFAULT_LOCK_DAYS = 60;
export const MIN_LOCK_AMOUNT = 100;
export const EARLY_TOKENS_PER_CREDIT = 100;
export const POST_LAUNCH_TOKENS_PER_CREDIT = 200;
export const TOKENS_PER_CREDIT = EARLY_TOKENS_PER_CREDIT;
export const SECONDS_PER_DAY = 86_400;
// Credit eligibility is allowed for locks at least CREDIT_ELIGIBILITY_MIN_DAYS
// long, so on-chain locks that round just below the displayed 30-day minimum
// (e.g. 28-29 day locks created via Streamflow) still receive credits. The UI
// still asks the user for MIN_LOCK_DAYS.
export const CREDIT_ELIGIBILITY_MIN_DAYS = 28;
export const LOCK_DURATION_TOLERANCE_SECONDS = 3_600;
export const LOCK_LAUNCH_ISO = '2026-06-11T00:00:00Z';
export const CREDIT_REDEEM_STATUS = 'coming-soon';

/** @deprecated Use MIN_LOCK_DAYS or DEFAULT_LOCK_DAYS */
export const FIXED_LOCK_DAYS = MIN_LOCK_DAYS;

export const LOCK_TIERS: LockTier[] = [
  {
    minDays: MIN_LOCK_DAYS,
    label: '30+ Days',
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

/**
 * A lock is credit-eligible if its displayed duration is at least
 * CREDIT_ELIGIBILITY_MIN_DAYS (28d). The UI advertises a 30-day minimum, but
 * on-chain locks created slightly under (28-29 day rounding) still earn credits.
 */
export function isCreditEligibleDuration(days: number): boolean {
  return days >= CREDIT_ELIGIBILITY_MIN_DAYS;
}

/**
 * A lock schedule is credit-eligible if its actual span is at least
 * CREDIT_ELIGIBILITY_MIN_DAYS, with a small tolerance for on-chain timestamp
 * drift.
 */
export function isCreditEligibleLockSchedule(schedule: LockSchedule): boolean {
  const startTs = getLockDurationStartTimestamp(schedule);
  const endTs = getLockUnlockTimestamp(schedule);
  if (startTs <= 0 || endTs <= startTs) return false;

  const minimum = CREDIT_ELIGIBILITY_MIN_DAYS * SECONDS_PER_DAY;
  const actual = endTs - startTs;
  return actual >= minimum - LOCK_DURATION_TOLERANCE_SECONDS;
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
export function getMultiplierForDays(_days: number): number {
  return 1;
}

export function getTierForDays(days: number): LockTier | null {
  return days >= CREDIT_ELIGIBILITY_MIN_DAYS ? LOCK_TIERS[0] : null;
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
