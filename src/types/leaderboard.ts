export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type Badge = 'Diamond Hands' | 'Early Bird' | 'Whale';

export interface WalletEntry {
  rank: number;
  address: string;
  displayAddress: string;
  holdings: number;
  tier: Tier;
  badges: Badge[];
  holdingSince?: string;
}
