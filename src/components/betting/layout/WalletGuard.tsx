'use client';

import { ReactNode } from 'react';

/**
 * Previously redirected unconnected wallets to home.
 * Now allows visiting /live-bets without a wallet so users can
 * see the betting UI and connect in-place.
 */
export function WalletGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
