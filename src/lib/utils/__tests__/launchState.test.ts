import { describe, it, expect } from 'vitest';
import { getLaunchState, isLive, LAUNCH_DATES } from '../launchState';

describe('LAUNCH_DATES', () => {
  it('live date is June 11, 2026 00:00 UTC by default', () => {
    expect(LAUNCH_DATES.live.toISOString()).toBe('2026-06-11T00:00:00.000Z');
  });
});

describe('getLaunchState', () => {
  it('returns "pre-launch" well before the live date', () => {
    expect(getLaunchState(new Date('2025-01-01T00:00:00Z'))).toBe('pre-launch');
  });

  it('returns "pre-launch" one millisecond before the live date', () => {
    const justBefore = new Date(LAUNCH_DATES.live.getTime() - 1);
    expect(getLaunchState(justBefore)).toBe('pre-launch');
  });

  it('returns "live" exactly at the live date', () => {
    expect(getLaunchState(new Date('2026-06-11T00:00:00Z'))).toBe('live');
  });

  it('returns "live" well after the live date', () => {
    expect(getLaunchState(new Date('2027-01-01T00:00:00Z'))).toBe('live');
  });

  it('is deterministic — same input always returns same output', () => {
    const ts = new Date('2026-03-15T08:30:00Z');
    expect(getLaunchState(ts)).toBe(getLaunchState(ts));
  });
});

describe('isLive', () => {
  it('returns false before the live date', () => {
    expect(isLive(new Date('2026-06-10T23:59:59Z'))).toBe(false);
  });

  it('returns true exactly at the live date', () => {
    expect(isLive(new Date('2026-06-11T00:00:00Z'))).toBe(true);
  });

  it('returns true after the live date', () => {
    expect(isLive(new Date('2026-07-01T00:00:00Z'))).toBe(true);
  });
});
