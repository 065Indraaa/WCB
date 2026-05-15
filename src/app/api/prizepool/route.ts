import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { WCB_MINT } from '@/lib/tokenConfig';
import { buildHeliusRpcUrl, hasHeliusCredentials } from '@/lib/server/helius';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const PUMP_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
const LAMPORTS_PER_SOL = 1_000_000_000;

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
  };
  updatedAt?: string;
};

type RpcResponse<T> = {
  result?: T;
  error?: { message?: string };
};

type AssetCreator = {
  address?: string;
  verified?: boolean;
  share?: number;
};

const CANONICAL_CREATOR_FEE_BY_MCAP_SOL = [
  { max: 420, creatorFeeBps: 30 },
  { max: 1470, creatorFeeBps: 95 },
  { max: 2460, creatorFeeBps: 90 },
  { max: 3440, creatorFeeBps: 85 },
  { max: 4420, creatorFeeBps: 80 },
  { max: 9820, creatorFeeBps: 75 },
  { max: 14740, creatorFeeBps: 70 },
  { max: 19650, creatorFeeBps: 65 },
  { max: 24560, creatorFeeBps: 60 },
  { max: 29470, creatorFeeBps: 55 },
  { max: 34380, creatorFeeBps: 50 },
  { max: 39300, creatorFeeBps: 45 },
  { max: 44210, creatorFeeBps: 40 },
  { max: 49120, creatorFeeBps: 35 },
  { max: 54030, creatorFeeBps: 30 },
  { max: 58940, creatorFeeBps: 27.5 },
  { max: 63860, creatorFeeBps: 25 },
  { max: 68770, creatorFeeBps: 22.5 },
  { max: 73681, creatorFeeBps: 20 },
  { max: 78590, creatorFeeBps: 17.5 },
  { max: 83500, creatorFeeBps: 15 },
  { max: 88400, creatorFeeBps: 12.5 },
  { max: 93330, creatorFeeBps: 10 },
  { max: 98240, creatorFeeBps: 7.5 },
  { max: Number.POSITIVE_INFINITY, creatorFeeBps: 5 },
] as const;

function creatorFeeBpsForMarketCap(marketCapSol: number | null) {
  const override = Number(process.env.CREATOR_FEE_BPS ?? process.env.PRIZE_POOL_CREATOR_FEE_BPS);
  if (Number.isFinite(override) && override >= 0) return override;
  if (marketCapSol === null || marketCapSol < 0) return 30;
  return CANONICAL_CREATOR_FEE_BY_MCAP_SOL.find((tier) => marketCapSol < tier.max)?.creatorFeeBps ?? 5;
}

function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function rpc<T>(method: string, params: unknown[] | Record<string, unknown>): Promise<T> {
  const res = await fetch(buildHeliusRpcUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json() as RpcResponse<T>;
  if (json.error) throw new Error(json.error.message ?? 'RPC error');
  if (json.result === undefined) throw new Error('Missing RPC result');
  return json.result;
}

function derivePumpCreatorVault(creatorWallet: string) {
  const creator = new PublicKey(creatorWallet);
  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from('creator-vault'), creator.toBuffer()],
    PUMP_PROGRAM_ID,
  );
  return vault.toBase58();
}

async function fetchPumpCreatorVaultBalance(solUsd: number | null) {
  const creatorWallet = await detectPumpCreatorWallet();
  if (!creatorWallet) return null;

  const creatorVault = derivePumpCreatorVault(creatorWallet);
  const balance = await rpc<{ value: number }>('getBalance', [creatorVault]);
  const liveCreatorFeeSol = balance.value / LAMPORTS_PER_SOL;

  return {
    creatorWallet,
    creatorVault,
    liveCreatorFeeSol,
    liveCreatorFeeUsd: solUsd && solUsd > 0 ? liveCreatorFeeSol * solUsd : null,
  };
}

async function detectPumpCreatorWallet() {
  const explicitWallet = process.env.PUMPFUN_CREATOR_WALLET;
  if (explicitWallet) return explicitWallet;

  if (!hasHeliusCredentials()) return null;

  try {
    const asset = await rpc<{ creators?: AssetCreator[] }>('getAsset', { id: WCB_MINT });
    const creators = asset.creators ?? [];
    return creators.find((creator) => creator.verified && creator.address)?.address
      ?? creators.find((creator) => creator.address)?.address
      ?? null;
  } catch {
    return null;
  }
}

async function fetchJupiterToken(query: string, apiKey?: string): Promise<JupiterToken | null> {
  const baseUrl = process.env.JUPITER_TOKEN_API_URL ?? 'https://api.jup.ag/tokens/v2/search';
  const headers: Record<string, string> = {};
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Jupiter token API ${res.status}`);
  const data = await res.json() as JupiterToken[];
  if (!Array.isArray(data)) return null;
  return data.find((item) => item.id === query || item.address === query || item.mint === query) ?? data[0] ?? null;
}

export async function GET() {
  const tokenAddress = WCB_MINT;
  const apiKey = process.env.JUPITER_API_KEY;
  const allocationBps = Number(process.env.PRIZE_POOL_ALLOCATION_BPS ?? 10_000);

  try {
    const [token, sol] = await Promise.all([
      fetchJupiterToken(tokenAddress, apiKey),
      fetchJupiterToken(SOL_MINT, apiKey).catch(() => null),
    ]);

    const buyVolume = numberOrNull(token?.stats24h?.buyVolume) ?? 0;
    const sellVolume = numberOrNull(token?.stats24h?.sellVolume) ?? 0;
    const fallbackVolume = numberOrNull(token?.stats24h?.volume) ?? numberOrNull(token?.stats24h?.volumeUsd) ?? 0;
    const volume24hUsd = buyVolume + sellVolume > 0 ? buyVolume + sellVolume : fallbackVolume;

    const mcapUsd = numberOrNull(token?.mcap) ?? numberOrNull(token?.marketCap) ?? numberOrNull(token?.fdv);
    const solUsd = numberOrNull(sol?.usdPrice) ?? numberOrNull(sol?.price);
    const marketCapSol = mcapUsd !== null && solUsd && solUsd > 0 ? mcapUsd / solUsd : null;
    const creatorFeeBps = creatorFeeBpsForMarketCap(marketCapSol);
    const creatorFeeRate = creatorFeeBps / 10_000;
    const creatorFee24hUsd = volume24hUsd * creatorFeeRate;
    const allocationRate = Math.max(0, Math.min(10_000, Number.isFinite(allocationBps) ? allocationBps : 10_000)) / 10_000;
    const pumpCreatorVault = await fetchPumpCreatorVaultBalance(solUsd).catch(() => null);

    return NextResponse.json({
      available: volume24hUsd > 0,
      source: pumpCreatorVault ? 'pump-creator-vault+jupiter-token-api' : 'jupiter-token-api-estimate',
      token: {
        mint: tokenAddress,
        symbol: token?.symbol ?? '$WCB',
        marketCapUsd: mcapUsd,
        marketCapSol,
      },
      volume24hUsd,
      creatorFeeBps,
      creatorFeeRate,
      creatorFee24hUsd,
      pumpCreatorVault,
      allocationRate,
      prizePoolCredit24hUsd: creatorFee24hUsd * allocationRate,
      lastUpdated: token?.updatedAt ?? new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch prize pool data';
    return NextResponse.json({
      available: false,
      source: 'jupiter-token-api',
      error: message,
      volume24hUsd: 0,
      creatorFeeRate: 0,
      creatorFee24hUsd: 0,
      prizePoolCredit24hUsd: 0,
      allocationRate: 0,
      lastUpdated: new Date().toISOString(),
    }, { status: 502 });
  }
}
