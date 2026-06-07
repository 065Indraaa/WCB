'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from '@/components/hero/CountdownTimer';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function ComingSoonModal({ isOpen, onClose, message }: ComingSoonModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
  const xUrl = process.env.NEXT_PUBLIC_TWITTER_URL ?? 'https://x.com/WorldCupBet2026';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="csm-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="csm-panel"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
            className="sm:items-center"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="csm-title"
          >
            <div
              className="card w-full"
              style={{
                maxWidth: 460,
                pointerEvents: 'auto',
                overflow: 'hidden',
                background: '#0D0D0D',
                border: '1px solid rgba(242,181,68,0.22)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid #2A2A2A',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'rgba(242,181,68,0.12)',
                        border: '1px solid rgba(242,181,68,0.28)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                      aria-hidden="true"
                    >
                      🔒
                    </span>
                    <p
                      className="section-eyebrow"
                      style={{ marginBottom: 0 }}
                    >
                      Coming Soon
                    </p>
                  </div>
                  <h2
                    id="csm-title"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Predictions Open June 11, 2026
                  </h2>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: '#B3B3B3',
                      marginTop: 4,
                    }}
                  >
                    {message ??
                      'Early holders get priority access. Lock $WCB now for early credits.'}
                  </p>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  style={{
                    padding: '0.375rem',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#B3B3B3',
                    flexShrink: 0,
                  }}
                  aria-label="Close"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Countdown */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <CountdownTimer compact />
              </div>

              {/* CTAs */}
              <div
                style={{
                  padding: '0 1.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <a
                  href={pumpfun}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  🚀 Buy $WCB on Pump.fun
                </a>
                <a
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  Follow @WCBLIVE on X
                </a>
              </div>

              {/* Footer badges */}
              <div
                style={{
                  padding: '0.75rem 1.5rem',
                  borderTop: '1px solid #2A2A2A',
                  background: '#0B0B0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#6E6E6E',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#9945FF',
                      boxShadow: '0 0 7px rgba(153,69,255,0.45)',
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  Built on Solana
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: '#6E6E6E',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#F2B544',
                      boxShadow: '0 0 7px rgba(242,181,68,0.45)',
                      display: 'inline-block',
                    }}
                    aria-hidden="true"
                  />
                  Launched on Pump.fun
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
