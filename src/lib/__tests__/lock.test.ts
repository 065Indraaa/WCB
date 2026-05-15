import { describe, expect, it } from 'vitest';
import { calculateCredits, getCreditDurationDays, SECONDS_PER_DAY } from '@/lib/lock';

describe('lock credit duration', () => {
  it('uses exact configured durations for normal locks', () => {
    expect(getCreditDurationDays(1_000, 1_000 + 7 * SECONDS_PER_DAY)).toBe(7);
    expect(getCreditDurationDays(1_000, 1_000 + 30 * SECONDS_PER_DAY)).toBe(30);
    expect(getCreditDurationDays(1_000, 1_000 + 90 * SECONDS_PER_DAY)).toBe(90);
    expect(getCreditDurationDays(1_000, 1_000 + 365 * SECONDS_PER_DAY)).toBe(365);
  });

  it('rounds timestamp drift up so credits are not under-counted', () => {
    expect(getCreditDurationDays(1_000, 1_000 + 30 * SECONDS_PER_DAY - 1)).toBe(30);
  });

  it('caps durations above 365 days to the 365 day tier', () => {
    const amount = 1_000_000;
    const duration = getCreditDurationDays(1_000, 1_000 + 500 * SECONDS_PER_DAY);

    expect(duration).toBe(365);
    expect(calculateCredits(amount, duration)).toBe(calculateCredits(amount, 365));
  });
});
