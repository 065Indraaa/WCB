export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Format a token price in USD.
 * - Starts with "$"
 * - Uses appropriate decimal places (6 for < 0.01, 4 for < 1, 2 for >= 1)
 * - Comma-separates values >= 1,000
 */
export function formatPrice(price: number): string {
  if (price < 0.01) {
    return '$' + price.toFixed(6);
  } else if (price < 1) {
    return '$' + price.toFixed(4);
  } else if (price < 1000) {
    return '$' + price.toFixed(2);
  } else {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

/**
 * Format a market cap value in USD with K/M/B suffixes.
 */
export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return '$' + (value / 1_000_000_000).toFixed(2) + 'B';
  } else if (value >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(2) + 'M';
  } else if (value >= 1_000) {
    return '$' + (value / 1_000).toFixed(1) + 'K';
  }
  return '$' + value.toFixed(0);
}

/**
 * Truncate a wallet address to "AbCd...XyZ1" format (first 4 + last 4 chars).
 */
export function formatWallet(address: string): string {
  if (address.length <= 8) return address;
  return address.slice(0, 4) + '...' + address.slice(-4);
}

/**
 * Format an ISO 8601 date string to local time with timezone abbreviation.
 */
export function formatMatchTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Compute countdown from now to target date.
 * Returns null if target has already passed (or is exactly now).
 * All components are non-negative integers.
 */
export function computeCountdown(target: Date, now: Date = new Date()): CountdownResult | null {
  const totalSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
  if (totalSeconds <= 0) return null;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}
