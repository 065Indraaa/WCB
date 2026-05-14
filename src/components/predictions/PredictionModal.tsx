'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { usePrediction } from '@/lib/hooks/usePrediction';
import type { PredictionChoice } from '@/lib/predictions';
import type { Match } from '@/types/match';

export interface PredictionModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

const VARIANT_COLORS = {
  home: { fill: '#DCFCE7', border: '#15803D', text: '#15803D', label: 'Home Win' },
  draw: { fill: '#FEF3C7', border: '#D97706', text: '#D97706', label: 'Draw' },
  away: { fill: '#EDE9FE', border: '#7C3AED', text: '#7C3AED', label: 'Away Win' },
};

export function PredictionModal({ match, isOpen, onClose }: PredictionModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const { pct, myChoice, total, vote, loaded } = usePrediction(
    match?.id ?? 0,
    match?.homeTeam.fifaRanking,
    match?.awayTeam.fifaRanking,
  );

  // ESC to close + body scroll lock
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

  if (!match) return null;

  // UTC date string — consistent server/client
  const kickoffUTC = (() => {
    const d = new Date(match.kickoff);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')} UTC`;
  })();

  const options: { choice: PredictionChoice; label: string; pct: number }[] = [
    { choice: 'home', label: match.homeTeam.name, pct: pct.home },
    { choice: 'draw', label: 'Draw',              pct: pct.draw },
    { choice: 'away', label: match.awayTeam.name, pct: pct.away },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}
            className="sm:items-center"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pred-title"
          >
            <div
              className="card w-full"
              style={{ maxWidth: 480, pointerEvents: 'auto', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <p className="section-eyebrow" style={{ marginBottom: '0.25rem' }}>
                    🎯 Community Prediction
                  </p>
                  <h2 id="pred-title" style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Who wins this match?
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
                    {match.group} · {kickoffUTC}
                  </p>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  style={{ padding: '0.375rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', flexShrink: 0 }}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Teams */}
              <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                  <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="lg" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {match.homeTeam.name}
                  </span>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#CBD5E1' }}>VS</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                  <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="lg" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Vote options */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: '0.25rem' }}>
                  {loaded ? `${total.toLocaleString()} community votes` : 'Cast your vote'}
                </p>

                {options.map(({ choice, label, pct: p }) => {
                  const c = VARIANT_COLORS[choice];
                  const isSelected = myChoice === choice;
                  return (
                    <button
                      key={choice}
                      onClick={() => vote(choice)}
                      aria-label={`Vote ${label} — ${p}%`}
                      aria-pressed={isSelected}
                      style={{
                        position: 'relative',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: 12,
                        border: `2px solid ${isSelected ? c.border : '#E2E8F0'}`,
                        background: '#ffffff',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, transform 0.1s',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                        boxShadow: isSelected ? `0 0 0 3px ${c.border}22` : 'none',
                      }}
                    >
                      {/* Fill bar — animates on vote */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: c.fill,
                          transformOrigin: 'left',
                        }}
                        initial={false}
                        animate={{ scaleX: p / 100 }}
                        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        aria-hidden="true"
                      />

                      {/* Content */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{ width: 10, height: 10, borderRadius: '50%', background: c.border, flexShrink: 0 }}
                              aria-hidden="true"
                            />
                          )}
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                            {label}
                          </span>
                        </div>
                        <motion.span
                          key={p}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ fontSize: '1.1rem', fontWeight: 900, color: c.text }}
                        >
                          {p}%
                        </motion.span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Voted confirmation */}
              <AnimatePresence>
                {myChoice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ margin: '0 1.5rem', padding: '0.75rem 1rem', borderRadius: 10, background: '#DCFCE7', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>✅</span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#15803D', margin: 0 }}>
                        Your pick: <strong>
                          {myChoice === 'home' ? match.homeTeam.name : myChoice === 'away' ? match.awayTeam.name : 'Draw'}
                        </strong>
                        {' '}— you can change it anytime
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer CTA */}
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', marginTop: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  🔒 <strong style={{ color: '#64748B' }}>Real betting opens June 11, 2026.</strong> Hold $WCB to unlock priority access and earn rewards on correct predictions.
                </p>
                <a
                  href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                  style={{ justifyContent: 'center' }}
                >
                  🚀 Get $WCB Early — Buy on Pump.fun
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
