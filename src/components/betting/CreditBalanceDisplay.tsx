'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrevious } from '@/lib/hooks/usePrevious';

interface CreditBalanceDisplayProps {
  /** Available credits (on-chain locked $WCB minus active bets). Null when disconnected. */
  available: number | null;
  loading?: boolean;
}

/**
 * Header credit balance: `Credits: X,XXX $WCB`.
 * Flashes green when the balance increases (refund/win) and red when it
 * decreases (bet placed). Reads from the on-chain-derived credit balance.
 */
export function CreditBalanceDisplay({ available, loading }: CreditBalanceDisplayProps) {
  const prev = usePrevious(available);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (available == null || prev == null || available === prev) return;
    setFlash(available > prev ? 'up' : 'down');
    const t = setTimeout(() => setFlash(null), 900);
    return () => clearTimeout(t);
  }, [available, prev]);

  const flashColor = flash === 'up' ? '#14F195' : flash === 'down' ? '#EF4444' : '#FFFFFF';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 9px',
        borderRadius: 8,
        background: '#111111',
        border: `1px solid ${flash === 'up' ? 'rgba(20,241,149,0.4)' : flash === 'down' ? 'rgba(239,68,68,0.4)' : '#2A2A2A'}`,
        transition: 'border-color 0.3s ease',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
      aria-live="polite"
      title="Credits read from your locked $WCB"
    >
      <span style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E' }}>
        Credits
      </span>
      {loading && available == null ? (
        <span style={{ width: 40, height: 10, borderRadius: 4, background: '#2A2A2A', display: 'inline-block' }} aria-hidden="true" />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={available ?? 'none'}
            initial={flash ? { y: flash === 'up' ? 8 : -8, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1, color: flashColor }}
            transition={{ duration: 0.35 }}
            style={{ fontSize: '0.8rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}
          >
            {available == null ? '—' : available.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      )}
      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#F2B544' }}>$WCB</span>
    </div>
  );
}
