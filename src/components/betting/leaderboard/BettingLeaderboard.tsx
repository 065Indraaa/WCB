'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DeterministicAvatar } from '@/components/betting/DeterministicAvatar';
import { truncateAddress } from '@/lib/wallet';
import { useBettingLeaderboard } from '@/lib/hooks/useBettingLeaderboard';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

interface BettingLeaderboardProps {
  compact?: boolean;
}

export function BettingLeaderboard({ compact = false }: BettingLeaderboardProps) {
  const { data, isLoading, error } = useBettingLeaderboard();
  const reduced = useReducedMotion();
  const entries = data?.leaderboard ?? [];

  const stats = useMemo(() => {
    const totalBets = entries.reduce((s, e) => s + e.totalBets, 0);
    const totalVolume = entries.reduce((s, e) => s + e.totalWagered, 0);
    const topBettor = entries[0] ?? null;
    return { totalBets, totalVolume, topBettor };
  }, [entries]);

  return (
    <div>
      {/* Header */}
      {!compact && (
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px' }}>
            Betting Leaderboard
          </h1>
          <p style={{ color: '#B3B3B3', fontSize: '0.85rem', margin: 0 }}>
            Top bettors ranked by profit and win rate.
          </p>
        </div>
      )}

      {/* Stats cards */}
      <div className="stats-grid-3" style={{ marginBottom: compact ? 12 : 20 }}>
        <StatCard label="Total Bets" value={formatNumber(stats.totalBets)} sub="all time" />
        <StatCard label="Total Volume" value={`${formatNumber(stats.totalVolume)} $WCB`} sub="wagered" />
        <StatCard
          label="Top Bettor"
          value={stats.topBettor ? truncateAddress(stats.topBettor.wallet, 3) : '—'}
          sub={stats.topBettor ? `${stats.topBettor.totalProfit.toLocaleString()} $WCB profit` : 'no data'}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
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
            All Time Rankings
          </h2>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#6E6E6E' }}>Real-time</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {isLoading && entries.length === 0 && <LeaderboardSkeleton />}
          {error && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#EF4444', fontWeight: 700 }}>Leaderboard unavailable</p>
              <p style={{ color: '#6E6E6E', fontSize: '0.75rem' }}>{String(error)}</p>
            </div>
          )}
          {!isLoading && entries.length === 0 && (
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <p style={{ color: '#B3B3B3', fontSize: '0.9rem' }}>No bets placed yet. Be the first!</p>
            </div>
          )}
          {entries.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#0B0B0B' }}>
                  {['Rank', 'Bettor', 'Bets', 'Win Rate', 'Profit', 'Biggest Win'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 12px',
                        textAlign: h === 'Rank' || h === 'Bets' || h === 'Win Rate' ? 'center' : 'left',
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
                {entries.map((entry, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  return (
                    <motion.tr
                      key={entry.wallet}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      style={{ transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0F0F0F'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
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
                        {isTop3 ? (
                          <span style={{ fontSize: '1.1rem' }}>
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          rank
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #1A1A1A' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <DeterministicAvatar address={entry.wallet} size={26} />
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              color: '#B3B3B3',
                            }}
                            title={entry.wallet}
                          >
                            {truncateAddress(entry.wallet, 4)}
                          </span>
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
                        }}
                      >
                        {entry.totalBets}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid #1A1A1A',
                          textAlign: 'center',
                          fontWeight: 900,
                          color: entry.winRate >= 60 ? '#14F195' : entry.winRate >= 40 ? '#F2B544' : '#B3B3B3',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {entry.winRate}%
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid #1A1A1A',
                          textAlign: 'left',
                          fontWeight: 900,
                          color: entry.totalProfit >= 0 ? '#14F195' : '#EF4444',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.totalProfit >= 0 ? '+' : ''}{entry.totalProfit.toLocaleString()} $WCB
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid #1A1A1A',
                          textAlign: 'left',
                          fontWeight: 900,
                          color: '#F2B544',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.biggestWin.toLocaleString()} $WCB
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card" style={{ padding: '1.1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F2B544' }}>{value}</div>
      <div
        style={{
          fontSize: '0.62rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#6E6E6E',
          marginTop: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#8A8A8A', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div style={{ padding: '1.5rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1A1A1A' }}>
          <div style={{ width: 28, height: 16, borderRadius: 4, background: '#1A1A1A' }} />
          <div style={{ width: 120, height: 16, borderRadius: 4, background: '#1A1A1A' }} />
          <div style={{ marginLeft: 'auto', width: 80, height: 16, borderRadius: 4, background: '#1A1A1A' }} />
        </div>
      ))}
    </div>
  );
}
