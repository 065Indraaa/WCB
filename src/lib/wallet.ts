/**
 * Wallet utilities for $WCB platform.
 * Wraps @solana/wallet-adapter-react for use across the app.
 */

export { DEFAULT_WCB_MINT, WCB_MINT } from '@/lib/tokenConfig';

export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ??
  (process.env.NEXT_PUBLIC_HELIUS_API_KEY
    ? `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
    : 'https://api.mainnet-beta.solana.com');

/** Streamflow program ID on Solana mainnet */
export const STREAMFLOW_PROGRAM_ID = 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m';

/** Truncate a wallet address for display */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
