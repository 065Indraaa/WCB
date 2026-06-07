'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bet } from '@/types/betting';

interface NotificationsBellProps {
  bets: Bet[];
}

/** Outcome label + credit delta for a settled bet. */
function settlementInfo(bet: Bet): { label: string; color: string; delta: string } {
  const stake = bet.amount;
  const odds = parseFloat(bet.odds) || 1;
  if (bet.status === 'won') {
    const win = Math.round(stake * odds);
    return { label: 'Won', color: '#14F195', delta: `+${win.toLocaleString()} $WCB` };
  }
  if (bet.status === 'lost') {
    const net = Math.round(stake * 0.8); // 80% net loss after 20% refund
    return { label: 'Lost — 20% Refunded', color: '#F2B544', delta: `-${net.toLocaleString()} $WCB` };
  }
  return { label: 'Refunded', color: '#B3B3B3', delta: `+${stake.toLocaleString()} $WCB` };
}

/**
 * Notifications bell: badge counts settled bet resolutions since last viewed.
 * Settlement is not yet wired on the backend, so this is typically empty —
 * it surfaces any non-pending bets in the store.
 */
export function NotificationsBell({ bets }: NotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const settled = useMemo(
    () =>
      bets
        .filter((b) => b.status === 'won' || b.status === 'lost' || b.status === 'cancelled')
        .sort((a, b) => new Date(b.settledAt ?? b.createdAt).getTime() - new Date(a.settledAt ?? a.createdAt).getTime()),
    [bets],
  );

  const unread = Math.max(0, settled.length - seen);

  useEffect(() => {
    if (!open) return;
    setSeen(settled.length);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, settled.length]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label={`Notifications${unread ? `, ${unread} new` : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 9,
          background: '#111111',
          border: '1px solid #2A2A2A',
          cursor: 'pointer',
          color: '#B3B3B3',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 8,
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: '0.6rem',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unread}
          </span>
        )}
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
              width: 300,
              maxHeight: 360,
              overflowY: 'auto',
              borderRadius: 12,
              background: '#111111',
              border: '1px solid #2A2A2A',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', padding: '12px 14px 8px' }}>
              Recent settlements
            </p>
            {settled.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#B3B3B3', padding: '0 14px 16px', lineHeight: 1.5 }}>
                No settlements yet. You&apos;ll be notified here when your bets resolve.
              </p>
            ) : (
              settled.map((bet) => {
                const info = settlementInfo(bet);
                return (
                  <div
                    key={bet.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '10px 14px',
                      borderTop: '1px solid #1C1C1C',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, color: info.color, margin: 0 }}>{info.label}</p>
                      <p style={{ fontSize: '0.68rem', color: '#6E6E6E', margin: 0 }}>Match #{bet.matchId} · {bet.choice}</p>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: info.color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {info.delta}
                    </span>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
