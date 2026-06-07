/**
 * GET /api/credits?wallet=<address>
 *
 * Returns a wallet's credit balance:
 * - totalCredits: computed from on-chain Streamflow locks
 * - availableCredits: totalCredits minus credits locked in active bets
 * - lockedInBets: sum of credits staked in pending bets
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { computeCreditBalance } from '@/lib/server/credits';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json(
      { error: 'wallet parameter required', wallet: '', totalCredits: 0, availableCredits: 0, lockedInBets: 0, settledNet: 0, totalRefunded: 0 },
      { status: 400 },
    );
  }

  try {
    const balance = await computeCreditBalance(wallet);
    return NextResponse.json(balance);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to compute credit balance';
    console.error('[/api/credits]', message);
    return NextResponse.json(
      { error: message, wallet, totalCredits: 0, availableCredits: 0, lockedInBets: 0, settledNet: 0, totalRefunded: 0 },
      { status: 500 },
    );
  }
}
