'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCredits, formatTokenAmount } from '@/lib/lock';

interface LockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  days: number;
  credits: number;
}

export function LockConfirmModal({ isOpen, onClose, amount, days, credits }: LockConfirmModalProps) {
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

  const unlockDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd"
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
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
            aria-labelledby="lock-confirm-title"
          >
            <div
              className="card w-full"
              style={{ maxWidth: 440, pointerEvents: 'auto', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 id="lock-confirm-title" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Confirm Lock
                </h2>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  style={{ padding: '0.375rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#B3B3B3' }}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Summary */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ borderRadius: 12, background: '#111111', border: '1px solid #2A2A2A', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Locking', value: formatTokenAmount(amount) + ' $WCB', big: true },
                      { label: 'Duration', value: days + ' days', big: false },
                      { label: 'Unlock Date', value: unlockDate, big: false },
                      { label: 'Credits Earned', value: formatCredits(credits), big: true, green: true },
                    ].map((item) => (
                      <div key={item.label}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.25rem' }}>
                          {item.label}
                        </p>
                        <p style={{
                          fontSize: item.big ? '1.25rem' : '0.95rem',
                          fontWeight: 900,
                          color: item.green ? '#FFD36B' : '#FFFFFF',
                        }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div style={{ borderRadius: 10, background: 'rgba(242,181,68,0.08)', border: '1px solid rgba(242,181,68,0.26)', padding: '0.875rem', marginBottom: '1.25rem', display: 'flex', gap: '0.625rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#B3B3B3', margin: 0, lineHeight: 1.5 }}>
                    <strong>No early withdrawal.</strong> Your tokens will be locked until {unlockDate}. This action cannot be undone.
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 10,
                      border: '1px solid #2A2A2A',
                      background: '#171717',
                      color: '#B3B3B3',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <a
                    href="https://app.streamflow.finance"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 2,
                      padding: '0.75rem',
                      borderRadius: 10,
                      border: 'none',
                      background: '#F2B544',
                      color: '#070707',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 8px 22px rgba(242,181,68,0.24)',
                    }}
                  >
                    Lock via Streamflow
                  </a>
                </div>

                <p style={{ fontSize: '0.7rem', color: '#6E6E6E', textAlign: 'center', marginTop: '0.875rem' }}>
                  You will be redirected to Streamflow Finance to complete the lock on-chain
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
