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
  color: '#8B949E',
  textDecoration: 'none',
  fontSize: '0.82rem',
  transition: 'color 0.1s',
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
        background: '#161B22',
        borderTop: '1px solid #21262D',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '40px 16px 24px' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px 16px',
            marginBottom: '32px',
          }}
          className="md:grid-cols-4"
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="md:col-span-1">
            <BrandLogo size="md" />
            <p style={{ fontSize: '0.8rem', marginTop: '10px', lineHeight: 1.6, color: '#8B949E', maxWidth: 260 }}>
              Community prediction platform for World Cup 2026. Solana-native, launched on Pump.fun. Betting opens June 11, 2026.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#E6EDF3', marginBottom: '12px' }}>
              Explore
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link href="/matches" style={linkStyle}>Matches</Link></li>
              <li><Link href="/groups" style={linkStyle}>Groups</Link></li>
              <li><Link href="/bracket" style={linkStyle}>Bracket</Link></li>
              <li><Link href="/lock" style={linkStyle}>Lock &amp; Earn</Link></li>
              <li><Link href="/leaderboard" style={linkStyle}>Leaderboard</Link></li>
            </ul>
          </div>

          {/* Token */}
          <div>
            <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#E6EDF3', marginBottom: '12px' }}>
              Token
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link href="/token" style={linkStyle}>$WCB Token</Link></li>
              <li>
                <a href={PUMPFUN} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  Buy on Pump.fun
                </a>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Swap on Jupiter
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#E6EDF3', marginBottom: '12px' }}>
              Community
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href={TWITTER} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  Twitter / X
                </a>
              </li>
              <li>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  Telegram
                </a>
              </li>
              <li>
                <a href={DISCORD} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div
          style={{
            background: 'rgba(218,54,51,0.08)',
            border: '1px solid rgba(218,54,51,0.2)',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '0.72rem', color: '#8B949E', margin: 0, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 800, color: '#DA3633' }}>⚠ DISCLAIMER:</span>{' '}
            This is a community memecoin on Solana. Not financial advice. Betting features open June 11, 2026. Crypto assets are highly volatile. Only invest what you can afford to lose.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #21262D',
          }}
          className="sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Contract address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#484F58' }}>Contract:</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 4,
                background: '#1C2128',
                border: '1px solid #30363D',
              }}
            >
              <code style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#8B949E' }} title={CONTRACT}>
                {display}
              </code>
              <button
                onClick={handleCopy}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#484F58',
                  padding: '0 2px',
                  fontSize: '0.8rem',
                  lineHeight: 1,
                }}
                aria-label={copied ? 'Copied' : 'Copy contract address'}
              >
                {copied ? '✓' : '⎘'}
              </button>
            </div>
            {copied && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#238636' }}>Copied!</span>
            )}
          </div>

          <p style={{ fontSize: '0.7rem', color: '#484F58', margin: 0 }}>
            © 2026 WORLDCUPBET — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
