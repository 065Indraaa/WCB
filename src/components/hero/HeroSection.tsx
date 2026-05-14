'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';

const FLOATS = [
  { emoji: '⚽', x: 6,  y: 14, size: 36, delay: 0,   dur: 7 },
  { emoji: '🏆', x: 87, y: 18, size: 32, delay: 1.2, dur: 8 },
  { emoji: '⚽', x: 82, y: 66, size: 26, delay: 0.6, dur: 9 },
  { emoji: '🥇', x: 9,  y: 70, size: 30, delay: 2,   dur: 7 },
  { emoji: '⚽', x: 48, y: 7,  size: 22, delay: 1.8, dur: 8 },
  { emoji: '🌍', x: 3,  y: 46, size: 24, delay: 2.5, dur: 7 },
  { emoji: '🎯', x: 92, y: 55, size: 20, delay: 0.9, dur: 9 },
  { emoji: '⚽', x: 55, y: 88, size: 18, delay: 3.1, dur: 8 },
];

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  // Auto-play FIFA anthem on mount (muted by default, user can unmute)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.18;
    audio.loop = true;
    const tryPlay = () => {
      audio.play().then(() => setAudioPlaying(true)).catch(() => {
        // Autoplay blocked — wait for user interaction
      });
    };
    audio.addEventListener('canplaythrough', () => {
      setAudioReady(true);
      tryPlay();
    });
    // Also try on first user interaction
    const onInteract = () => {
      if (!audioPlaying) tryPlay();
      document.removeEventListener('click', onInteract);
    };
    document.addEventListener('click', onInteract);
    return () => document.removeEventListener('click', onInteract);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioPlaying) {
      audio.play().then(() => setAudioPlaying(true)).catch(() => {});
      setAudioMuted(false);
    } else {
      audio.muted = !audio.muted;
      setAudioMuted(audio.muted);
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #FAFBF8 0%, #F0FDF4 50%, #DCFCE7 100%)',
      }}
      aria-label="Hero"
    >
      {/* FIFA Anthem audio */}
      <audio ref={audioRef} src="/fifa.mp4" preload="auto" aria-hidden="true" />

      {/* Ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vh', background: 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-10%', width: '50vw', height: '50vh', background: 'radial-gradient(ellipse, rgba(217,119,6,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Football pitch lines — decorative */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} aria-hidden="true">
        <defs>
          <pattern id="pitch-lines" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="120" stroke="#15803D" strokeWidth="1" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="#15803D" strokeWidth="1" />
            <circle cx="60" cy="60" r="30" fill="none" stroke="#15803D" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pitch-lines)" />
      </svg>

      {/* Floating emojis */}
      {!rm && FLOATS.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: f.size, opacity: 0.22 }}
          animate={{ y: [0, -20, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {f.emoji}
        </motion.div>
      ))}

      {/* Audio control — bottom right */}
      <AnimatePresence>
        {audioReady && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMute}
            style={{
              position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 30,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem',
              backdropFilter: 'blur(8px)',
            }}
            aria-label={audioMuted || !audioPlaying ? 'Play FIFA anthem' : 'Mute FIFA anthem'}
            title={audioMuted || !audioPlaying ? 'Play FIFA anthem' : 'Mute FIFA anthem'}
          >
            {audioMuted || !audioPlaying ? '🔇' : '🎵'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative w-full" style={{ zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '58rem', margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow badges */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <PumpFunBadge />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, background: '#FEF3C7', color: '#D97706', border: '1px solid rgba(217,119,6,0.25)' }}>
              🌍 FIFA World Cup 2026
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, background: '#EDE9FE', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}>
              ◎ Solana
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1.03, letterSpacing: '-0.035em', marginBottom: '1.5rem' }}
          >
            Predict every match.
            <br />
            <span className="text-pitch-gradient">Hold $WCB.</span>
            <br />
            <span style={{ color: '#D97706' }}>Win the cup.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: '#334155', maxWidth: '40rem', margin: '0 auto 2.25rem', lineHeight: 1.7 }}
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
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14 }}
            >
              🚀 Buy $WCB on Pump.fun
            </a>
            <Link
              href="/matches"
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14 }}
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
                boxShadow: '0 4px 14px -2px rgba(217,119,6,0.3)',
              }}
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
              maxWidth: '34rem', margin: '0 auto 2.5rem',
              background: '#ffffff',
              border: '1.5px solid #E2E8F0',
              borderRadius: 20,
              padding: '1.75rem 2rem',
              boxShadow: '0 8px 32px -8px rgba(21,128,61,0.12), 0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⏱</span>
              <p className="section-eyebrow">World Cup Kickoff</p>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem', fontWeight: 600, textAlign: 'center' }}>
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
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div className="text-pitch-gradient" style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <motion.div
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          width: '100%',
          borderTop: '1px solid rgba(226,232,240,0.8)',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          padding: '0.875rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem 2rem' }}>
          {TRUST_ITEMS.map((item) => (
            <span key={item.text} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              <span>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
