import { describe, expect, it } from 'vitest';
import {
  calculateCredits,
  getCreditDurationDays,
  getLockCreditDurationDays,
  getLockCreditStartTimestamp,
  getLockUnlockTimestamp,
  SECONDS_PER_DAY,
} from '@/lib/lock';

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

  it('matches the lock calculator for a long 500M WCB lock', () => {
    const amount = 500_000_000;
    const duration = getCreditDurationDays(1_000, 1_000 + 37 * 365 * SECONDS_PER_DAY);

    expect(duration).toBe(365);
    expect(calculateCredits(amount, duration)).toBe(25_000_000);
  });

  it('uses Streamflow lock creation time through unlock time for credit duration', () => {
    const schedule = {
      createdAt: 1_000,
      start: 1_000 + 30 * SECONDS_PER_DAY,
      cliff: 1_000 + 37 * 365 * SECONDS_PER_DAY,
      end: 1_000 + 37 * 365 * SECONDS_PER_DAY,
    };

    expect(getLockCreditStartTimestamp(schedule)).toBe(schedule.createdAt);
    expect(getLockUnlockTimestamp(schedule)).toBe(schedule.end);
    expect(getLockCreditDurationDays(schedule)).toBe(365);
    expect(calculateCredits(500_000_000, getLockCreditDurationDays(schedule))).toBe(25_000_000);
  });
});
