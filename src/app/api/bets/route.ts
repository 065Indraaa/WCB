/**
 * Betting API
 * POST   /api/bets          — place a bet
 * GET    /api/bets?wallet=  — list bets
 * DELETE /api/bets?id=      — cancel a pending bet
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { addBet, getBets, cancelBet } from '@/lib/bettingStore';
import { computeCreditBalance } from '@/lib/server/credits';
import type { PredictionChoice } from '@/lib/predictions';

const VALID_CHOICES: PredictionChoice[] = ['home', 'draw', 'away'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      wallet?: string;
      matchId?: number;
      choice?: string;
      amount?: number;
      odds?: string;
    };

    const wallet = body.wallet?.trim();
    const matchId = Number(body.matchId);
    const choice = body.choice as PredictionChoice;
    const amount = Number(body.amount);
    const odds = body.odds ?? '1.00';

    if (!wallet) {
      return NextResponse.json({ success: false, error: 'wallet is required' }, { status: 400 });
    }
    if (!Number.isFinite(matchId) || matchId <= 0) {
      return NextResponse.json({ success: false, error: 'matchId is required' }, { status: 400 });
    }
    if (!VALID_CHOICES.includes(choice)) {
      return NextResponse.json({ success: false, error: 'choice must be home, draw, or away' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'amount must be > 0' }, { status: 400 });
    }

    // Recompute balance from on-chain locks to prevent race conditions
    const balance = await computeCreditBalance(wallet);
    if (amount > balance.availableCredits) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits', balance },
        { status: 400 },
      );
    }

    const bet = await addBet(wallet, matchId, choice, amount, odds);
    const newBalance = await computeCreditBalance(wallet);

    return NextResponse.json({ success: true, bet, balance: newBalance });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to place bet';
    console.error('[/api/bets POST]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'wallet parameter required', bets: [] }, { status: 400 });
  }

  try {
    const bets = await getBets(wallet);
    const balance = await computeCreditBalance(wallet);
    return NextResponse.json({ bets, balance });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bets';
    return NextResponse.json({ error: message, bets: [] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');
  const betId = searchParams.get('id');

  if (!wallet || !betId) {
    return NextResponse.json({ success: false, error: 'wallet and id parameters required' }, { status: 400 });
  }

  try {
    const cancelled = await cancelBet(wallet, betId);
    if (!cancelled) {
      return NextResponse.json({ success: false, error: 'Bet not found or already settled' }, { status: 404 });
    }
    const balance = await computeCreditBalance(wallet);
    return NextResponse.json({ success: true, bet: cancelled, balance });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to cancel bet';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
