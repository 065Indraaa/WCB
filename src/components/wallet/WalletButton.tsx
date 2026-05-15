'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { truncateAddress } from '@/lib/wallet';

interface WalletButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WalletButton — wraps WalletMultiButton from @solana/wallet-adapter-react-ui
 * with custom styling to match the $WCB premium theme.
 *
 * When connected, shows truncated address + disconnect option.
 * When disconnected, opens the standard wallet selection modal.
 */
export function WalletButton({ className, style }: WalletButtonProps) {
  const { connected, publicKey } = useWallet();

  if (connected && publicKey) {
    return (
      <WalletMultiButton
        className={className}
        style={{
          background: '#111111',
          border: '1px solid rgba(20,241,149,0.35)',
          color: '#14F195',
          borderRadius: 10,
          fontSize: '0.8rem',
          fontWeight: 700,
          height: 36,
          padding: '0 0.875rem',
          fontFamily: 'monospace',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
          ...style,
        }}
      >
        {truncateAddress(publicKey.toBase58())}
      </WalletMultiButton>
    );
  }

  return (
    <WalletMultiButton
      className={className}
      style={{
        background: '#F2B544',
        border: 'none',
        borderRadius: 10,
        fontSize: '0.85rem',
        fontWeight: 800,
        height: 36,
        padding: '0 1rem',
        color: '#070707',
        boxShadow: '0 6px 18px rgba(242,181,68,0.26)',
        ...style,
      }}
    >
      Connect Wallet
    </WalletMultiButton>
  );
}
