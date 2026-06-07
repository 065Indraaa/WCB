'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { MenuIcon } from '@/components/shared/MenuIcons';
import { DeterministicAvatar } from '@/components/betting/DeterministicAvatar';
import { truncateAddress } from '@/lib/wallet';
import { useLiveBettingMenu } from '@/lib/hooks/useLiveBettingMenu';
import { LiveMenuTicker } from './LiveMenuTicker';
import { RecentActivityFeed } from './RecentActivityFeed';

const BETTING_LINKS = [
  { href: '/live-bets', label: 'Live Bets', icon: 'live' as const },
  { href: '/live-bets/schedule', label: 'Schedule', icon: 'matches' as const },
  { href: '/live-bets/my-bets', label: 'My Bets', icon: 'token' as const },
  { href: '/live-bets/leaderboard', label: 'Leaderboard', icon: 'leaderboard' as const },
];

const PLATFORM_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/matches', label: 'Matches' },
  { href: '/groups', label: 'Groups' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/token', label: 'Token' },
  { href: '/lock', label: 'Lock & Earn' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

function CountBadge({ value, color = '#F2B544', bg = 'rgba(242,181,68,0.12)' }: { value: number; color?: string; bg?: string }) {
  if (value <= 0) return null;
  return (
    <span
      style={{
        fontSize: '0.58rem',
        fontWeight: 900,
        color,
        background: bg,
        padding: '1px 6px',
        borderRadius: 5,
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
      }}
    >
      {value > 99 ? '99+' : value}
    </span>
  );
}

function LivePulse() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#EF4444',
        boxShadow: '0 0 6px rgba(239,68,68,0.6)',
        display: 'inline-block',
        animation: 'live-pulse 1.4s ease-in-out infinite',
        flexShrink: 0,
      }}
    />
  );
}

export function BettingSidebar() {
  const pathname = usePathname();
  const { publicKey, connected } = useWallet();
  const wallet = publicKey ? publicKey.toBase58() : null;

  const {
    counts,
    topLive,
    activeBetCount,
    settledCount,
    recentActivity,
    credits,
    creditsLoading,
  } = useLiveBettingMenu(wallet);

  if (!connected || !wallet) return null;

  return (
    <aside className="betting-sidebar">
      <div className="betting-sidebar-inner">
        {/* Wallet mini profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 10,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <DeterministicAvatar address={wallet} size={38} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF' }}>
              {truncateAddress(wallet, 4)}
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#F2B544',
              }}
            >
              {creditsLoading
                ? 'Loading…'
                : credits != null
                  ? `${credits.availableCredits.toLocaleString()} Credits`
                  : '—'}
            </p>
          </div>
        </div>

        {/* Live match ticker (when matches are live) */}
        {topLive.length > 0 && <LiveMenuTicker matches={topLive} />}

        {/* Betting Navigation */}
        <div>
          <p
            style={{
              fontSize: '0.58rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#6E6E6E',
              margin: '0 0 8px 4px',
            }}
          >
            Betting
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }} aria-label="Betting navigation">
            {BETTING_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              const isLiveBets = link.href === '/live-bets';
              const isMyBets = link.href === '/live-bets/my-bets';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={'betting-sidebar-link' + (active ? ' active' : '')}
                >
                  <span className="betting-sidebar-icon">
                    <MenuIcon name={link.icon} width={16} height={16} />
                  </span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {isLiveBets && counts.live > 0 && <CountBadge value={counts.live} color="#EF4444" bg="rgba(239,68,68,0.12)" />}
                  {isLiveBets && counts.live > 0 && <LivePulse />}
                  {isMyBets && activeBetCount > 0 && <CountBadge value={activeBetCount} color="#14F195" bg="rgba(20,241,149,0.12)" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Recent Activity */}
        <RecentActivityFeed activity={recentActivity} />

        {/* Platform Navigation */}
        <div>
          <p
            style={{
              fontSize: '0.58rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#6E6E6E',
              margin: '0 0 8px 4px',
            }}
          >
            Platform
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }} aria-label="Platform navigation">
            {PLATFORM_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? '#FFFFFF' : '#8A8A8A',
                    background: active ? 'rgba(242,181,68,0.08)' : 'transparent',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick stats footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '10px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 8px',
              marginBottom: 8,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {counts.live}
              </p>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6E6E6E', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Live
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {counts.upcoming}
              </p>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6E6E6E', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Upcoming
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#F2B544', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {activeBetCount}
              </p>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6E6E6E', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Bets
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#14F195', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {settledCount}
              </p>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6E6E6E', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Settled
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6E6E6E',
              margin: 0,
              textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              paddingTop: 6,
            }}
          >
            WCB Sportsbook · Zero fees
          </p>
        </div>
      </div>
    </aside>
  );
}
