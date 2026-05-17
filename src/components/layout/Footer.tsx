'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const X_URL   = process.env.NEXT_PUBLIC_TWITTER_URL ?? 'https://x.com/WorldCupBet2026';

const linkStyle: React.CSSProperties = {
  color: '#B3B3B3',
  textDecoration: 'none',
  fontSize: '0.82rem',
  fontWeight: 500,
  transition: 'color 0.15s',
  display: 'inline-block',
};

/* Official X (Twitter) logo SVG */
function XLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
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
            {/* X social icon */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow WorldCupBets on X"
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
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#B3B3B3';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <XLogo size={14} />
              </a>
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
                { href: '/docs',        label: 'Docs' },
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
              <li>
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F2B544'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                >
                  Follow on X
                </a>
              </li>
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
            <span style={{ fontWeight: 800, color: '#EF4444' }}>DISCLAIMER:</span>{' '}
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
          <p style={{ fontSize: '0.68rem', color: '#374151', margin: 0 }}>
            © 2026 WORLDCUPBETS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
