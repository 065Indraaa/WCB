'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCombinedLeaderboard } from '@/lib/hooks/useCombinedLeaderboard';
import { usePrizePoolMetrics } from '@/lib/hooks/usePrizePoolMetrics';
import { TierBadge, BadgeList } from '@/components/leaderboard/TierBadge';
import { formatMarketCap } from '@/lib/utils/formatters';
import { WCB_SOLSCAN_TOKEN_URL, WCB_STREAMFLOW_LOCK_DASHBOARD_URL } from '@/lib/tokenConfig';

type Tab = 'holders' | 'lockers';

function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
          <div style={{ height: 16, borderRadius: 4, background: '#1A1A1A', width: i === 0 ? 24 : '80%' }} />
        </td>
      ))}
    </tr>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number | string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid',
        borderColor: active ? 'rgba(242,181,68,0.35)' : '#2A2A2A',
        background: active ? 'rgba(242,181,68,0.10)' : '#111111',
        color: active ? '#FFD36B' : '#6E6E6E',
        fontSize: '0.82rem',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {label}
      <span
        style={{
          fontSize: '0.62rem',
          fontWeight: 900,
          padding: '2px 6px',
          borderRadius: 4,
          background: active ? 'rgba(242,181,68,0.18)' : 'rgba(255,255,255,0.05)',
          color: active ? '#FFD36B' : '#6E6E6E',
        }}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyLockers() {
  return (
    <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(242,181,68,0.08)',
          border: '1px solid rgba(242,181,68,0.25)',
          marginBottom: '0.75rem',
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>🔒</span>
      </div>
      <p style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 800, marginBottom: 6 }}>
        No lockers yet
      </p>
      <p style={{ color: '#8A8A8A', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 1rem' }}>
        Lock $WCB via Streamflow for 30+ days to earn platform credits and appear on this leaderboard.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/lock" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}>
          Lock $WCB
        </Link>
        <a
          href={WCB_STREAMFLOW_LOCK_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
        >
          Streamflow Dashboard
        </a>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  // Render the entire data UI client-only via a mount gate. SSR (and the
  // first client render before useEffect runs) shows the same loading
  // placeholder, so no text node fed by client-only data can mismatch the
  // server output.
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('holders');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      {/* Header — static, safe to SSR */}
      <div className="premium-panel" style={{ padding: '1.45rem', borderRadius: 16, marginBottom: '1.5rem' }}>
        <p className="section-eyebrow mb-2" suppressHydrationWarning>Ranking Center</p>
        <h1
          className="text-4xl sm:text-5xl font-black mb-3"
          style={{ color: '#FFFFFF' }}
          suppressHydrationWarning
        >
          $WCB Leaderboard
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }} suppressHydrationWarning>
          Top 10 holders by balance and top 10 lockers by locked amount. Tier up from Bronze to Platinum and collect badges.
        </p>
      </div>

      {mounted ? (
        <LeaderboardBody tab={tab} setTab={setTab} />
      ) : (
        <LeaderboardSkeleton />
      )}

      {/* CTAs — static, safe to SSR */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/token" className="btn-primary">
          Token Status
        </Link>
        <Link href="/lock" className="btn-secondary">
          Lock $WCB
        </Link>
      </div>
    </section>
  );
}

function LeaderboardSkeleton() {
  return (
    <>
      <div className="stats-grid-3" style={{ marginBottom: '1.5rem' }}>
        {['Holders', 'Lockers', 'Prize Pool (24h)'].map((label) => (
          <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center', minHeight: 108 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F2B544' }}>…</div>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6E6E6E',
                marginTop: '0.25rem',
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8A8A8A', marginTop: 4 }}>syncing…</div>
          </div>
        ))}
      </div>
      <div
        className="card"
        style={{ overflow: 'hidden', marginBottom: '1.5rem', padding: '2rem', textAlign: 'center' }}
      >
        <p style={{ color: '#B3B3B3', fontSize: '0.85rem' }}>Loading leaderboard…</p>
      </div>
    </>
  );
}

function LeaderboardBody({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { holderEntries, lockerEntries, isLoading, holdersError, lockersError, totalHolders, totalLockers } =
    useCombinedLeaderboard(10);
  const { data: prizePool } = usePrizePoolMetrics();

  const stats = useMemo(
    () => [
      {
        label: 'Holders',
        value: isLoading ? '…' : totalHolders.toLocaleString('en-US'),
        sub: 'tracked wallets',
      },
      {
        label: 'Lockers',
        value: isLoading ? '…' : totalLockers.toLocaleString('en-US'),
        sub: 'active lockers',
      },
      {
        label: 'Prize Pool (24h)',
        value: !prizePool?.available ? '…' : formatMarketCap(prizePool.prizePoolCredit24hUsd),
        sub: !prizePool?.available ? 'syncing…' : 'creator fee',
      },
    ],
    [isLoading, totalHolders, totalLockers, prizePool],
  );

  return (
    <>
      {/* Stats */}
      <div className="stats-grid-3" style={{ marginBottom: '1.5rem' }}>
        {stats.map((panel) => (
          <div key={panel.label} className="card" style={{ padding: '1.25rem', textAlign: 'center', minHeight: 108 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F2B544' }}>{panel.value}</div>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6E6E6E',
                marginTop: '0.25rem',
              }}
            >
              {panel.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8A8A8A', marginTop: 4 }}>{panel.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        <TabButton
          active={tab === 'holders'}
          onClick={() => setTab('holders')}
          label="Top Holders"
          count={holderEntries.length}
        />
        <TabButton
          active={tab === 'lockers'}
          onClick={() => setTab('lockers')}
          label="Top Lockers"
          count={lockerEntries.length}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F0FDF4', margin: 0 }}>
            {tab === 'holders' ? 'Top 10 Holders' : 'Top 10 Lockers'}
          </h2>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#6E6E6E' }}>Real-time</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {tab === 'holders' ? (
            <HoldersTable
              entries={holderEntries}
              isLoading={isLoading}
              error={holdersError}
            />
          ) : (
            <LockersTable
              entries={lockerEntries}
              isLoading={isLoading}
              error={lockersError}
            />
          )}
        </div>
      </div>
    </>
  );
}

function HoldersTable({
  entries,
  isLoading,
  error,
}: {
  entries: ReturnType<typeof useCombinedLeaderboard>['holderEntries'];
  isLoading: boolean;
  error: unknown;
}) {
  if (error) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
          Holders data unavailable
        </p>
        <p style={{ color: '#B3B3B3', fontSize: '0.75rem' }}>{String(error)}</p>
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ background: '#0B0B0B' }}>
          {['Rank', 'Wallet', 'Holdings', 'Tier', 'Badges'].map((h) => (
            <th
              key={h}
              style={{
                padding: '10px 12px',
                textAlign: h === 'Rank' || h === 'Holdings' ? 'center' : 'left',
                fontSize: '0.62rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6E6E6E',
                borderBottom: '1px solid #1A1A1A',
                whiteSpace: 'nowrap',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading && entries.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}

        {entries.map((entry) => (
          <tr
            key={entry.address}
            style={{ transition: 'background 0.15s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0F0F0F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 900,
                color: '#FFFFFF',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {entry.rank <= 3 ? (
                <span style={{ fontSize: '1rem' }}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                entry.rank
              )}
            </td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <a
                  href={`${WCB_SOLSCAN_TOKEN_URL}?holder=${entry.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#B3B3B3',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F2B544';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#B3B3B3';
                  }}
                  title={entry.address}
                >
                  {entry.displayAddress}
                </a>
                {entry.isLocker && (
                  <span title="Also a locker" style={{ fontSize: '0.72rem', lineHeight: 1 }}>
                    🔒
                  </span>
                )}
              </div>
            </td>
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 900,
                color: '#FFFFFF',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.holdings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
              <TierBadge tier={entry.tier} />
            </td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
              <BadgeList badges={entry.badges} />
            </td>
          </tr>
        ))}

        {!isLoading && entries.length === 0 && (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6E6E6E', fontSize: '0.85rem' }}>
              No holders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function LockersTable({
  entries,
  isLoading,
  error,
}: {
  entries: ReturnType<typeof useCombinedLeaderboard>['lockerEntries'];
  isLoading: boolean;
  error: unknown;
}) {
  if (error) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
          Lockers data unavailable
        </p>
        <p style={{ color: '#B3B3B3', fontSize: '0.75rem' }}>{String(error)}</p>
      </div>
    );
  }

  if (!isLoading && entries.length === 0) {
    return <EmptyLockers />;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ background: '#0B0B0B' }}>
          {['Rank', 'Wallet', 'Locked', 'Credits', 'Locks', 'Tier'].map((h) => (
            <th
              key={h}
              style={{
                padding: '10px 12px',
                textAlign:
                  h === 'Rank' || h === 'Locked' || h === 'Credits' || h === 'Locks'
                    ? 'center'
                    : 'left',
                fontSize: '0.62rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6E6E6E',
                borderBottom: '1px solid #1A1A1A',
                whiteSpace: 'nowrap',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading && entries.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}

        {entries.map((entry) => (
          <tr
            key={entry.address}
            style={{ transition: 'background 0.15s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0F0F0F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 900,
                color: '#FFFFFF',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {entry.rank <= 3 ? (
                <span style={{ fontSize: '1rem' }}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                entry.rank
              )}
            </td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <a
                  href={`${WCB_SOLSCAN_TOKEN_URL}?holder=${entry.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#B3B3B3',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F2B544';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#B3B3B3';
                  }}
                  title={entry.address}
                >
                  {entry.displayAddress}
                </a>
                {entry.isHolder && (
                  <span title="Also a holder" style={{ fontSize: '0.72rem', lineHeight: 1 }}>
                    💎
                  </span>
                )}
              </div>
            </td>
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 900,
                color: '#FFD36B',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.locked.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </td>
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 900,
                color: '#14F195',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.credits.toLocaleString('en-US')}
            </td>
            <td
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #1A1A1A',
                textAlign: 'center',
                fontWeight: 700,
                color: '#B3B3B3',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {entry.activeLocks}
            </td>
            <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
              <TierBadge tier={entry.tier} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
