import { NextRequest, NextResponse } from 'next/server';
import { assignTier, assignBadges } from '@/lib/utils/tiers';
import { formatWallet } from '@/lib/utils/formatters';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

async function rpc(rpcUrl: string, method: string, params: unknown[]) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);

  const json = await res.json() as { result?: unknown; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? 'RPC error');
  return json.result;
}

async function fetchAggregatedHolders(rpcUrl: string, mint: string) {
  const accounts = await rpc(rpcUrl, 'getProgramAccounts', [
    TOKEN_PROGRAM_ID,
    {
      encoding: 'jsonParsed',
      filters: [
        { dataSize: 165 },
        { memcmp: { offset: 0, bytes: mint } },
      ],
    },
  ]) as Array<{
    account?: {
      data?: {
        parsed?: {
          info?: {
            owner?: string;
            tokenAmount?: {
              amount?: string;
              decimals?: number;
              uiAmount?: number | null;
              uiAmountString?: string;
            };
          };
        };
      };
    };
  }>;

  const byOwner = new Map<string, number>();

  for (const item of accounts ?? []) {
    const info = item.account?.data?.parsed?.info;
    const owner = info?.owner;
    const tokenAmount = info?.tokenAmount;
    if (!owner || !tokenAmount) continue;

    const decimals = tokenAmount.decimals ?? 0;
    const raw = Number(tokenAmount.amount ?? 0);
    const uiAmount =
      typeof tokenAmount.uiAmount === 'number'
        ? tokenAmount.uiAmount
        : tokenAmount.uiAmountString
          ? Number(tokenAmount.uiAmountString)
          : raw / Math.pow(10, decimals);

    if (!Number.isFinite(uiAmount) || uiAmount <= 0) continue;
    byOwner.set(owner, (byOwner.get(owner) ?? 0) + uiAmount);
  }

  return Array.from(byOwner.entries())
    .map(([address, holdings]) => ({ address, holdings }))
    .sort((a, b) => b.holdings - a.holdings);
}

async function fetchLargestAccountsFallback(rpcUrl: string, mint: string) {
  const data = await rpc(rpcUrl, 'getTokenLargestAccounts', [mint]) as {
    value?: Array<{ address: string; amount: string; decimals?: number; uiAmount?: number | null; uiAmountString?: string }>;
  };

  const holders: Array<{ address: string; holdings: number }> = [];

  await Promise.all(
    (data.value ?? []).map(async (account) => {
      try {
        const info = await rpc(rpcUrl, 'getAccountInfo', [account.address, { encoding: 'jsonParsed' }]) as {
          value?: { data?: { parsed?: { info?: { owner?: string } } } } | null;
        };
        const owner = info.value?.data?.parsed?.info?.owner;
        if (!owner) return;

        const decimals = account.decimals ?? 0;
        const raw = Number(account.amount ?? 0);
        const holdings =
          typeof account.uiAmount === 'number'
            ? account.uiAmount
            : account.uiAmountString
              ? Number(account.uiAmountString)
              : raw / Math.pow(10, decimals);

        if (Number.isFinite(holdings) && holdings > 0) {
          holders.push({ address: owner, holdings });
        }
      } catch {
        // Skip accounts that cannot be resolved to wallet owners.
      }
    }),
  );

  const byOwner = new Map<string, number>();
  holders.forEach((holder) => {
    byOwner.set(holder.address, (byOwner.get(holder.address) ?? 0) + holder.holdings);
  });

  return Array.from(byOwner.entries())
    .map(([address, holdings]) => ({ address, holdings }))
    .sort((a, b) => b.holdings - a.holdings);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);

  const apiKey = process.env.HELIUS_API_KEY;
  const rpcUrl = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  const resolvedRpcUrl = apiKey ? `${rpcUrl}/?api-key=${apiKey}` : 'https://api.mainnet-beta.solana.com';

  // Return stub data when API credentials are not configured
  if (
    !apiKey ||
    apiKey === 'your_helius_api_key_here' ||
    !tokenAddress ||
    tokenAddress === 'your_token_contract_address_here'
  ) {
    return NextResponse.json({
      entries: [],
      total: 0,
      page,
      limit,
    });
  }

  try {
    let holders: Array<{ address: string; holdings: number }>;
    try {
      holders = await fetchAggregatedHolders(resolvedRpcUrl, tokenAddress);
    } catch {
      holders = await fetchLargestAccountsFallback(resolvedRpcUrl, tokenAddress);
    }

    const entries = holders
      .slice((page - 1) * limit, page * limit)
      .map((holder, index) => {
        const holdings = holder.holdings;
        const walletData = { holdings, holdingSince: undefined };
        return {
          rank: (page - 1) * limit + index + 1,
          address: holder.address,
          displayAddress: formatWallet(holder.address),
          holdings,
          tier: assignTier(holdings),
          badges: assignBadges(walletData),
        };
      });

    return NextResponse.json({
      entries,
      total: holders.length,
      page,
      limit,
      source: 'token-accounts',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch holders';
    return NextResponse.json({ error: message, entries: [], total: 0, page, limit }, { status: 500 });
  }
}
