'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';

const FLOATS = [
  { emoji: '⚽', x: 7,  y: 15, size: 34, delay: 0,   dur: 7 },
  { emoji: '🏆', x: 88, y: 20, size: 30, delay: 1.2, dur: 8 },
  { emoji: '⚽', x: 80, y: 68, size: 24, delay: 0.6, dur: 9 },
  { emoji: '🥇', x: 10, y: 72, size: 28, delay: 2,   dur: 7 },
  { emoji: '⚽', x: 50, y: 8,  size: 20, delay: 1.8, dur: 8 },
  { emoji: '🌍', x: 4,  y: 48, size: 22, delay: 2.5, dur: 7 },
];

export function HeroSection() {
  const rm = useReducedMotion();
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #FAFBF8 0%, #DCFCE7 100%)',
      }}
      aria-label="Hero"
    >
      {/* Radial green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(34,197,94,0.18) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Field lines SVG */}
      <svg
        className="absolute right-0 top-0 h-full pointer-events-none"
        style={{ width: '50%', opacity: 0.06 }}
        viewBox="0 0 800 800"
        aria-hidden="true"
      >
        <circle cx="600" cy="400" r="280" fill="none" stroke="#15803D" strokeWidth="2" />
        <circle cx="600" cy="400" r="80"  fill="none" stroke="#15803D" strokeWidth="2" />
        <line x1="600" y1="120" x2="600" y2="680" stroke="#15803D" strokeWidth="2" />
      </svg>

      {/* Floating emojis */}
      {!rm && FLOATS.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: f.size, opacity: 0.28 }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {f.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div
        className="relative w-full"
        style={{ zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '5rem 1.5rem' }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>

          {/* Badges */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <PumpFunBadge />
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.875rem', borderRadius: '9999px',
                fontSize: '0.85rem', fontWeight: 600,
                background: '#FEF3C7', color: '#D97706',
                border: '1px solid rgba(217,119,6,0.25)',
              }}
            >
              🌍 World Cup 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Predict every match.
            <br />
            <span className="text-pitch-gradient">Hold $WCB.</span> Win the cup.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.1rem', color: '#334155',
              marginBottom: '2rem', maxWidth: '38rem', margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}
          >
            The community prediction platform for the 2026 FIFA World Cup.
            Cast your picks, see what the world thinks, and ride the hype on Solana.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}
          >
            <a href={pumpfun} target="_blank" rel="noopener noreferrer" className="btn-primary">
              🚀 Buy $WCB on Pump.fun
            </a>
            <Link href="/matches" className="btn-secondary">
              ⚽ Explore Matches
            </Link>
          </motion.div>

          {/* Countdown card */}
          <motion.div
            initial={rm ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card shadow-pop"
            style={{
              maxWidth: '32rem', margin: '0 auto',
              padding: '1.75rem 2rem',
            }}
          >
            <p className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
              ⏱ World Cup Kickoff
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem', fontWeight: 600 }}>
              June 11, 2026 · Estadio Azteca, Mexico City
            </p>
            <CountdownTimer />
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem', marginTop: '2rem', maxWidth: '28rem', margin: '2rem auto 0',
            }}
          >
            {[
              { value: '48',  label: 'Teams' },
              { value: '12',  label: 'Groups' },
              { value: '104', label: 'Matches' },
            ].map((s) => (
              <div
                key={s.label}
                className="card"
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <div
                  className="text-pitch-gradient"
                  style={{ fontSize: '1.75rem', fontWeight: 900 }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: '#64748B', marginTop: '0.25rem',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
