import { NextResponse } from 'next/server';
import type { TokenMetrics } from '@/types/token';

export const runtime = 'edge';

export async function GET() {
  const apiKey = process.env.COINGECKO_API_KEY;
  const baseUrl = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3';
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  if (
    !apiKey ||
    apiKey === 'your_coingecko_api_key_here' ||
    !tokenAddress ||
    tokenAddress === 'your_token_contract_address_here'
  ) {
    // Return stub data when not configured
    return NextResponse.json({
      price: 0.000042,
      priceChange24h: 4.2,
      marketCap: 420000,
      holders: 1250,
      burned: 2100000000,
      lastUpdated: new Date().toISOString(),
    } satisfies TokenMetrics);
  }

  // Proxy to CoinGecko API
  const res = await fetch(
    `${baseUrl}/simple/price?ids=${tokenAddress}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`,
    {
      headers: {
        'x-cg-demo-api-key': apiKey,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'CoinGecko API error' }, { status: res.status });
  }

  const data = await res.json();
  const tokenData = data[tokenAddress] ?? {};

  return NextResponse.json({
    price: tokenData.usd ?? 0,
    priceChange24h: tokenData.usd_24h_change ?? 0,
    marketCap: tokenData.usd_market_cap ?? 0,
    holders: 0, // CoinGecko doesn't provide holder count directly
    burned: 0,
    lastUpdated: new Date().toISOString(),
  } satisfies TokenMetrics);
}
