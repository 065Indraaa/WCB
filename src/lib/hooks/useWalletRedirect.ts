'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Redirects to /live-bets when wallet connects for the first time in a session.
 * Only redirects from the home page or pages where a CTA prompts connection.
 */
export function useWalletRedirect() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  const prevConnected = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first render, initialise prevConnected without triggering a redirect
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevConnected.current = connected;
      return;
    }

    const justConnected = connected && !prevConnected.current;
    prevConnected.current = connected;

    const isBettingArea = pathname?.startsWith('/live-bets');
    if (justConnected && !hasRedirected.current && !isBettingArea) {
      hasRedirected.current = true;
      router.push('/live-bets');
    }

    if (!connected) {
      hasRedirected.current = false;
    }
  }, [connected, publicKey, pathname, router]);
}
