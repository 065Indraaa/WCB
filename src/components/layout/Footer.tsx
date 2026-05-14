'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

const CONTRACT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'Coming soon';
const PUMPFUN  = process.env.NEXT_PUBLIC_PUMPFUN_URL  ?? 'https://pump.fun';
const TWITTER  = process.env.NEXT_PUBLIC_TWITTER_URL  ?? 'https://twitter.com/WCBLIVE';
const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_URL ?? 'https://t.me/wcblive';
const DISCORD  = process.env.NEXT_PUBLIC_DISCORD_URL  ?? 'https://discord.gg/wcblive';

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

  const linkStyle: React.CSSProperties = {
    color: '#334155',
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  return (
    <footer
      role="contentinfo"
      style={{ background: '#F1F5F0', borderTop: '1px solid #E2E8F0', marginTop: '6rem' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top: brand + nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-sm mt-3 leading-relaxed max-w-xs" style={{ color: '#64748B' }}>
              Community prediction platform for World Cup 2026. Solana-native, launched on Pump.fun. Betting opens June 11, 2026.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3
              className="font-bold uppercase tracking-widest mb-3"
              style={{ fontSize: '0.7rem', color: '#0F172A' }}
            >
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/matches" style={linkStyle}>Matches</Link></li>
              <li><Link href="/groups" style={linkStyle}>Groups</Link></li>
              <li><Link href="/bracket" style={linkStyle}>Bracket</Link></li>
              <li><Link href="/lock" style={linkStyle}>Lock &amp; Earn</Link></li>
              <li><Link href="/leaderboard" style={linkStyle}>Leaderboard</Link></li>
            </ul>
          </div>

          {/* Token */}
          <div>
            <h3
              className="font-bold uppercase tracking-widest mb-3"
              style={{ fontSize: '0.7rem', color: '#0F172A' }}
            >
              Token
            </h3>
            <ul className="space-y-2 text-sm">
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
            <h3
              className="font-bold uppercase tracking-widest mb-3"
              style={{ fontSize: '0.7rem', color: '#0F172A' }}
            >
              Community
            </h3>
            <ul className="space-y-2 text-sm">
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

        {/* Bottom: contract + disclaimer */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium" style={{ color: '#64748B' }}>Contract:</span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: '#ffffff', border: '1px solid #E2E8F0' }}
            >
              <code className="font-mono" style={{ color: '#0F172A' }} title={CONTRACT}>
                {display}
              </code>
              <button
                onClick={handleCopy}
                className="p-0.5 rounded transition-colors"
                style={{ color: '#64748B' }}
                aria-label={copied ? 'Copied' : 'Copy contract address'}
              >
                {copied ? '✓' : '⎘'}
              </button>
            </div>
            {copied && (
              <span className="font-semibold" style={{ color: '#15803D' }}>
                Copied!
              </span>
            )}
          </div>

          <p
            className="text-xs text-center sm:text-right max-w-md"
            style={{ color: '#94A3B8' }}
          >
            © 2026 WORLDCUPBET — This is a community memecoin on Solana. Not financial advice. Betting features open June 11, 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
