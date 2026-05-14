'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletLocks } from '@/lib/hooks/useWalletLocks';
import { useCommunityLocks } from '@/lib/hooks/useCommunityLocks';
import { formatWallet } from '@/lib/utils/formatters';
import { formatCredits, formatTokenAmount } from '@/lib/lock';
import { WalletButtonDynamic, WalletMultiButtonDynamic } from '@/components/wallet/WalletButtonDynamic';

const TIERS = [
  { tier: 'Bronze',   color: '#CD7F32', tint: '#FCE7C8', min: '1' },
  { tier: 'Silver',   color: '#94A3B8', tint: '#E2E8F0', min: '100K' },
  { tier: 'Gold',     color: '#D97706', tint: '#FEF3C7', min: '1M' },
  { tier: 'Platinum', color: '#7C3AED', tint: '#EDE9FE', min: '10M' },
];

function MyPositionBanner() {
  const { connected } = useWallet();
  const { stats, loading } = useWalletLocks();

  if (!connected) {
    return (
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1.5px solid #BBF7D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D', marginBottom: '0.25rem' }}>
            🔒 Connect wallet to see your position
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Lock $WCB to earn credits and climb the leaderboard
          </p>
        </div>
        <WalletMultiButtonDynamic
          style={{
            background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
            border: 'none',
            borderRadius: 10,
            fontSize: '0.85rem',
            fontWeight: 700,
            height: 36,
            padding: '0 1.25rem',
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ height: 80, borderRadius: 14, background: '#F1F5F0', marginBottom: '1.5rem' }} />
    );
  }

  return (
    <div
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #BBF7D0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {[
        { label: 'My Locked', value: formatTokenAmount(stats.totalLocked) + ' $WCB' },
        { label: 'My Credits', value: formatCredits(stats.totalCredits) },
        { label: 'Active Locks', value: stats.activeLocks.toString() },
        { label: 'Longest Lock', value: stats.longestDays > 0 ? stats.longestDays + 'd' : '—' },
      ].map((s) => (
        <div key={s.label} style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: '0.25rem' }}>
            {s.label}
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803D' }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const { leaderboard, totals, loading, error, refetch } = useCommunityLocks();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="section-eyebrow mb-2">🏆 Lock Leaderboard</p>
          <h1
            className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
            style={{ color: '#0F172A' }}
          >
            Top $WCB Lockers
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#64748B' }}>
            Ranked by total $WCB locked via Streamflow. Click any row to view the lock on Streamflow.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={refetch}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: 8,
              border: '1.5px solid #E2E8F0',
              background: '#ffffff',
              color: '#64748B',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
          <WalletButtonDynamic />
        </div>
      </div>

      {/* Community stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Locked', value: formatTokenAmount(totals.totalLocked) + ' $WCB', icon: '🔒' },
          { label: 'Credits Issued', value: formatCredits(totals.totalCredits), icon: '💳' },
          { label: 'Total Lockers', value: totals.totalLockers.toString(), icon: '👥' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginTop: '0.25rem' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* My position */}
      <MyPositionBanner />

      {/* Tier legend */}
      <div className="card p-5 mb-6">
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: '0.75rem' }}>
          Tier Thresholds
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: t.tint, border: '1px solid #E2E8F0' }}
            >
              <div style={{ width: 10, height: 36, borderRadius: 9999, background: t.color, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: t.color }}>{t.tier}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>≥ {t.min} $WCB</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard table */}
      {loading ? (
        <div className="card overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 animate-pulse"
              style={{ borderBottom: '1px solid #E2E8F0' }}
            >
              <div style={{ width: 32, height: 20, background: '#F1F5F0', borderRadius: 4 }} />
              <div style={{ width: 140, height: 16, background: '#F1F5F0', borderRadius: 4 }} />
              <div style={{ flex: 1, height: 16, background: '#F1F5F0', borderRadius: 4 }} />
              <div style={{ width: 80, height: 16, background: '#F1F5F0', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', borderRadius: 14, border: '1.5px solid #FECACA', background: '#FEF2F2' }}>
          <p style={{ color: '#DC2626', fontWeight: 600, marginBottom: '0.75rem' }}>{error}</p>
          <button onClick={refetch} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            Try again
          </button>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card p-16 text-center">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            No locks found yet
          </p>
          <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Be the first to lock $WCB and claim the #1 spot.
          </p>
          <a href="/lock" className="btn-primary" style={{ display: 'inline-flex' }}>
            🔒 Lock $WCB Now
          </a>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full" aria-label="Lock Leaderboard">
            <thead>
              <tr style={{ background: '#F1F5F0', borderBottom: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>
                <th className="py-3 px-4 text-left w-16" scope="col">Rank</th>
                <th className="py-3 px-4 text-left" scope="col">Wallet</th>
                <th className="py-3 px-4 text-right" scope="col">Total Locked</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell" scope="col">Credits</th>
                <th className="py-3 px-4 text-center hidden md:table-cell" scope="col">Locks</th>
                <th className="py-3 px-4 text-center hidden md:table-cell" scope="col">Tier</th>
                <th className="py-3 px-4 text-center" scope="col">View</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((e) => (
                <tr
                  key={e.wallet}
                  style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.15s' }}
                  onMouseEnter={(el) => (el.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(el) => (el.currentTarget.style.background = 'transparent')}
                >
                  <td className="py-4 px-4 font-bold" style={{ color: '#0F172A' }}>
                    {e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : `#${e.rank}`}
                  </td>
                  <td className="py-4 px-4">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      {e.displayWallet}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                      {formatTokenAmount(e.totalLocked)} $WCB
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right hidden sm:table-cell">
                    <span style={{ fontWeight: 800, color: '#15803D', fontSize: '0.9rem' }}>
                      {formatCredits(e.totalCredits)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center hidden md:table-cell">
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                      {e.activeLocks} active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center hidden md:table-cell">
                    <span
                      style={{
                        padding: '0.2rem 0.625rem',
                        borderRadius: 9999,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: e.tierColor,
                        background: e.tierColor + '18',
                        border: `1px solid ${e.tierColor}35`,
                      }}
                    >
                      {e.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {/* Click to open the most recent active lock on Streamflow */}
                    {e.locks.length > 0 ? (
                      <a
                        href={e.locks.find(l => l.isActive)?.streamflowUrl ?? e.locks[0].streamflowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View lock on Streamflow"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.3rem 0.625rem',
                          borderRadius: 8,
                          border: '1.5px solid #E2E8F0',
                          background: '#ffffff',
                          color: '#64748B',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          transition: 'all 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(el) => {
                          el.currentTarget.style.borderColor = '#15803D';
                          el.currentTarget.style.color = '#15803D';
                          el.currentTarget.style.background = '#F0FDF4';
                        }}
                        onMouseLeave={(el) => {
                          el.currentTarget.style.borderColor = '#E2E8F0';
                          el.currentTarget.style.color = '#64748B';
                          el.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        🔗 Streamflow
                      </a>
                    ) : (
                      <span style={{ color: '#CBD5E1', fontSize: '0.72rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer note */}
          <div style={{ padding: '0.875rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Data sourced live from Streamflow Finance · Token: $WCB · Click any row to view lock on Streamflow
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Want to climb the leaderboard?
        </p>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
          Lock more $WCB for longer to earn more credits and secure your tier.
        </p>
        <a
          href="/lock"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            borderRadius: 10,
            background: '#ffffff',
            color: '#15803D',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          🔒 Lock $WCB Now
        </a>
      </div>
    </div>
  );
}
