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
  color: '#6B7280',
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
        background: '#080E08',
        borderTop: '1px solid rgba(34,197,94,0.1)',
        marginTop: '4rem',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #15803D 30%, #22C55E 50%, #15803D 70%, transparent 100%)' }} />

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
            <p style={{ fontSize: '0.82rem', marginTop: '14px', lineHeight: 1.7, color: '#6B7280', maxWidth: 280 }}>
              Platform prediksi komunitas untuk World Cup 2026. Native Solana, diluncurkan di Pump.fun. Betting dibuka 11 Juni 2026.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {[
                { href: TWITTER,  label: 'Twitter/X', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
                { href: TELEGRAM, label: 'Telegram', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                )},
                { href: DISCORD,  label: 'Discord', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                )},
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
                    color: '#6B7280',
                    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(34,197,94,0.12)';
                    e.currentTarget.style.color = '#22C55E';
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {s.icon}
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
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#22C55E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
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
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22C55E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                >
                  $WCB Token
                </Link>
              </li>
              <li>
                <a href={PUMPFUN} target="_blank" rel="noopener noreferrer" style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22C55E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                >
                  Buy on Pump.fun
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22C55E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
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
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#22C55E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
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
          <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 800, color: '#EF4444' }}>⚠ DISCLAIMER:</span>{' '}
            Ini adalah community memecoin di Solana. Bukan saran keuangan. Fitur betting dibuka 11 Juni 2026. Aset kripto sangat volatil. Hanya investasikan apa yang siap kamu tanggung risikonya.
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
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#22C55E' }}>Copied!</span>
            )}
          </div>

          <p style={{ fontSize: '0.68rem', color: '#374151', margin: 0 }}>
            © 2026 WORLDCUPBET — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
