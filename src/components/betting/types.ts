import type { Match } from '@/types/match';
import type { PredictionChoice } from '@/lib/predictions';

/** A bet selection awaiting confirmation in the Bet Slip. */
export interface BetSelection {
  match: Match;
  choice: PredictionChoice;
  /** Odds (decimal string) at the moment the slip was opened. */
  odds: string;
}
