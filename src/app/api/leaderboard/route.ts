import { NextRequest, NextResponse } from 'next/server';
import { assignTier, assignBadges } from '@/lib/utils/tiers';
import { formatWallet } from '@/lib/utils/formatters';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_WCB_MINT = 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const SYSTEM_PROGRAM_ID = '11111111111111111111111111111111';
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const DEFAULT_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? 6);
const MAX_HELIUS_PAGES = Number(process.env.HOLDER_HELIUS_MAX_PAGES ?? 12);

type Holder = {
  address: string;
  holdings: number;
};

type HeliusTokenAccount = {
  address?: string;
  mint?: string;
  owner?: string;
  amount?: number | string;
  delegated_amount?: number | string;
  frozen?: boolean;
  burnt?: unknown;
};

type HeliusTokenAccountsResponse = {
  result?: {
    total?: number;
    limit?: number;
    cursor?: string;
    last_indexed_slot?: number;
    token_accounts?: HeliusTokenAccount[];
  };
  error?: { message?: string };
};

async function rpc(rpcUrl: string, method: string, params: unknown) {
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

function buildHeliusRpcUrl(apiKey?: string) {
  const baseUrl = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
  if (!apiKey || apiKey === 'your_helius_api_key_here') return 'https://api.mainnet-beta.solana.com';
  if (baseUrl.includes('api-key=')) return baseUrl;
  const separator = baseUrl.includes('?') ? '&' : baseUrl.endsWith('/') ? '?' : '/?';
  return `${baseUrl}${separator}api-key=${apiKey}`;
}

async function getTokenDecimals(rpcUrl: string, mint: string) {
  try {
    const result = await rpc(rpcUrl, 'getTokenSupply', [mint]) as {
      value?: { decimals?: number };
    };
    const decimals = result.value?.decimals;
    return Number.isFinite(decimals) ? decimals ?? DEFAULT_DECIMALS : DEFAULT_DECIMALS;
  } catch {
    return DEFAULT_DECIMALS;
  }
}

function addHolderAmount(map: Map<string, number>, owner: string | undefined, rawAmount: unknown, decimals: number) {
  if (!owner) return;
  const raw = Number(rawAmount ?? 0);
  if (!Number.isFinite(raw) || raw <= 0) return;

  const holdings = raw / Math.pow(10, decimals);
  if (!Number.isFinite(holdings) || holdings <= 0) return;

  map.set(owner, (map.get(owner) ?? 0) + holdings);
}

async function fetchHoldersViaHeliusDas(rpcUrl: string, mint: string, decimals: number) {
  const byOwner = new Map<string, number>();
  let cursor: string | undefined;
  let total = 0;
  let lastIndexedSlot: number | undefined;

  for (let page = 0; page < MAX_HELIUS_PAGES; page++) {
    const params: Record<string, unknown> = {
      mint,
      limit: 1000,
      options: { showZeroBalance: false },
    };
    if (cursor) params.cursor = cursor;

    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: `holders-${page}`, method: 'getTokenAccounts', params }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) throw new Error(`Helius getTokenAccounts HTTP ${res.status}`);

    const json = await res.json() as HeliusTokenAccountsResponse;
    if (json.error) throw new Error(json.error.message ?? 'Helius getTokenAccounts error');

    const result = json.result;
    const accounts = result?.token_accounts ?? [];
    total = result?.total ?? total;
    lastIndexedSlot = result?.last_indexed_slot ?? lastIndexedSlot;

    for (const account of accounts) {
      addHolderAmount(byOwner, account.owner, account.amount, decimals);
    }

    cursor = result?.cursor;
    if (!cursor || accounts.length === 0) break;
  }

  return {
    holders: Array.from(byOwner.entries())
      .map(([address, holdings]) => ({ address, holdings }))
      .sort((a, b) => b.holdings - a.holdings),
    totalTokenAccounts: total,
    lastIndexedSlot,
  };
}

async function fetchAggregatedHoldersViaRpc(rpcUrl: string, mint: string) {
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
            };
          };
        };
      };
    };
  }>;

  const byOwner = new Map<string, number>();

  for (const item of accounts ?? []) {
    const info = item.account?.data?.parsed?.info;
    const decimals = info?.tokenAmount?.decimals ?? DEFAULT_DECIMALS;
    addHolderAmount(byOwner, info?.owner, info?.tokenAmount?.amount, decimals);
  }

  return Array.from(byOwner.entries())
    .map(([address, holdings]) => ({ address, holdings }))
    .sort((a, b) => b.holdings - a.holdings);
}

async function fetchLargestAccountsFallback(rpcUrl: string, mint: string) {
  const data = await rpc(rpcUrl, 'getTokenLargestAccounts', [mint]) as {
    value?: Array<{ address: string; amount: string; decimals?: number }>;
  };

  const holders: Holder[] = [];

  await Promise.all(
    (data.value ?? []).map(async (account) => {
      try {
        const info = await rpc(rpcUrl, 'getAccountInfo', [account.address, { encoding: 'jsonParsed' }]) as {
          value?: { data?: { parsed?: { info?: { owner?: string } } } } | null;
        };
        const owner = info.value?.data?.parsed?.info?.owner;
        if (!owner) return;

        const raw = Number(account.amount ?? 0);
        const holdings = raw / Math.pow(10, account.decimals ?? DEFAULT_DECIMALS);

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

async function filterLikelyUserWallets(rpcUrl: string, holders: Holder[], minimumCount: number) {
  if (process.env.HOLDER_EXCLUDE_PROGRAM_OWNERS === 'false') return holders;

  const candidates = holders.slice(0, Math.max(minimumCount * 3, minimumCount));
  const batches: Holder[][] = [];
  for (let i = 0; i < candidates.length; i += 100) batches.push(candidates.slice(i, i + 100));

  const accepted: Holder[] = [];

  for (const batch of batches) {
    try {
      const result = await rpc(rpcUrl, 'getMultipleAccounts', [
        batch.map((holder) => holder.address),
        { encoding: 'base64' },
      ]) as { value?: Array<{ owner?: string } | null> };

      batch.forEach((holder, index) => {
        const ownerProgram = result.value?.[index]?.owner;
        if (!ownerProgram || ownerProgram === SYSTEM_PROGRAM_ID) {
          accepted.push(holder);
        }
      });
    } catch {
      accepted.push(...batch);
    }

    if (accepted.length >= minimumCount) break;
  }

  return accepted.length >= minimumCount ? accepted : holders;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '100', 10)));
  const apiKey = process.env.HELIUS_API_KEY;
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || DEFAULT_WCB_MINT;
  const resolvedRpcUrl = buildHeliusRpcUrl(apiKey);

  try {
    const decimals = await getTokenDecimals(resolvedRpcUrl, tokenAddress);
    let holders: Holder[] = [];
    let source = 'helius-das-token-accounts';
    let totalTokenAccounts: number | undefined;
    let lastIndexedSlot: number | undefined;

    try {
      if (!apiKey || apiKey === 'your_helius_api_key_here') {
        throw new Error('HELIUS_API_KEY is required for getTokenAccounts');
      }
      const das = await fetchHoldersViaHeliusDas(resolvedRpcUrl, tokenAddress, decimals);
      holders = das.holders;
      totalTokenAccounts = das.totalTokenAccounts;
      lastIndexedSlot = das.lastIndexedSlot;
    } catch {
      try {
        source = 'rpc-getProgramAccounts';
        holders = await fetchAggregatedHoldersViaRpc(resolvedRpcUrl, tokenAddress);
      } catch {
        source = 'rpc-getTokenLargestAccounts-fallback';
        holders = await fetchLargestAccountsFallback(resolvedRpcUrl, tokenAddress);
      }
    }

    holders = await filterLikelyUserWallets(resolvedRpcUrl, holders, page * limit);

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
      totalTokenAccounts,
      page,
      limit,
      decimals,
      source,
      lastIndexedSlot,
      mint: tokenAddress,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch holders';
    return NextResponse.json({ error: message, entries: [], total: 0, page, limit }, { status: 500 });
  }
}
