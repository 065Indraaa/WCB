'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletContextProvider } from './wallet-provider';

// Suppress the hydration warning that @solana/wallet-adapter-react causes.
// The wallet adapter calls localStorage.getItem() inside a useState() initializer,
// which runs on the server (returns null/default) but the client may have a
// previously-stored wallet name — causing a text/attribute mismatch.
// suppressHydrationWarning on the root body (in layout.tsx) handles the outer
// shell; this component ensures the QueryClient is stable across renders.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 0,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletContextProvider>{children}</WalletContextProvider>
    </QueryClientProvider>
  );
}
