'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

const CONTRACT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'Coming soon';
const PUMPFUN  = process.env.NEXT_PUBLIC_PUMPFUN_URL  ?? 'https://pump.fun';
const TWITTER  = process.env.NEXT_PUBLIC_TWITTER_URL  ?? 'https://twitter.com/WCBLIVE';
const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_URL ?? 'https://t.me/wcblive';
const DISCORD  = process.env.NEXT_PUBLIC_DISCORD_URL  ?? 'https://discord.gg/wcblive';

const linkStyle: React.CSSProperties = {
  color: '#B3B3B3',
  textDecoration: 'none',
  fontSize: '0.82rem',
  fontWeight: 500,
  transition: 'color 0.15s',
  display: 'inline-block',
};

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (CONTRACT === 'Coming soon') return;
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const display =
    CONTRACT.length > 16 ? `${CONTRACT.slice(0, 6)}...${CONTRACT.slice(-6)}` : CONTRACT;

  return (
    <footer
      role="contentinfo"
      style={{
        background: '#070707',
        borderTop: '1px solid rgba(242,181,68,0.14)',
        marginTop: '4rem',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #C8922E 30%, #FFD36B 50%, #9945FF 70%, transparent 100%)' }} />

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '48px 20px 28px' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px 20px',
            marginBottom: '40px',
          }}
          className="md:grid-cols-4"
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="md:col-span-1">
            <BrandLogo size="lg" />
            <p style={{ fontSize: '0.82rem', marginTop: '14px', lineHeight: 1.7, color: '#B3B3B3', maxWidth: 280 }}>
              A Solana-native football prediction and betting platform for World Cup 2026. Betting opens on June 11, 2026.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {[
                { href: TWITTER,  label: 'Twitter/X', code: 'X' },
                { href: TELEGRAM, label: 'Telegram',  code: 'TG' },
                { href: DISCORD,  label: 'Discord',   code: 'DC' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#B3B3B3',
                    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(242,181,68,0.12)';
                    e.currentTarget.style.color = '#F2B544';
                    e.currentTarget.style.borderColor = 'rgba(242,181,68,0.28)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#B3B3B3';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                    {s.code}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', marginBottom: '14px' }}>
              Explore
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/matches',     label: 'Matches' },
                { href: '/groups',      label: 'Groups' },
                { href: '/bracket',     label: 'Bracket' },
                { href: '/lock',        label: 'Lock & Earn' },
                { href: '/leaderboard', label: 'Leaderboard' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Token */}
          <div>
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', marginBottom: '14px' }}>
              Token
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/token" style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                >
                  $WCB Token
                </Link>
              </li>
              <li>
                <a href={PUMPFUN} target="_blank" rel="noopener noreferrer" style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                >
                  Buy $WCB
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                >
                  Swap on Jupiter
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', marginBottom: '14px' }}>
              Community
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: TWITTER,  label: 'Twitter / X' },
                { href: TELEGRAM, label: 'Telegram' },
                { href: DISCORD,  label: 'Discord' },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div
          style={{
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.15)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '0.72rem', color: '#B3B3B3', margin: 0, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 800, color: '#EF4444' }}>⚠ DISCLAIMER:</span>{' '}
            $WCB is a community token on Solana. This is not financial advice. Betting features open on June 11, 2026. Crypto assets are highly volatile. Only risk what you can afford to lose.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
          className="sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Contract address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#374151' }}>Contract:</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <code style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#6B7280' }} title={CONTRACT}>
                {display}
              </code>
              <button
                onClick={handleCopy}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copied ? '#22C55E' : '#374151',
                  padding: '0 2px',
                  fontSize: '0.8rem',
                  lineHeight: 1,
                  transition: 'color 0.15s',
                }}
                aria-label={copied ? 'Copied' : 'Copy contract address'}
              >
                {copied ? '✓' : '⎘'}
              </button>
            </div>
            {copied && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#14F195' }}>Copied!</span>
            )}
          </div>

          <p style={{ fontSize: '0.68rem', color: '#374151', margin: 0 }}>
            © 2026 WORLDCUPBET - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
