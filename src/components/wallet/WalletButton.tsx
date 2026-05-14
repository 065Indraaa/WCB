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
 * with custom styling to match the $WCB light theme.
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
          background: '#DCFCE7',
          border: '1.5px solid #BBF7D0',
          color: '#15803D',
          borderRadius: 10,
          fontSize: '0.8rem',
          fontWeight: 700,
          height: 36,
          padding: '0 0.875rem',
          fontFamily: 'monospace',
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
        background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
        border: 'none',
        borderRadius: 10,
        fontSize: '0.85rem',
        fontWeight: 700,
        height: 36,
        padding: '0 1rem',
        boxShadow: '0 4px 14px -2px rgba(21,128,61,0.25)',
        ...style,
      }}
    >
      Connect Wallet
    </WalletMultiButton>
  );
}
