'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';

interface ConnectWalletButtonProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function ConnectWalletButton({ size = 'md', className = '' }: ConnectWalletButtonProps) {
  const { connected, connecting, publicKey, disconnect, select, wallets } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowWalletList(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  const padding = size === 'sm' ? '0.4rem 0.875rem' : '0.5rem 1.25rem';
  const fontSize = size === 'sm' ? '0.8rem' : '0.875rem';

  if (connecting) {
    return (
      <button
        disabled
        style={{
          padding,
          fontSize,
          fontWeight: 700,
          borderRadius: 10,
          border: '1.5px solid #E2E8F0',
          background: '#F1F5F0',
          color: '#64748B',
          cursor: 'not-allowed',
        }}
        className={className}
      >
        Connecting...
      </button>
    );
  }

  if (connected && publicKey) {
    return (
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            padding,
            fontSize,
            fontWeight: 700,
            borderRadius: 10,
            border: '1.5px solid #DCFCE7',
            background: '#F0FDF4',
            color: '#15803D',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className={className}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
          {shortAddress}
          <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
        </button>

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              boxShadow: '0 8px 24px -4px rgba(15,23,42,0.12)',
              minWidth: 200,
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Connected
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                {shortAddress}
              </p>
            </div>
            <button
              onClick={() => { disconnect(); setShowDropdown(false); }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#DC2626',
                cursor: 'pointer',
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not connected — show wallet selector
  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setShowWalletList(!showWalletList)}
        style={{
          padding,
          fontSize,
          fontWeight: 700,
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
          color: '#ffffff',
          cursor: 'pointer',
          boxShadow: '0 4px 12px -2px rgba(21,128,61,0.25)',
        }}
        className={className}
      >
        Connect Wallet
      </button>

      {showWalletList && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            boxShadow: '0 8px 24px -4px rgba(15,23,42,0.12)',
            minWidth: 220,
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', margin: 0 }}>
              Select a wallet
            </p>
          </div>
          {wallets.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>No wallets detected</p>
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 600 }}
              >
                Install Phantom →
              </a>
            </div>
          ) : (
            wallets.map((wallet) => (
              <button
                key={wallet.adapter.name}
                onClick={() => {
                  select(wallet.adapter.name);
                  setShowWalletList(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderBottom: '1px solid #F1F5F0',
                }}
              >
                {wallet.adapter.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={24} height={24} style={{ borderRadius: 6 }} />
                )}
                {wallet.adapter.name}
                {wallet.readyState === 'Installed' && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '1px 6px', borderRadius: 9999 }}>
                    Installed
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
