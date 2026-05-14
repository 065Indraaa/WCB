export interface TokenMetrics {
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  burned: number;
  lastUpdated: string;
}

export type PriceDirection = 'up' | 'down' | 'neutral';
