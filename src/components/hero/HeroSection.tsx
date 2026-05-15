'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';

const TRUST_ITEMS = [
  { icon: '01', text: '3 Host Nations' },
  { icon: '02', text: '48 Teams' },
  { icon: '03', text: '104 Matches' },
  { icon: 'SOL', text: 'Built on Solana' },
  { icon: 'LIVE', text: 'Live Match Data' },
  { icon: 'WCB', text: 'Token Access' },
];

export function HeroSection() {
  const rm = useReducedMotion();
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      aria-label="Hero"
    >
      {/* Header image background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/header.jpg"
          alt=""
          fill
          priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'saturate(0.92) contrast(1.05) brightness(0.72)',
          }}
        />
      </div>

      {/* Premium dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(to bottom,',
            '  rgba(7,7,7,0.62) 0%,',
            '  rgba(7,7,7,0.78) 58%,',
            '  rgba(7,7,7,0.98) 100%)',
            ', radial-gradient(circle at 50% 24%, rgba(242,181,68,0.18), transparent 42%)',
          ].join(''),
        }}
      />

      {/* Subtle pitch-line SVG */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.045, zIndex: 2, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="pitch" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="120" stroke="#F2B544" strokeWidth="0.8" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="#F2B544" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="28" fill="none" stroke="#F2B544" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pitch)" />
      </svg>

      {/* Main content */}
      <div
        className="relative w-full flex-1 flex flex-col items-center justify-center"
        style={{ zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(1.5rem, 3vw, 3rem)', width: '100%' }}
      >
        <div style={{ maxWidth: '58rem', margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow badges */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.35rem 0.85rem', borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 700,
              background: 'rgba(242,181,68,0.12)', color: '#FFD36B',
              border: '1px solid rgba(242,181,68,0.35)',
              backdropFilter: 'blur(8px)',
            }}>
              World Cup 2026
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.35rem 0.85rem', borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 700,
              background: 'rgba(153,69,255,0.12)', color: '#DCCBFF',
              border: '1px solid rgba(153,69,255,0.28)',
              backdropFilter: 'blur(8px)',
            }}>
              Solana Native
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
              letterSpacing: 0,
              marginBottom: '1.5rem',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            Predict every match.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #F2B544 0%, #FFD36B 70%, #C8922E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Hold $WCB.
            </span>
            {' '}
            <span style={{ color: '#FFD36B' }}>Win the cup.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.78)',
              maxWidth: '40rem',
              margin: '0 auto 2.25rem',
              lineHeight: 1.75,
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}
          >
            A clean Solana football betting platform for World Cup 2026.
            Predict fixtures, track market sentiment, and unlock priority betting access with $WCB.
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
                background: '#F2B544',
                color: '#070707', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(242,181,68,0.28)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(242,181,68,0.38)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(242,181,68,0.28)'; }}
            >
              Buy $WCB
            </a>

            <Link
              href="/matches"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14,
                background: 'rgba(17,17,17,0.74)',
                color: '#ffffff', fontWeight: 700, textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(23,23,23,0.9)'; e.currentTarget.style.borderColor = 'rgba(242,181,68,0.42)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(17,17,17,0.74)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            >
              View Matches
            </Link>

            <Link
              href="/lock"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 14,
                background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                color: '#070707', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 10px 26px rgba(153,69,255,0.18)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Lock & Earn Credits
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
              background: 'rgba(17,17,17,0.72)',
              border: '1px solid rgba(242,181,68,0.22)',
              borderRadius: 16,
              padding: 'clamp(1rem, 3vw, 1.75rem) clamp(1rem, 3vw, 2rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#FFD36B', margin: 0 }}>
                World Cup Kickoff
              </p>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', fontWeight: 600, textAlign: 'center' }}>
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
              { value: '48',  label: 'Teams' },
              { value: '12',  label: 'Groups' },
              { value: '104', label: 'Matches' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: 'clamp(0.625rem, 2vw, 1rem) clamp(0.375rem, 1.5vw, 0.75rem)',
                  textAlign: 'center',
                  background: 'rgba(17,17,17,0.72)',
                  border: '1px solid rgba(242,181,68,0.16)',
                  borderRadius: 12,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 900, lineHeight: 1,
                  background: 'linear-gradient(135deg, #F2B544 0%, #FFD36B 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>
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
          borderTop: '1px solid rgba(242,181,68,0.14)',
          background: 'rgba(7,7,7,0.72)',
          backdropFilter: 'blur(16px)',
          padding: '0.875rem 1.5rem',
        }}
      >
        <div className="hero-trust-bar" style={{ maxWidth: '72rem', margin: '0 auto' }}>
          {TRUST_ITEMS.map((item) => (
            <span key={item.text} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#FFD36B', fontWeight: 800 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
