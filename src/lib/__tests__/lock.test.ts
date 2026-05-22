import { describe, expect, it } from 'vitest';
import {
  EARLY_TOKENS_PER_CREDIT,
  MIN_LOCK_DAYS,
  CREDIT_ELIGIBILITY_MIN_DAYS,
  DEFAULT_LOCK_DAYS,
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
    expect(getCreditDurationDays(1_000, 1_000 + DEFAULT_LOCK_DAYS * SECONDS_PER_DAY)).toBe(DEFAULT_LOCK_DAYS);
    expect(getCreditDurationDays(1_000, 1_000 + 500 * SECONDS_PER_DAY)).toBe(500);
  });

  it('rounds timestamp drift up so eligible locks are not under-counted', () => {
    expect(getCreditDurationDays(1_000, 1_000 + MIN_LOCK_DAYS * SECONDS_PER_DAY - 1)).toBe(MIN_LOCK_DAYS);
  });

  it('marks durations >= CREDIT_ELIGIBILITY_MIN_DAYS as credit-eligible', () => {
    expect(isCreditEligibleDuration(CREDIT_ELIGIBILITY_MIN_DAYS - 1)).toBe(false);
    expect(isCreditEligibleDuration(CREDIT_ELIGIBILITY_MIN_DAYS)).toBe(true);
    expect(isCreditEligibleDuration(MIN_LOCK_DAYS)).toBe(true);
    expect(isCreditEligibleDuration(DEFAULT_LOCK_DAYS)).toBe(true);
  });

  it('uses Streamflow start time through unlock time for duration checks', () => {
    const start = BEFORE_LAUNCH + 10;
    const schedule = {
      createdAt: BEFORE_LAUNCH,
      start,
      cliff: start + DEFAULT_LOCK_DAYS * SECONDS_PER_DAY,
      end: start + DEFAULT_LOCK_DAYS * SECONDS_PER_DAY,
    };

    expect(getLockCreditStartTimestamp(schedule)).toBe(schedule.createdAt);
    expect(getLockDurationStartTimestamp(schedule)).toBe(schedule.start);
    expect(getLockUnlockTimestamp(schedule)).toBe(schedule.end);
    expect(getLockCreditDurationDays(schedule)).toBe(DEFAULT_LOCK_DAYS);
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
      end: BEFORE_LAUNCH + DEFAULT_LOCK_DAYS * SECONDS_PER_DAY,
    };
    const afterLaunchSchedule = {
      createdAt: AFTER_LAUNCH,
      start: AFTER_LAUNCH,
      end: AFTER_LAUNCH + DEFAULT_LOCK_DAYS * SECONDS_PER_DAY,
    };

    expect(calculateLockCredits(1_000, beforeLaunchSchedule)).toBe(10);
    expect(calculateLockCredits(1_000, afterLaunchSchedule)).toBe(5);
  });

  it('grants credits to locks >= CREDIT_ELIGIBILITY_MIN_DAYS and rejects shorter locks', () => {
    const tooShortSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + (CREDIT_ELIGIBILITY_MIN_DAYS - 1) * SECONDS_PER_DAY,
    };
    const eligibleSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + CREDIT_ELIGIBILITY_MIN_DAYS * SECONDS_PER_DAY,
    };
    const longSchedule = {
      createdAt: BEFORE_LAUNCH,
      start: BEFORE_LAUNCH,
      end: BEFORE_LAUNCH + 90 * SECONDS_PER_DAY,
    };

    expect(calculateLockCredits(100_000, tooShortSchedule)).toBe(0);
    expect(calculateLockCredits(100_000, eligibleSchedule)).toBe(1_000);
    expect(calculateLockCredits(100_000, longSchedule)).toBe(1_000);
  });
});
