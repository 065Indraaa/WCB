import type { Tier, Badge, WalletEntry } from '@/types/leaderboard';

export const TIER_THRESHOLDS = {
  Bronze: 1,
  Silver: 100_000,
  Gold: 1_000_000,
  Platinum: 10_000_000,
} as const;

const LAUNCH_DAY = '2026-01-01'; // Placeholder — actual launch day TBD

/**
 * Assign a tier based on token holdings.
 * Total function: every non-negative amount maps to exactly one tier.
 * Monotonic: higher holdings never produce a lower tier.
 */
export function assignTier(holdings: number): Tier {
  if (holdings >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (holdings >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (holdings >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
}

/**
 * Assign badges to a wallet entry.
 * Idempotent: calling twice returns identical sets with no duplicates.
 */
export function assignBadges(wallet: Pick<WalletEntry, 'holdings' | 'holdingSince'>): Badge[] {
  const badges = new Set<Badge>();

  // Whale: holdings >= 10,000,000
  if (wallet.holdings >= 10_000_000) {
    badges.add('Whale');
  }

  // Diamond Hands: held continuously >= 30 days
  if (wallet.holdingSince) {
    const holdingDate = new Date(wallet.holdingSince);
    const now = new Date();
    const daysDiff = (now.getTime() - holdingDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff >= 30) {
      badges.add('Diamond Hands');
    }
  }

  // Early Bird: purchased on launch day
  if (wallet.holdingSince) {
    const holdingDate = new Date(wallet.holdingSince);
    const launchDate = new Date(LAUNCH_DAY);
    if (
      holdingDate.getFullYear() === launchDate.getFullYear() &&
      holdingDate.getMonth() === launchDate.getMonth() &&
      holdingDate.getDate() === launchDate.getDate()
    ) {
      badges.add('Early Bird');
    }
  }

  return Array.from(badges);
}
