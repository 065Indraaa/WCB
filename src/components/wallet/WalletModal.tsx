'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_ICONS: Record<string, string> = {
  Phantom: '👻',
  Solflare: '🔆',
  Coinbase: '🔵',
  Torus: '🔴',
};

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallets, select, connecting } = useWallet();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSelect = (walletName: string) => {
    select(walletName as Parameters<typeof select>[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd"
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="modal"
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
          >
            <div
              className="card w-full"
              style={{ maxWidth: 380, pointerEvents: 'auto', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 id="wallet-modal-title" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Connect Wallet
                </h2>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  style={{ padding: '0.375rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ padding: '1rem' }}>
                {connecting ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Connecting…</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.adapter.name}
                        onClick={() => handleSelect(wallet.adapter.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '0.875rem 1rem',
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          background: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          textAlign: 'left',
                          width: '100%',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#15803D';
                          (e.currentTarget as HTMLElement).style.background = '#F0FDF4';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
                          (e.currentTarget as HTMLElement).style.background = '#ffffff';
                        }}
                      >
                        {wallet.adapter.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={32} height={32} style={{ borderRadius: 8 }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem', width: 32, textAlign: 'center' }}>
                            {WALLET_ICONS[wallet.adapter.name] ?? '💼'}
                          </span>
                        )}
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            {wallet.adapter.name}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: 0 }}>
                            {wallet.readyState === 'Installed' ? 'Detected' : 'Not installed'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
                  By connecting, you agree to our terms. Your wallet is never stored on our servers.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
