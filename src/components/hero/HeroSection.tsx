'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { CountdownTimer } from './CountdownTimer';
import { WcbText } from '@/components/shared/WcbText';

export function HeroSection() {
  const rm = useReducedMotion();
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{ display: 'flex', flexDirection: 'column' }}
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
          className="hero-background-image"
          style={{
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
        className="hero-content relative w-full flex-1 flex flex-col items-center justify-center"
        style={{ zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(1.5rem, 3vw, 3rem)', width: '100%' }}
      >
        <div className="hero-copy" style={{ maxWidth: '58rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow badges */}
          <motion.div
            className="hero-badges"
            initial={rm ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <span className="hero-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.35rem 0.85rem', borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 700,
              background: 'rgba(242,181,68,0.12)', color: '#FFD36B',
              border: '1px solid rgba(242,181,68,0.35)',
              backdropFilter: 'blur(8px)',
            }}>
              World Cup 2026
            </span>
            <span className="hero-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.35rem 0.85rem', borderRadius: '9999px',
              fontSize: '0.82rem', fontWeight: 700,
              background: 'rgba(153,69,255,0.12)', color: '#DCCBFF',
              border: '1px solid rgba(153,69,255,0.28)',
              backdropFilter: 'blur(8px)',
            }}>
              Solana Native
            </span>
            <span className="data-pill">
              Streamflow Locks
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero-title"
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
              <WcbText tone="hero">Hold $WCB.</WcbText>
            </span>
            {' '}
            <span style={{ color: '#FFD36B' }}>Own the board.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="hero-subcopy"
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
            <WcbText>Predict fixtures, track market sentiment, and unlock priority betting access with $WCB.</WcbText>
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-actions"
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
              <WcbText tone="inherit">Buy $WCB</WcbText>
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

          <motion.div
            className="hero-trust-bar"
            initial={rm ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.36 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap', margin: '-1.65rem 0 2.25rem' }}
          >
            {['On-chain holder board', 'Lock-credit ranking', 'Creator-fee prize pool'].map((item) => (
              <span key={item} className="data-pill">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={rm ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            <HeaderBanner />
          </motion.div>

          {/* Countdown card */}
          <motion.div
            className="hero-countdown"
            initial={rm ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            style={{
              maxWidth: '34rem',
              margin: '0 auto',
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
              June 11, 2026 | Estadio Azteca, Mexico City
            </p>
            <CountdownTimer compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
