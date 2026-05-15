'use client';

import { useWalletRedirect } from '@/lib/hooks/useWalletRedirect';

/** Mounts the wallet redirect logic and renders nothing. */
export function WalletRedirectHandler() {
  useWalletRedirect();
  return null;
}
