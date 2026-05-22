'use client';

import { useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SOLANA_RPC } from '@/lib/wallet';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // No specific adapters needed; wallet-adapter-react-ui handles wallet detection.
  // via the Wallet Standard (Phantom, Solflare, Backpack, etc. auto-register)
  const wallets = useMemo(() => [], []);

  // The wallet adapter calls `localStorage.getItem` inside a `useState`
  // initializer. On the server that returns nothing; on the client it may
  // return a previously stored wallet name, which causes a hydration mismatch
  // when autoConnect runs against a different initial value. Only enable
  // autoConnect after mount, so SSR and the first client render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectionProvider endpoint={SOLANA_RPC}>
      <WalletProvider wallets={wallets} autoConnect={mounted}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
