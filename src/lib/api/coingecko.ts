import type { TokenMetrics } from '@/types/token';

export async function getTokenMetrics(): Promise<TokenMetrics> {
  const res = await fetch('/api/token');
  if (!res.ok) throw new Error(`Failed to fetch token metrics: ${res.status}`);
  return res.json();
}
