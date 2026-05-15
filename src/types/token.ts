export interface TokenMetrics {
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  burned: number;
  volume24hUsd?: number;
  source?: string;
  available?: boolean;
  error?: string;
  lastUpdated: string;
}

export type PriceDirection = 'up' | 'down' | 'neutral';
