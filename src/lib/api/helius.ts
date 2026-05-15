import type { WalletEntry } from '@/types/leaderboard';

export interface TokenHoldersResponse {
  entries: WalletEntry[];
  total: number;
  uniqueHolderWallets?: number;
  totalTokenAccounts?: number;
  fetchedTokenAccounts?: number;
  pagesFetched?: number;
  holdersFullyIndexed?: boolean;
  page: number;
  limit: number;
  decimals?: number;
  source?: string;
  lastIndexedSlot?: number;
  mint?: string;
}

/**
 * Fetch token holders from the leaderboard proxy route.
 * The proxy keeps HELIUS_API_KEY server-side.
 */
export async function getTokenHolders(page = 1, limit = 100): Promise<TokenHoldersResponse> {
  const res = await fetch(`/api/leaderboard?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch token holders: ${res.status}`);
  return res.json();
}
