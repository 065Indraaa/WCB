'use client';

import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/hero/CountdownTimer';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function NFTPreview() {
  const reducedMotion = useReducedMotion();
  const nftDropDate = new Date('2026-06-01T00:00:00Z');

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
        border: '1px solid rgba(153,69,255,0.25)',
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(153,69,255,0.12)',
              border: '1px solid rgba(153,69,255,0.28)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
            aria-hidden="true"
          >
            🏆
          </span>
          <div>
            <p
              className="font-bold uppercase tracking-widest"
              style={{ fontSize: '10px', color: '#9945FF' }}
            >
              NFT Drop
            </p>
            <h3
              className="text-sm font-black"
              style={{ color: '#FFFFFF' }}
            >
              World Cup Prediction Pass
            </h3>
          </div>
        </div>

        <p className="text-xs mb-4" style={{ color: '#B3B3B3', lineHeight: 1.6 }}>
          Hold $WCB for whitelist access. Limited edition pass unlocking exclusive predictions and rewards.
        </p>

        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: '#0B0B0B', border: '1px solid #2A2A2A' }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2"
            style={{ fontSize: '10px', color: '#6E6E6E' }}
          >
            Drop Countdown
          </p>
          <CountdownTimer targetDate={nftDropDate} compact />
        </div>

        <p className="text-xs text-center" style={{ color: '#6E6E6E' }}>
          Drops June 1, 2026
        </p>
      </div>
    </motion.div>
  );
}
