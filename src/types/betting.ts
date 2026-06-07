import type { PredictionChoice } from '@/lib/predictions';

export interface Bet {
  id: string;
  wallet: string;
  matchId: number;
  choice: PredictionChoice;
  amount: number;
  odds: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: string;
  settledAt?: string;
}

export interface CreditBalance {
  wallet: string;
  totalCredits: number;
  availableCredits: number;
  lockedInBets: number;
  /** Net credit delta from settled bets (wins add, losses subtract 80%). */
  settledNet: number;
  /** Cumulative 20% refunds received on losing bets. */
  totalRefunded: number;
}

export interface PlaceBetRequest {
  wallet: string;
  matchId: number;
  choice: PredictionChoice;
  amount: number;
  odds: string;
}

export interface PlaceBetResponse {
  success: boolean;
  bet?: Bet;
  balance?: CreditBalance;
  error?: string;
}
