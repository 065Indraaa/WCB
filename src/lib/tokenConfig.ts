export const WCB_MINT = '';
export const DEFAULT_WCB_MINT = WCB_MINT;
export const WCB_TOKEN_DECIMALS = 6;
export const WCB_STREAMFLOW_LOCK_DASHBOARD_URL =
  `https://app.streamflow.finance/token-dashboard/solana/mainnet/${WCB_MINT}?type=lock`;
export const WCB_SOLSCAN_TOKEN_URL = `https://solscan.io/token/${WCB_MINT}`;

export function resolveWcbMint() {
  return WCB_MINT;
}

export function resolveTokenDecimals() {
  return WCB_TOKEN_DECIMALS;
}
