import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatMarketCap,
  formatWallet,
  formatMatchTime,
  computeCountdown,
} from '../formatters';

// ─── formatPrice ────────────────────────────────────────────────────────────

describe('formatPrice', () => {
  it('starts with "$" for all inputs', () => {
    expect(formatPrice(0.000001)).toMatch(/^\$/);
    expect(formatPrice(0.5)).toMatch(/^\$/);
    expect(formatPrice(42)).toMatch(/^\$/);
    expect(formatPrice(1_500_000)).toMatch(/^\$/);
  });

  it('uses 6 decimal places for values < 0.01', () => {
    expect(formatPrice(0.000001)).toBe('$0.000001');
    expect(formatPrice(0.009999)).toBe('$0.009999');
  });

  it('uses 4 decimal places for values in [0.01, 1)', () => {
    expect(formatPrice(0.01)).toBe('$0.0100');
    expect(formatPrice(0.5)).toBe('$0.5000');
    expect(formatPrice(0.9999)).toBe('$0.9999');
  });

  it('uses 2 decimal places for values in [1, 1000)', () => {
    expect(formatPrice(1)).toBe('$1.00');
    expect(formatPrice(42.5)).toBe('$42.50');
    expect(formatPrice(999.99)).toBe('$999.99');
  });

  it('comma-separates values >= 1,000', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
    expect(formatPrice(1_234_567.89)).toBe('$1,234,567.89');
  });
});

// ─── formatMarketCap ────────────────────────────────────────────────────────

describe('formatMarketCap', () => {
  it('formats values < 1,000 with no suffix', () => {
    expect(formatMarketCap(0)).toBe('$0');
    expect(formatMarketCap(500)).toBe('$500');
    expect(formatMarketCap(999)).toBe('$999');
  });

  it('formats values in [1,000, 1,000,000) with K suffix', () => {
    expect(formatMarketCap(1_000)).toBe('$1.0K');
    expect(formatMarketCap(420_000)).toBe('$420.0K');
    expect(formatMarketCap(999_999)).toBe('$1000.0K');
  });

  it('formats values in [1,000,000, 1,000,000,000) with M suffix', () => {
    expect(formatMarketCap(1_000_000)).toBe('$1.00M');
    expect(formatMarketCap(42_000_000)).toBe('$42.00M');
  });

  it('formats values >= 1,000,000,000 with B suffix', () => {
    expect(formatMarketCap(1_000_000_000)).toBe('$1.00B');
    expect(formatMarketCap(2_500_000_000)).toBe('$2.50B');
  });
});

// ─── formatWallet ───────────────────────────────────────────────────────────

describe('formatWallet', () => {
  it('truncates addresses longer than 8 chars to first4...last4', () => {
    expect(formatWallet('AbCdEfGhXyZ1')).toBe('AbCd...XyZ1');
    expect(formatWallet('1234567890abcdef')).toBe('1234...cdef');
  });

  it('returns address unchanged when 8 chars or fewer', () => {
    expect(formatWallet('AbCdXyZ1')).toBe('AbCdXyZ1');
    expect(formatWallet('short')).toBe('short');
    expect(formatWallet('')).toBe('');
  });

  it('handles exactly 9 chars (just over threshold)', () => {
    expect(formatWallet('123456789')).toBe('1234...6789');
  });
});

// ─── formatMatchTime ────────────────────────────────────────────────────────

describe('formatMatchTime', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatMatchTime('2026-06-11T19:00:00Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes month abbreviation and timezone info', () => {
    // The exact day/hour depends on the test runner's local timezone,
    // but the output must contain a month abbreviation and a timezone indicator.
    const result = formatMatchTime('2026-06-11T19:00:00Z');
    // Should contain a month abbreviation (Jun or Jul depending on timezone offset)
    expect(result).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i);
    // Should contain a timezone indicator (e.g. "GMT", "UTC", "EDT", "PDT", etc.)
    expect(result).toMatch(/GMT|UTC|[A-Z]{2,5}[+-]?\d*/);
  });
});

// ─── computeCountdown ───────────────────────────────────────────────────────

describe('computeCountdown', () => {
  const base = new Date('2026-01-01T00:00:00Z');

  it('returns null when target equals now', () => {
    expect(computeCountdown(base, base)).toBeNull();
  });

  it('returns null when target is in the past', () => {
    const past = new Date(base.getTime() - 1000);
    expect(computeCountdown(past, base)).toBeNull();
  });

  it('decomposes exactly 1 day correctly', () => {
    const target = new Date(base.getTime() + 86400 * 1000);
    expect(computeCountdown(target, base)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });

  it('decomposes a mixed duration correctly', () => {
    // 2 days + 3 hours + 4 minutes + 5 seconds
    const totalMs = (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;
    const target = new Date(base.getTime() + totalMs);
    expect(computeCountdown(target, base)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it('all components are non-negative integers', () => {
    const target = new Date(base.getTime() + 12345 * 1000);
    const result = computeCountdown(target, base)!;
    expect(result.days).toBeGreaterThanOrEqual(0);
    expect(result.hours).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result.days)).toBe(true);
    expect(Number.isInteger(result.hours)).toBe(true);
    expect(Number.isInteger(result.minutes)).toBe(true);
    expect(Number.isInteger(result.seconds)).toBe(true);
  });

  it('components reconstruct the total seconds', () => {
    const totalSeconds = 90061; // 1d 1h 1m 1s
    const target = new Date(base.getTime() + totalSeconds * 1000);
    const result = computeCountdown(target, base)!;
    const reconstructed = result.days * 86400 + result.hours * 3600 + result.minutes * 60 + result.seconds;
    expect(reconstructed).toBe(totalSeconds);
  });

  it('uses current time as default when now is omitted', () => {
    const farFuture = new Date(Date.now() + 1_000_000_000);
    const result = computeCountdown(farFuture);
    expect(result).not.toBeNull();
  });
});
