'use client';

/**
 * Dynamic wrapper for WalletButton and WalletMultiButton.
 * Prevents hydration mismatch — wallet state only exists client-side.
 */

import dynamic from 'next/dynamic';

// WalletButton — used in Navbar and Lock page
export const WalletButtonDynamic = dynamic(
  () => import('./WalletButton').then((m) => m.WalletButton),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 36,
          width: 130,
          borderRadius: 10,
          background: '#E2E8F0',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
    ),
  },
);

// WalletMultiButton — used in Leaderboard and WalletDashboard
export const WalletMultiButtonDynamic = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then((m) => ({
      default: m.WalletMultiButton,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 36,
          width: 130,
          borderRadius: 10,
          background: '#E2E8F0',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
    ),
  },
);

// WalletDashboard — uses useWallet hook, must be client-only
export const WalletDashboardDynamic = dynamic(
  () => import('./WalletDashboard').then((m) => m.WalletDashboard),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderRadius: 16,
          border: '2px dashed #E2E8F0',
          background: '#FAFBF8',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔒</div>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Loading wallet…</p>
      </div>
    ),
  },
);
