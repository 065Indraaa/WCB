'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';

export function HeroSection() {
  const rm = useReducedMotion();
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

  return (
    <section
      className="hero-section relative overflow-hidden"
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

      {/* Main content */}
      <div
        className="hero-content relative w-full flex-1 flex flex-col items-center justify-center"
        style={{ zIndex: 10, maxWidth: '72rem', margin: '0 auto', width: '100%' }}
      >
        <div className="hero-copy" style={{ maxWidth: '58rem', margin: '0 auto', textAlign: 'center' }}>
          {/* Headline */}
          <motion.h1
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.03,
              letterSpacing: 0,
              marginBottom: '1.2rem',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            World Cup betting
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #F2B544 0%, #FFD36B 70%, #C8922E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              on Solana.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="hero-subcopy"
            style={{
              color: 'rgba(255,255,255,0.78)',
              maxWidth: '38rem',
              margin: '0 auto 1.75rem',
              lineHeight: 1.65,
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}
          >
            Predictions are open now. Betting markets and $WCB credits activate when the tournament begins on June 11, 2026.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="hero-actions"
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.65rem' }}
          >
            <Link
              href="/matches"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 12,
                background: '#F2B544',
                color: '#070707', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(242,181,68,0.28)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(242,181,68,0.38)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(242,181,68,0.28)'; }}
            >
              Review Markets
            </Link>

            <Link
              href="/lock"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 12,
                background: 'rgba(17,17,17,0.74)',
                color: '#ffffff', fontWeight: 700, textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(23,23,23,0.9)'; e.currentTarget.style.borderColor = 'rgba(242,181,68,0.42)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(17,17,17,0.74)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            >
              Lock $WCB
            </Link>

            <a
              href={pumpfun}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 12,
                background: 'rgba(153,69,255,0.12)',
                color: '#DCCBFF', fontWeight: 800, textDecoration: 'none',
                border: '1px solid rgba(153,69,255,0.3)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(153,69,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(20,241,149,0.34)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(153,69,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(153,69,255,0.3)'; }}
            >
              Buy $WCB
            </a>
          </motion.div>

          {/* Countdown card */}
          <motion.div
            initial={rm ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="hero-countdown"
            style={{
              maxWidth: '29rem',
              margin: '0 auto',
              background: 'rgba(17,17,17,0.72)',
              border: '1px solid rgba(242,181,68,0.22)',
              borderRadius: 14,
              padding: '1rem 1.1rem',
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
