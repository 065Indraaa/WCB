import { describe, it, expect } from 'vitest';
import { getLaunchState, isLive, LAUNCH_DATES } from '../launchState';

describe('LAUNCH_DATES', () => {
  it('whitelist date is May 20, 2026 00:00 UTC by default', () => {
    expect(LAUNCH_DATES.whitelist.toISOString()).toBe('2026-05-20T00:00:00.000Z');
  });

  it('nftBeta date is June 1, 2026 00:00 UTC by default', () => {
    expect(LAUNCH_DATES.nftBeta.toISOString()).toBe('2026-06-01T00:00:00.000Z');
  });

  it('live date is June 11, 2026 00:00 UTC by default', () => {
    expect(LAUNCH_DATES.live.toISOString()).toBe('2026-06-11T00:00:00.000Z');
  });
});

describe('getLaunchState', () => {
  it('returns "pre-launch" well before the whitelist date', () => {
    expect(getLaunchState(new Date('2025-01-01T00:00:00Z'))).toBe('pre-launch');
  });

  it('returns "pre-launch" one millisecond before the whitelist date', () => {
    const justBefore = new Date(LAUNCH_DATES.whitelist.getTime() - 1);
    expect(getLaunchState(justBefore)).toBe('pre-launch');
  });

  it('returns "whitelist" exactly at the whitelist date', () => {
    expect(getLaunchState(new Date('2026-05-20T00:00:00Z'))).toBe('whitelist');
  });

  it('returns "whitelist" in the middle of the whitelist phase', () => {
    expect(getLaunchState(new Date('2026-05-25T12:00:00Z'))).toBe('whitelist');
  });

  it('returns "whitelist" one millisecond before the nftBeta date', () => {
    const justBefore = new Date(LAUNCH_DATES.nftBeta.getTime() - 1);
    expect(getLaunchState(justBefore)).toBe('whitelist');
  });

  it('returns "nft-beta" exactly at the nftBeta date', () => {
    expect(getLaunchState(new Date('2026-06-01T00:00:00Z'))).toBe('nft-beta');
  });

  it('returns "nft-beta" in the middle of the NFT & Beta phase', () => {
    expect(getLaunchState(new Date('2026-06-05T06:00:00Z'))).toBe('nft-beta');
  });

  it('returns "nft-beta" one millisecond before the live date', () => {
    const justBefore = new Date(LAUNCH_DATES.live.getTime() - 1);
    expect(getLaunchState(justBefore)).toBe('nft-beta');
  });

  it('returns "live" exactly at the live date', () => {
    expect(getLaunchState(new Date('2026-06-11T00:00:00Z'))).toBe('live');
  });

  it('returns "live" well after the live date', () => {
    expect(getLaunchState(new Date('2027-01-01T00:00:00Z'))).toBe('live');
  });

  it('is deterministic — same input always returns same output', () => {
    const ts = new Date('2026-05-22T08:30:00Z');
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

  it('returns false during the whitelist phase', () => {
    expect(isLive(new Date('2026-05-25T00:00:00Z'))).toBe(false);
  });

  it('returns false during the nft-beta phase', () => {
    expect(isLive(new Date('2026-06-05T00:00:00Z'))).toBe(false);
  });
});
