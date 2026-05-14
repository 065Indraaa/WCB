'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';

const TRUST_ITEMS = [
  { icon: '🏟️', text: '3 Host Nations' },
  { icon: '⚽', text: '48 Teams' },
  { icon: '🌍', text: '104 Matches' },
  { icon: '◎', text: 'Built on Solana' },
  { icon: '🚀', text: 'Pump.fun Launch' },
  { icon: '📡', text: 'Live Match Data' },
];

export function HeroSection() {
  const rm = useReducedMotion();
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    v.addEventListener('canplay', () => setVideoReady(true));
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      aria-label="Hero"
    >
      {/* ── Background video ── */}
      <video
        ref={videoRef}
        src="/fifa.mp4"
        loop
        playsInline
        muted
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 1s ease',
          zIndex: 0,
        }}
      />

      {/* ── Dark + green gradient overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(to bottom,',
            '  rgba(10,20,10,0.72) 0%,',
            '  rgba(10,20,10,0.55) 40%,',
            '  rgba(10,20,10,0.75) 80%,',
            '  rgba(10,20,10,0.92) 100%)',
          ].join(''),
        }}
      />

      {/* ── Subtle pitch-line SVG ── */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, zIndex: 2, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="pitch" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="120" stroke="#22C55E" strokeWidth="0.8" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="#22C55E" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="28" fill="none" stroke="#22C55E" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pitch)" />
      </svg>

      {/* ── Mute / unmute button ── */}
      <AnimatePresence>
        {videoReady && (
          <motion.button
            key="mute-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMute}
            aria-label={muted ? 'Unmute FIFA anthem' : 'Mute FIFA anthem'}
            title={muted ? 'Unmute FIFA anthem' : 'Mute FIFA anthem'}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              zIndex: 40,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.25rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'background 0.2s',
            }}
          >
            {muted ? '🔇' : '🔊'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div
        className="relative w-full flex-1 flex flex-col items-center justify-center"
        style={{ zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem 3rem', width: '100%' }}
      >
        <div style={{ maxWidth: '58rem', margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow badges */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <PumpFunBadge />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.875rem', borderRadius: '9999px',
              fontSize: '0.85rem', fontWeight: 600,
              background: 'rgba(254,243,199,0.15)', color: '#FDE68A',
              border: '1px solid rgba(253,230,138,0.3)',
              backdropFilter: 'blur(8px)',
            }}>
              🌍 FIFA World Cup 2026
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.875rem', borderRadius: '9999px',
              fontSize: '0.85rem', fontWeight: 600,
              background: 'rgba(237,233,254,0.12)', color: '#C4B5FD',
              border: '1px solid rgba(196,181,253,0.25)',
              backdropFilter: 'blur(8px)',
            }}>
              ◎ Solana
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.4rem, 6.5vw, 5.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.03,
              letterSpacing: '-0.035em',
              marginBottom: '1.5rem',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            Predict every match.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #86EFAC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Hold $WCB.
            </span>
            {' '}
            <span style={{ color: '#FDE68A' }}>Win the cup.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '40rem',
              margin: '0 auto 2.25rem',
              lineHeight: 1.7,
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            The community prediction platform for the 2026 FIFA World Cup.
            Cast your picks, see what the world thinks, and ride the hype on Solana.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}
          >
            <a
              href={pumpfun}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14,
                background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
                color: '#ffffff', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(21,128,61,0.45)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,128,61,0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,128,61,0.45)'; }}
            >
              🚀 Buy $WCB on Pump.fun
            </a>

            <Link
              href="/matches"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14,
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff', fontWeight: 700, textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              ⚽ Explore Matches
            </Link>

            <Link
              href="/lock"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14,
                background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                color: '#ffffff', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(217,119,6,0.4)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              🔒 Lock & Earn Credits
            </Link>
          </motion.div>

          {/* Countdown card */}
          <motion.div
            initial={rm ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            style={{
              maxWidth: '34rem',
              margin: '0 auto 2.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '1.75rem 2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⏱</span>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#86EFAC' }}>
                World Cup Kickoff
              </p>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem', fontWeight: 600, textAlign: 'center' }}>
              June 11, 2026 · Estadio Azteca, Mexico City
            </p>
            <CountdownTimer />
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', maxWidth: '30rem', margin: '0 auto' }}
          >
            {[
              { value: '48',  label: 'Teams',   icon: '🌍' },
              { value: '12',  label: 'Groups',  icon: '📊' },
              { value: '104', label: 'Matches', icon: '⚽' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: '1rem 0.75rem',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{
                  fontSize: '1.75rem', fontWeight: 900, lineHeight: 1,
                  background: 'linear-gradient(135deg, #22C55E 0%, #86EFAC 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Trust bar at bottom ── */}
      <motion.div
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          padding: '0.875rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem 2rem' }}>
          {TRUST_ITEMS.map((item) => (
            <span key={item.text} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
              <span>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
