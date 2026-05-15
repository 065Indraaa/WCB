'use client';

/**
 * Dynamic wrapper for WalletButton and WalletMultiButton.
 * Prevents hydration mismatch because wallet state only exists client-side.
 */

import dynamic from 'next/dynamic';

// WalletButton used in Navbar and Lock page.
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
          background: '#171717',
          border: '1px solid #2A2A2A',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
    ),
  },
);

// WalletMultiButton used in Leaderboard and WalletDashboard.
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
          background: '#171717',
          border: '1px solid #2A2A2A',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
    ),
  },
);

// WalletDashboard uses useWallet hook and must be client-only.
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
          border: '1px dashed #3A3A3A',
          background: '#111111',
        }}
      >
        <p style={{ color: '#B3B3B3', fontSize: '0.85rem' }}>Loading wallet...</p>
      </div>
    ),
  },
);
