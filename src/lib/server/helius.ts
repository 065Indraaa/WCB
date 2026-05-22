const DEFAULT_HELIUS_RPC_URL = 'https://mainnet.helius-rpc.com';
const PUBLIC_SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const HELIUS_API_KEY_PLACEHOLDER = 'your_helius_api_key_here';

export function getHeliusApiKey() {
  const apiKey = process.env.HELIUS_API_KEY?.trim();
  if (!apiKey || apiKey === HELIUS_API_KEY_PLACEHOLDER) return undefined;
  return apiKey;
}

export function hasHeliusCredentials() {
  const rpcUrl = process.env.HELIUS_RPC_URL?.trim();
  return Boolean(getHeliusApiKey() || rpcUrl?.includes('api-key='));
}

/**
 * Build the best available RPC URL for server-side Streamflow SDK calls.
 * Prefers Helius (private, higher rate limits) and falls back to public Solana RPC.
 * NOTE: Public RPC is heavily rate-limited and may fail for getProgramAccounts.
 */
export function buildHeliusRpcUrl() {
  const apiKey = getHeliusApiKey();
  const configuredUrl = process.env.HELIUS_RPC_URL?.trim();

  if (configuredUrl?.includes('api-key=')) return configuredUrl;
  if (apiKey) {
    const baseUrl = configuredUrl || DEFAULT_HELIUS_RPC_URL;
    const separator = baseUrl.includes('?') ? '&' : baseUrl.endsWith('/') ? '?' : '/?';
    return `${baseUrl}${separator}api-key=${apiKey}`;
  }

  // No Helius key — warn and fall back to public RPC
  const fallback = configuredUrl || PUBLIC_SOLANA_RPC_URL;
  if (fallback === PUBLIC_SOLANA_RPC_URL) {
    console.warn(
      '[helius] No HELIUS_API_KEY found. Falling back to public Solana RPC.\n' +
        'Streamflow lock lookups may fail due to public RPC rate limits.\n' +
        'Set HELIUS_API_KEY in your environment for reliable lock reads.'
    );
  }
  return fallback;
}
