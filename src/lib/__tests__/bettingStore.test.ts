import { describe, it, expect, beforeEach } from 'vitest';
import {
  addBet,
  getBets,
  getActiveBets,
  getTotalLockedInBets,
  getSettledNet,
  getTotalRefunded,
  settleMatch,
  outcomeFromScore,
  cancelBet,
  clearAllBets,
  LOSS_REFUND_RATE,
} from '@/lib/bettingStore';

const WALLET = 'TestWa11etAddress1111111111111111111111111';
const OTHER = 'OtherWa11etAddress2222222222222222222222222';

beforeEach(async () => {
  await clearAllBets();
});

describe('outcomeFromScore', () => {
  it('derives 1X2 from a final score', () => {
    expect(outcomeFromScore(2, 1)).toBe('home');
    expect(outcomeFromScore(0, 3)).toBe('away');
    expect(outcomeFromScore(1, 1)).toBe('draw');
  });
});

describe('placing bets locks credits', () => {
  it('tracks pending stake as locked-in-bets', async () => {
    await addBet(WALLET, 10, 'home', 100, '2.00');
    await addBet(WALLET, 11, 'draw', 50, '3.00');
    expect(await getActiveBets(WALLET)).toHaveLength(2);
    expect(await getTotalLockedInBets(WALLET)).toBe(150);
    // No settlement yet → no net delta.
    expect(await getSettledNet(WALLET)).toBe(0);
  });

  it('cancelled bets free their stake and contribute zero net', async () => {
    const bet = await addBet(WALLET, 10, 'home', 100, '2.00');
    await cancelBet(WALLET, bet.id);
    expect(await getTotalLockedInBets(WALLET)).toBe(0);
    expect(await getSettledNet(WALLET)).toBe(0);
  });
});

describe('settlement + 20% refund accounting (Rule 2)', () => {
  it('a winning bet adds profit = stake × (odds − 1)', async () => {
    await addBet(WALLET, 10, 'home', 100, '2.50');
    await settleMatch(10, 'home');
    expect((await getBets(WALLET))[0].status).toBe('won');
    expect(await getTotalLockedInBets(WALLET)).toBe(0); // no longer pending
    expect(await getSettledNet(WALLET)).toBeCloseTo(150); // 100 × (2.5 − 1)
    expect(await getTotalRefunded(WALLET)).toBe(0);
  });

  it('a losing bet subtracts 80% and refunds 20%', async () => {
    await addBet(WALLET, 10, 'home', 100, '2.00');
    await settleMatch(10, 'away'); // home pick loses
    expect((await getBets(WALLET))[0].status).toBe('lost');
    expect(await getSettledNet(WALLET)).toBeCloseTo(-80); // −100 × (1 − 0.2)
    expect(await getTotalRefunded(WALLET)).toBeCloseTo(20); // 100 × 0.2
  });

  it('LOSS_REFUND_RATE is 20%', () => {
    expect(LOSS_REFUND_RATE).toBe(0.2);
  });

  it('settles only the targeted match and only pending bets', async () => {
    await addBet(WALLET, 10, 'home', 100, '2.00');
    await addBet(WALLET, 11, 'away', 100, '2.00');
    const settled = await settleMatch(10, 'home');
    expect(settled).toHaveLength(1);
    expect((await getBets(WALLET)).find((b) => b.matchId === 11)!.status).toBe('pending');
    // Re-settling the same match does nothing (already settled).
    expect(await settleMatch(10, 'home')).toHaveLength(0);
  });

  it('settles bets across multiple wallets in one call', async () => {
    await addBet(WALLET, 10, 'home', 100, '2.00');
    await addBet(OTHER, 10, 'away', 100, '2.00');
    const settled = await settleMatch(10, 'home');
    expect(settled).toHaveLength(2);
    expect(await getSettledNet(WALLET)).toBeCloseTo(100); // won: 100 × (2−1)
    expect(await getSettledNet(OTHER)).toBeCloseTo(-80); // lost
  });
});
