'use client';

import { useWalletRedirect } from '@/lib/hooks/useWalletRedirect';

/** Mounts the wallet redirect logic — renders nothing */
export function WalletRedirectHandler() {
  useWalletRedirect();
  return null;
}
