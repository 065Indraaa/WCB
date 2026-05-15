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

export function buildHeliusRpcUrl() {
  const apiKey = getHeliusApiKey();
  const configuredUrl = process.env.HELIUS_RPC_URL?.trim();

  if (configuredUrl?.includes('api-key=')) return configuredUrl;
  if (!apiKey) return configuredUrl || PUBLIC_SOLANA_RPC_URL;

  const baseUrl = configuredUrl || DEFAULT_HELIUS_RPC_URL;
  const separator = baseUrl.includes('?') ? '&' : baseUrl.endsWith('/') ? '?' : '/?';
  return `${baseUrl}${separator}api-key=${apiKey}`;
}
