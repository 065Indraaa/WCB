import { describe, expect, it } from 'vitest';
import {
  EARLY_TOKENS_PER_CREDIT,
  FIXED_LOCK_DAYS,
  LOCK_LAUNCH_TIMESTAMP,
  POST_LAUNCH_TOKENS_PER_CREDIT,
  SECONDS_PER_DAY,
  calculateCredits,
  calculateLockCredits,
  getCreditDurationDays,
  getLockCreditDurationDays,
  getLockCreditStartTimestamp,
  getLockDurationStartTimestamp,
  getLockUnlockTimestamp,
  isCreditEligibleDuration,
  isCreditEligibleLockSchedule,
} from '@/lib/lock';

const BEFORE_LAUNCH = LOCK_LAUNCH_TIMESTAMP - SECONDS_PER_DAY;
const AFTER_LAUNCH = LOCK_LAUNCH_TIMESTAMP;

describe('lock credit duration', () => {
  it('reports real rounded Streamflow durations without legacy caps', () => {
    expect(getCreditDurationDays(1_000, 1_000 + 30 * SECONDS_PER_DAY)).toBe(30);
    expect(getCreditDurationDays(1_000, 1_000 + FIXED_LOCK_DAYS * SECONDS_PER_DAY)).toBe(FIXED_LOCK_DAYS);
    expect(getCreditDurationDays(1_000, 1_000 + 500 * SECONDS_PER_DAY)).toBe(500);
  });

  it('rounds timestamp drift up so eligible 60-day locks are not under-counted', () => {
    expect(getCreditDurationDays(1_000, 1_000 + FIXED_LOCK_DAYS * SECONDS_PER_DAY - 1)).toBe(FIXED_LOCK_DAYS);
  });

  it('marks only fixed 60-day displayed durations as credit-eligible', () => {
    expect(isCreditEligibleDuration(FIXED_LOCK_DAYS - 1)).toBe(false);
    expect(isCreditEligibleDuration(FIXED_LOCK_DAYS)).toBe(true);
    expect(isCreditEligibleDuration(FIXED_LOCK_DAYS + 1)).toBe(false);
  });

  it('uses Streamflow start time through unlock time for duration checks', () => {
    const start = BEFORE_LAUNCH + 10;
    const schedule = {
      createdAt: BEFORE_LAUNCH,
      start,
      cliff: start + FIXED_LOCK_DAYS * SECONDS_PER_DAY,
      end: start + FIXED_LOCK_DAYS * SECONDS_PER_DAY,
    };

    expect(getLockCreditStartTimestamp(schedule)).toBe(schedule.createdAt);
    expect(getLockDurationStartTimestamp(schedule)).toBe(schedule.start);
    expect(getLockUnlockTimestamp(schedule)).toBe(schedule.end);
    expect(getLockCreditDurationDays(schedule)).toBe(FIXED_LOCK_DAYS);
    expect(isCreditEligibleLockSchedule(schedule)).toBe(true);
  });
});

describe('lock credit calculation', () => {
  it('applies the early credit rate before launch', () => {
    expect(calculateCredits(EARLY_TOKENS_PER_CREDIT, BEFORE_LAUNCH)).toBe(1);
    expect(calculateCredits(1_000, BEFORE_LAUNCH)).toBe(10);
  });

  it('applies the post-launch credit rate at launch and after', () => {
    expect(calculateCredits(EARLY_TOKENS_PER_CREDIT, AFTER_LAUNCH)).toBe(0);
    expect(calculateCredits(POST_LAUNCH_TOKENS_PER_CREDIT, AFTER_LAUNCH)).toBe(1);
    expect(calculateCredits(1_000, AFTER_LAUNCH)).toBe(5);
  });

  it('calculates Streamflow lock credits from the lock creation timestamp', () => {
    const beforeLaunchSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + FIXED_LOCK_DAYS * SECONDS_PER_DAY,
    };
    const afterLaunchSchedule = {
      createdAt: AFTER_LAUNCH,
      start: AFTER_LAUNCH,
      end: AFTER_LAUNCH + FIXED_LOCK_DAYS * SECONDS_PER_DAY,
    };

    expect(calculateLockCredits(1_000, beforeLaunchSchedule)).toBe(10);
    expect(calculateLockCredits(1_000, afterLaunchSchedule)).toBe(5);
  });

  it('does not grant credits to non-60-day Streamflow locks', () => {
    const shortSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + 30 * SECONDS_PER_DAY,
    };
    const longSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + 90 * SECONDS_PER_DAY,
    };

    expect(calculateLockCredits(100_000, shortSchedule)).toBe(0);
    expect(calculateLockCredits(100_000, longSchedule)).toBe(0);
  });
});
