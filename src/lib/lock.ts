/**
 * $WCB Token Lock System — Early Stage
 *
 * Users lock $WCB via Streamflow for a chosen duration.
 * In return they receive Credits proportional to amount × duration.
 * Credits are used as betting capital when the platform goes live.
 * Credits can be redeemed back to $WCB at 1:1 rate (early stage only).
 *
 * Rules:
 * - No early unlock — tokens are locked until duration expires
 * - More tokens + longer duration = more credits
 * - Only available during pre-launch (early stage)
 * - Credits are non-transferable (wallet-bound)
 */

export interface LockTier {
  days: number;
  label: string;
  multiplier: number;   // credit multiplier vs 30-day baseline
  badge: string;        // display badge
  color: string;
  highlight?: boolean;
}

/** Duration tiers with credit multipliers */
export const LOCK_TIERS: LockTier[] = [
  { days: 7,   label: '7 Days',    multiplier: 0.5, badge: 'Starter',   color: '#94A3B8' },
  { days: 30,  label: '30 Days',   multiplier: 1.0, badge: 'Holder',    color: '#22C55E' },
  { days: 60,  label: '60 Days',   multiplier: 1.5, badge: 'Believer',  color: '#15803D' },
  { days: 90,  label: '90 Days',   multiplier: 2.0, badge: 'Diamond',   color: '#D97706', highlight: true },
  { days: 180, label: '180 Days',  multiplier: 3.0, badge: 'Legend',    color: '#7C3AED' },
  { days: 365, label: '1 Year',    multiplier: 5.0, badge: 'OG',        color: '#DC2626' },
];

/** Minimum lock amount in $WCB tokens */
export const MIN_LOCK_AMOUNT = 100_000;

/**
 * Credit rate: 1 credit per 100 $WCB (at 1x multiplier)
 * Redemption: 1 credit = 100 $WCB
 */
export const TOKENS_PER_CREDIT = 100;
export const CREDIT_TO_TOKEN_RATE = 100; // 1 credit redeems for 100 $WCB
export const SECONDS_PER_DAY = 86_400;

/**
 * Convert a Streamflow lock timestamp range to the app's credit duration.
 * The duration is rounded up to avoid under-counting locks created with
 * minute/second drift, then capped at the highest configured tier.
 */
export function getCreditDurationDays(startTs: number, endTs: number): number {
  const rawDays = Math.max(0, (endTs - startTs) / SECONDS_PER_DAY);
  const roundedDays = Math.max(1, Math.ceil(rawDays));
  const maxTierDays = Math.max(...LOCK_TIERS.map((tier) => tier.days));
  return Math.min(roundedDays, maxTierDays);
}

/**
 * Calculate credits earned for a given lock.
 *
 * Formula: floor((amount / 100) × durationMultiplier)
 * Examples:
 *   100K $WCB × 30d (1x) = 1,000 credits
 *   100K $WCB × 90d (2x) = 2,000 credits
 *   1M   $WCB × 90d (2x) = 20,000 credits
 *
 * @param amount    Token amount (e.g. 500_000)
 * @param days      Lock duration in days
 * @returns         Credits earned
 */
export function calculateCredits(amount: number, days: number): number {
  const multiplier = getMultiplierForDays(days);
  const baseCredits = amount / TOKENS_PER_CREDIT;
  return Math.floor(baseCredits * multiplier);
}

/**
 * Get the multiplier for a given number of days.
 * Uses linear interpolation between defined tiers.
 */
export function getMultiplierForDays(days: number): number {
  if (days <= 0) return 0;

  // Find surrounding tiers
  const sorted = [...LOCK_TIERS].sort((a, b) => a.days - b.days);

  // Below minimum tier
  if (days < sorted[0].days) {
    return (days / sorted[0].days) * sorted[0].multiplier;
  }

  // Above maximum tier
  const last = sorted[sorted.length - 1];
  if (days >= last.days) {
    return last.multiplier;
  }

  // Interpolate between two tiers
  for (let i = 0; i < sorted.length - 1; i++) {
    const lo = sorted[i];
    const hi = sorted[i + 1];
    if (days >= lo.days && days < hi.days) {
      const t = (days - lo.days) / (hi.days - lo.days);
      return lo.multiplier + t * (hi.multiplier - lo.multiplier);
    }
  }

  return 1.0;
}

/**
 * Get the closest named tier for a given duration.
 */
export function getTierForDays(days: number): LockTier | null {
  const sorted = [...LOCK_TIERS].sort((a, b) => a.days - b.days);
  // Find the highest tier that doesn't exceed the days
  let best: LockTier | null = null;
  for (const tier of sorted) {
    if (days >= tier.days) best = tier;
  }
  return best;
}

/**
 * Format a credit amount for display.
 */
export function formatCredits(credits: number): string {
  if (credits >= 1_000_000) return `${(credits / 1_000_000).toFixed(1)}M`;
  if (credits >= 1_000) return `${(credits / 1_000).toFixed(1)}K`;
  return credits.toString();
}

/**
 * Format token amount for display.
 */
export function formatTokenAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
}

/** Mock active locks for UI preview */
export interface ActiveLock {
  id: string;
  wallet: string;
  amount: number;
  days: number;
  startDate: string;   // ISO
  endDate: string;     // ISO
  credits: number;
  status: 'active' | 'completed';
}

export const MOCK_ACTIVE_LOCKS: ActiveLock[] = [
  {
    id: 'lock-001',
    wallet: 'Ax3k...9mPq',
    amount: 5_000_000,
    days: 90,
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-06-30T00:00:00Z',
    credits: calculateCredits(5_000_000, 90),
    status: 'active',
  },
  {
    id: 'lock-002',
    wallet: 'Bz7r...4nKw',
    amount: 1_000_000,
    days: 180,
    startDate: '2026-03-15T00:00:00Z',
    endDate: '2026-09-11T00:00:00Z',
    credits: calculateCredits(1_000_000, 180),
    status: 'active',
  },
  {
    id: 'lock-003',
    wallet: 'Cy2s...8vLx',
    amount: 500_000,
    days: 30,
    startDate: '2026-04-10T00:00:00Z',
    endDate: '2026-05-10T00:00:00Z',
    credits: calculateCredits(500_000, 30),
    status: 'active',
  },
];
