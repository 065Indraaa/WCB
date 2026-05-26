export interface PrizePoolMetrics {
  available: boolean;
  source: string;
  message?: string;
  error?: string;
  pumpCreatorVault?: {
    creatorWallet: string;
    creatorVault: string;
    liveCreatorFeeSol: number;
    liveCreatorFeeUsd: number | null;
  } | null;
  token?: {
    mint: string;
    symbol: string;
    marketCapUsd: number | null;
    marketCapSol: number | null;
  };
  volume24hUsd: number;
  creatorFeeBps?: number;
  creatorFeeRate: number;
  creatorFee24hUsd: number;
  creatorFeeTotalSol?: number | null;
  creatorFeeTotalUsd?: number | null;
  allocationRate: number;
  prizePoolCredit24hUsd: number;
  prizePoolCreditTotalUsd?: number | null;
  lastUpdated: string;
}

export async function getPrizePoolMetrics(): Promise<PrizePoolMetrics> {
  const res = await fetch('/api/prizepool');
  if (!res.ok) throw new Error(`Failed to fetch prize pool metrics: ${res.status}`);
  return res.json();
}
