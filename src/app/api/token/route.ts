import { NextResponse } from 'next/server';
import type { TokenMetrics } from '@/types/token';
import { WCB_MINT, WCB_TOKEN_DECIMALS } from '@/lib/tokenConfig';
import { buildHeliusRpcUrl } from '@/lib/server/helius';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type JupiterToken = {
  id?: string;
  address?: string;
  mint?: string;
  symbol?: string;
  usdPrice?: number;
  price?: number;
  mcap?: number;
  fdv?: number;
  marketCap?: number;
  stats24h?: {
    buyVolume?: number;
    sellVolume?: number;
    volume?: number;
    volumeUsd?: number;
    priceChange?: number;
    priceChangePct?: number;
  };
  updatedAt?: string;
};

function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function rpc<T>(rpcUrl: string, method: string, params: unknown[] | Record<string, unknown>): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json() as { result?: T; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? 'RPC error');
  if (json.result === undefined) throw new Error('Missing RPC result');
  return json.result;
}

async function fetchJupiterToken(query: string): Promise<JupiterToken | null> {
  const baseUrl = process.env.JUPITER_TOKEN_API_URL ?? 'https://api.jup.ag/tokens/v2/search';
  const headers: Record<string, string> = {};
  if (process.env.JUPITER_API_KEY) headers['x-api-key'] = process.env.JUPITER_API_KEY;

  const res = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Jupiter token API ${res.status}`);
  const data = await res.json() as JupiterToken[];
  if (!Array.isArray(data)) return null;
  return data.find((item) => item.id === query || item.address === query || item.mint === query) ?? data[0] ?? null;
}

async function fetchHolderCount(mint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  if (!baseUrl) return 0;

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/leaderboard?limit=1`, {
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return 0;

  const data = await res.json() as { total?: number; mint?: string };
  if (data.mint && data.mint !== mint) return 0;
  return Number.isFinite(data.total) ? data.total ?? 0 : 0;
}

async function getTokenSupply(mint: string) {
  try {
    const result = await rpc<{ value?: { uiAmount?: number | null; amount?: string; decimals?: number } }>(
      buildHeliusRpcUrl(),
      'getTokenSupply',
      [mint],
    );
    const uiAmount = numberOrNull(result.value?.uiAmount);
    if (uiAmount !== null) return uiAmount;

    const raw = numberOrNull(result.value?.amount);
    const decimals = result.value?.decimals ?? WCB_TOKEN_DECIMALS;
    return raw !== null ? raw / Math.pow(10, decimals) : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const tokenAddress = WCB_MINT;

  try {
    const [token, holders, supply] = await Promise.all([
      fetchJupiterToken(tokenAddress),
      fetchHolderCount(tokenAddress).catch(() => 0),
      getTokenSupply(tokenAddress),
    ]);

    const price = numberOrNull(token?.usdPrice) ?? numberOrNull(token?.price) ?? 0;
    const priceChange24h =
      numberOrNull(token?.stats24h?.priceChange) ??
      numberOrNull(token?.stats24h?.priceChangePct) ??
      0;
    const apiMarketCap = numberOrNull(token?.mcap) ?? numberOrNull(token?.marketCap);
    const marketCap = apiMarketCap ?? (price > 0 && supply > 0 ? price * supply : numberOrNull(token?.fdv) ?? 0);
    const volume24hUsd =
      numberOrNull(token?.stats24h?.buyVolume) !== null && numberOrNull(token?.stats24h?.sellVolume) !== null
        ? (numberOrNull(token?.stats24h?.buyVolume) ?? 0) + (numberOrNull(token?.stats24h?.sellVolume) ?? 0)
        : numberOrNull(token?.stats24h?.volume) ?? numberOrNull(token?.stats24h?.volumeUsd) ?? 0;

    return NextResponse.json({
      price,
      priceChange24h,
      marketCap,
      holders,
      burned: 0,
      volume24hUsd,
      source: 'jupiter-token-api+helius-das',
      available: true,
      lastUpdated: token?.updatedAt ?? new Date().toISOString(),
    } satisfies TokenMetrics);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch token metrics';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
