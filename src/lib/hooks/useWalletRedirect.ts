'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Redirects to /lock when wallet connects for the first time in a session.
 * Only redirects from the home page — not from other pages.
 */
export function useWalletRedirect() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  const prevConnected = useRef(false);

  useEffect(() => {
    // Only redirect when transitioning from disconnected → connected
    const justConnected = connected && !prevConnected.current;
    prevConnected.current = connected;

    if (justConnected && !hasRedirected.current && pathname === '/') {
      hasRedirected.current = true;
      // Small delay so wallet modal closes first
      setTimeout(() => {
        router.push('/lock?welcome=1');
      }, 600);
    }

    // Reset if disconnected
    if (!connected) {
      hasRedirected.current = false;
    }
  }, [connected, publicKey, pathname, router]);
}
