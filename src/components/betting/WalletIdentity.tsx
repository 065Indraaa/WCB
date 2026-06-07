'use client';

import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { truncateAddress } from '@/lib/wallet';
import { WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';
import { DeterministicAvatar } from './DeterministicAvatar';

/**
 * Header wallet identity: avatar + truncated address with a dropdown that
 * shows the full address, a copy button, and Disconnect. Falls back to the
 * connect button when no wallet is connected.
 */
export function WalletIdentity() {
  const { connected, publicKey, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const address = publicKey?.toBase58() ?? '';

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!connected || !publicKey) {
    return (
      <WalletButtonDynamic
        style={{
          background: '#F2B544',
          border: 'none',
          borderRadius: 9,
          fontSize: '0.8rem',
          fontWeight: 800,
          height: 36,
          padding: '0 14px',
          color: '#070707',
        }}
      />
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore.
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '4px 8px 4px 4px',
          borderRadius: 9,
          background: '#111111',
          border: '1px solid #2A2A2A',
          cursor: 'pointer',
          color: '#FFFFFF',
        }}
      >
        <DeterministicAvatar address={address} size={26} />
        <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
          {truncateAddress(address, 4)}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E6E6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              zIndex: 70,
              width: 260,
              padding: 12,
              borderRadius: 12,
              background: '#111111',
              border: '1px solid #2A2A2A',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: 6 }}>
              Connected wallet
            </p>
            <p style={{ fontSize: '0.72rem', color: '#FFFFFF', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 10, lineHeight: 1.5 }}>
              {address}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={copy}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: '1px solid #2A2A2A',
                  background: '#171717',
                  color: copied ? '#14F195' : '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  void disconnect();
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)',
                  color: '#EF4444',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
