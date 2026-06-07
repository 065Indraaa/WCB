/**
 * Bet settlement API (settlement worker entry point).
 *
 * POST /api/bets/settle
 * Body: { matchId: number } + either { outcome: 'home'|'draw'|'away' }
 *                              or     { homeScore: number, awayScore: number }
 *
 * Resolves every pending bet on the match across all wallets: a matching
 * choice wins, others lose (Rule 2 refund applied via credit accounting).
 *
 * Protected by the BETTING_SETTLEMENT_SECRET env var when set: callers must
 * send it as the `x-settlement-secret` header. When unset (local dev) the
 * endpoint is open.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { settleMatch, outcomeFromScore } from '@/lib/bettingStore';
import type { PredictionChoice } from '@/lib/predictions';

const VALID_OUTCOMES: PredictionChoice[] = ['home', 'draw', 'away'];

export async function POST(request: NextRequest) {
  const secret = process.env.BETTING_SETTLEMENT_SECRET;
  if (secret && request.headers.get('x-settlement-secret') !== secret) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      matchId?: number;
      outcome?: string;
      homeScore?: number;
      awayScore?: number;
    };

    const matchId = Number(body.matchId);
    if (!Number.isFinite(matchId) || matchId <= 0) {
      return NextResponse.json({ success: false, error: 'matchId is required' }, { status: 400 });
    }

    let outcome: PredictionChoice | null = null;
    if (body.outcome != null) {
      if (!VALID_OUTCOMES.includes(body.outcome as PredictionChoice)) {
        return NextResponse.json({ success: false, error: 'outcome must be home, draw, or away' }, { status: 400 });
      }
      outcome = body.outcome as PredictionChoice;
    } else if (Number.isFinite(Number(body.homeScore)) && Number.isFinite(Number(body.awayScore))) {
      outcome = outcomeFromScore(Number(body.homeScore), Number(body.awayScore));
    } else {
      return NextResponse.json(
        { success: false, error: 'Provide outcome, or homeScore and awayScore' },
        { status: 400 },
      );
    }

    const settled = await settleMatch(matchId, outcome);
    const won = settled.filter((b) => b.status === 'won').length;
    const lost = settled.filter((b) => b.status === 'lost').length;

    return NextResponse.json({
      success: true,
      matchId,
      outcome,
      settledCount: settled.length,
      won,
      lost,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to settle match';
    console.error('[/api/bets/settle]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
