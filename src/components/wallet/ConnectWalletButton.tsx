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
          border: '1px solid #2A2A2A',
          background: '#171717',
          color: '#B3B3B3',
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
          border: '1px solid rgba(20,241,149,0.35)',
          background: '#111111',
          color: '#14F195',
          cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className={className}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', flexShrink: 0 }} />
          {shortAddress}
          <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>V</span>
        </button>

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#111111',
              border: '1px solid #2A2A2A',
              borderRadius: 12,
              boxShadow: '0 18px 48px rgba(0,0,0,0.42)',
              minWidth: 200,
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #2A2A2A', background: '#171717' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6E6E6E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Connected
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#14F195', fontFamily: 'monospace', marginTop: '0.25rem' }}>
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

  // Not connected: show wallet selector.
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
          background: '#F2B544',
          color: '#070707',
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(242,181,68,0.26)',
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
            background: '#111111',
            border: '1px solid #2A2A2A',
            borderRadius: 12,
            boxShadow: '0 18px 48px rgba(0,0,0,0.42)',
            minWidth: 220,
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #2A2A2A', background: '#171717' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Select a wallet
            </p>
          </div>
          {wallets.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#B3B3B3' }}>No wallets detected</p>
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#F2B544', fontWeight: 600 }}
              >
                Install Phantom
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
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderBottom: '1px solid #2A2A2A',
                }}
              >
                {wallet.adapter.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={24} height={24} style={{ borderRadius: 6 }} />
                )}
                {wallet.adapter.name}
                {wallet.readyState === 'Installed' && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, color: '#14F195', background: 'rgba(20,241,149,0.12)', padding: '1px 6px', borderRadius: 9999 }}>
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
