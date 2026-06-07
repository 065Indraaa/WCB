'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletRedirectHandler } from '@/components/shared/WalletRedirectHandler';
import { SOLANA_RPC } from '@/lib/wallet';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // No specific adapters needed; wallet-adapter-react-ui handles wallet detection.
  // via the Wallet Standard (Phantom, Solflare, Backpack, etc. auto-register)
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={SOLANA_RPC}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <WalletRedirectHandler />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
