import { NextRequest, NextResponse } from 'next/server';
import { assignTier, assignBadges } from '@/lib/utils/tiers';
import { formatWallet } from '@/lib/utils/formatters';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);

  const apiKey = process.env.HELIUS_API_KEY;
  const rpcUrl = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

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

  const res = await fetch(`${rpcUrl}/?api-key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenLargestAccounts',
      params: [tokenAddress],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Helius RPC error' }, { status: res.status });
  }

  const data = await res.json();
  const accounts: Array<{ address: string; amount: string }> = data.result?.value ?? [];

  const entries = accounts
    .slice((page - 1) * limit, page * limit)
    .map((account, index) => {
      const holdings = parseInt(account.amount, 10);
      const walletData = { holdings, holdingSince: undefined };
      return {
        rank: (page - 1) * limit + index + 1,
        address: account.address,
        displayAddress: formatWallet(account.address),
        holdings,
        tier: assignTier(holdings),
        badges: assignBadges(walletData),
      };
    });

  return NextResponse.json({
    entries,
    total: accounts.length,
    page,
    limit,
  });
}
