/**
 * Betting Leaderboard API
 * GET /api/bets/leaderboard — global bettor rankings
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getLeaderboardStats } from '@/lib/bettingStore';

export async function GET() {
  try {
    const leaderboard = await getLeaderboardStats();
    return NextResponse.json({ leaderboard });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
    console.error('[/api/bets/leaderboard]', message);
    return NextResponse.json({ leaderboard: [], error: message }, { status: 500 });
  }
}
