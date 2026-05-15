'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletLocks } from '@/lib/hooks/useWalletLocks';
import { useCommunityLocks } from '@/lib/hooks/useCommunityLocks';
import { formatCredits, formatTokenAmount } from '@/lib/lock';
import { WalletButtonDynamic, WalletMultiButtonDynamic } from '@/components/wallet/WalletButtonDynamic';

const TIERS = [
  { tier: 'Bronze',   color: '#CD7F32', tint: 'rgba(205,127,50,0.12)', min: '1' },
  { tier: 'Silver',   color: '#B3B3B3', tint: 'rgba(179,179,179,0.12)', min: '100K' },
  { tier: 'Gold',     color: '#F2B544', tint: 'rgba(242,181,68,0.12)', min: '1M' },
  { tier: 'Platinum', color: '#9945FF', tint: 'rgba(153,69,255,0.12)', min: '10M' },
];

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';

// ── My Position Banner ────────────────────────────────────────────────────────
function MyPositionBanner() {
  const { connected, publicKey } = useWallet();
  const { stats, loading, locks } = useWalletLocks();

  // NOT connected — teaser to connect
  if (!connected) {
    return (
      <div
        style={{
          marginBottom: '1.5rem',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #2A2A2A',
          background: '#111111',
        }}
      >
        {/* Blurred preview */}
        <div style={{ position: 'relative', padding: '1.5rem', background: 'linear-gradient(135deg, #111111 0%, #171717 100%)' }}>
          {/* Fake blurred stats */}
          <div className="stats-grid-4" style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
            {['My Locked', 'My Credits', 'Active Locks', 'Longest Lock'].map((l) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.25rem' }}>{l}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F2B544' }}>-</p>
              </div>
            ))}
          </div>

          {/* Overlay CTA */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'rgba(7,7,7,0.74)', backdropFilter: 'blur(3px)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
              Connect wallet to view your lock stats
            </p>
            <WalletMultiButtonDynamic
              style={{
                background: '#F2B544',
                border: 'none', borderRadius: 10,
                color: '#070707',
                fontSize: '0.85rem', fontWeight: 800, height: 38, padding: '0 1.5rem',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={{ height: 90, borderRadius: 16, background: '#171717', marginBottom: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
    );
  }

  // Connected — show real stats
  const hasLocks = locks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginBottom: '1.5rem',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(242,181,68,0.24)',
        background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
      }}
    >
      {/* Connected header */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', display: 'inline-block' }} aria-hidden="true" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#14F195', fontFamily: 'monospace' }}>
            {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-6)}
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#B3B3B3' }}>
          {hasLocks ? `${locks.length} lock${locks.length !== 1 ? 's' : ''} found` : 'No locks yet'}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid-4" style={{ padding: '1rem 1.25rem' }}>
        {[
          { label: 'My Locked', value: formatTokenAmount(stats.totalLocked) + ' $WCB', highlight: stats.totalLocked > 0 },
          { label: 'My Credits', value: formatCredits(stats.totalCredits), highlight: stats.totalCredits > 0 },
          { label: 'Active Locks', value: stats.activeLocks.toString(), highlight: stats.activeLocks > 0 },
          { label: 'Longest Lock', value: stats.longestDays > 0 ? stats.longestDays + 'd' : '-', highlight: stats.longestDays > 0 },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.25rem' }}>{s.label}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: s.highlight ? '#F2B544' : '#B3B3B3' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* No locks CTA */}
      {!hasLocks && (
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#B3B3B3' }}>
            Lock $WCB to earn credits and appear on the leaderboard
          </p>
          <a href="/lock" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', borderRadius: 8, background: '#F2B544', color: '#070707', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' }}>
            Lock Now
          </a>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const { leaderboard, totals, loading, error, refetch } = useCommunityLocks();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="section-eyebrow mb-2">Top Lockers</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: '#FFFFFF' }}>
            $WCB Lock Leaderboard
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
            Top $WCB holders ranked by on-chain holdings. Lock tokens via Streamflow to earn credits and climb the ranks.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button
            onClick={refetch}
            style={{ padding: '0.5rem 0.875rem', borderRadius: 8, border: '1px solid #2A2A2A', background: '#111111', color: '#B3B3B3', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Refresh
          </button>
          <WalletButtonDynamic />
        </div>
      </div>

      {/* Community stats */}
      <div className="stats-grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Holdings', value: formatTokenAmount(totals.totalLocked) + ' $WCB', color: '#F2B544' },
          { label: 'Credits Issued', value: formatCredits(totals.totalCredits), color: '#9945FF' },
          { label: 'Top Lockers', value: leaderboard.length.toString(), color: '#FFD36B' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My position — changes based on wallet state */}
      <MyPositionBanner />

      {/* Tier legend */}
      <div className="card p-5 mb-6">
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.75rem' }}>
          Tier Thresholds
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <div key={t.tier} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: t.tint, border: '1px solid #2A2A2A' }}>
              <div style={{ width: 10, height: 36, borderRadius: 9999, background: t.color, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: t.color }}>{t.tier}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B3B3B3' }}>{t.min}+ $WCB</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ borderBottom: '1px solid #2A2A2A' }}>
                <div style={{ width: 32, height: 20, background: '#171717', borderRadius: 4 }} />
                <div style={{ width: 140, height: 16, background: '#171717', borderRadius: 4 }} />
                <div style={{ flex: 1, height: 16, background: '#171717', borderRadius: 4 }} />
                <div style={{ width: 80, height: 16, background: '#171717', borderRadius: 4 }} />
              </div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem', textAlign: 'center', borderRadius: 14, border: '1.5px solid #FECACA', background: '#FEF2F2' }}>
            <p style={{ color: '#DC2626', fontWeight: 600, marginBottom: '0.75rem' }}>{error}</p>
            <button onClick={refetch} className="btn-secondary" style={{ fontSize: '0.85rem' }}>Try again</button>
          </motion.div>
        ) : leaderboard.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>No data yet</p>
            <p style={{ color: '#B3B3B3', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Lock $WCB to establish a leaderboard position.</p>
            <a href="/lock" className="btn-primary" style={{ display: 'inline-flex' }}>Lock $WCB Now</a>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <table className="w-full" aria-label="$WCB Lock Leaderboard">
              <thead>
                <tr style={{ background: '#111111', borderBottom: '1px solid #2A2A2A', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E' }}>
                  <th className="py-3 px-4 text-left w-16" scope="col">Rank</th>
                  <th className="py-3 px-4 text-left" scope="col">Wallet</th>
                  <th className="py-3 px-4 text-right" scope="col">Holdings</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell" scope="col">Credits</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell" scope="col">Tier</th>
                  <th className="py-3 px-4 text-center" scope="col">Streamflow</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 10).map((e, idx) => (
                  <motion.tr
                    key={e.wallet}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: '1px solid #2A2A2A', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => window.open(e.streamflowUrl, '_blank', 'noopener,noreferrer')}
                    onMouseEnter={(el) => (el.currentTarget.style.background = '#171717')}
                    onMouseLeave={(el) => (el.currentTarget.style.background = 'transparent')}
                    title={`View ${e.displayWallet} on Streamflow`}
                  >
                    <td className="py-4 px-4 font-bold" style={{ color: '#FFFFFF' }}>
                      #{e.rank}
                    </td>
                    <td className="py-4 px-4">
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#B3B3B3' }}>
                        {e.displayWallet}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {formatTokenAmount(e.holdings)} $WCB
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                      <span style={{ fontWeight: 800, color: '#F2B544', fontSize: '0.9rem' }}>
                        {formatCredits(e.totalCredits)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell">
                      <span style={{ padding: '0.2rem 0.625rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800, color: e.tierColor, background: e.tierTint, border: `1px solid ${e.tierColor}35` }}>
                        {e.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.625rem', borderRadius: 8, border: '1px solid #2A2A2A', background: '#111111', color: '#B3B3B3', fontSize: '0.72rem', fontWeight: 700 }}>
                        View
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '0.875rem 1.25rem', background: '#111111', borderTop: '1px solid #2A2A2A', textAlign: 'center' }}>
              <p style={{ fontSize: '0.72rem', color: '#6E6E6E' }}>
                Top 10 $WCB holders / Token:{' '}
                <a href={`https://solscan.io/token/${WCB_MINT}`} target="_blank" rel="noopener noreferrer" style={{ color: '#F2B544', textDecoration: 'none' }}>
                  {WCB_MINT ? `${WCB_MINT.slice(0, 8)}...${WCB_MINT.slice(-6)}` : 'N/A'}
                </a>
                {' '}/ Click any row to view on Streamflow
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div style={{ marginTop: '2rem', padding: '2rem', borderRadius: 16, background: 'linear-gradient(135deg, #111111 0%, #171717 100%)', border: '1px solid rgba(242,181,68,0.22)', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
          Want to climb the leaderboard?
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>
          Lock more $WCB for longer to earn more credits and secure your tier.
        </p>
        <a href="/lock" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', borderRadius: 12, background: '#F2B544', color: '#070707', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 8px 22px rgba(242,181,68,0.24)' }}>
          Lock $WCB Now
        </a>
      </div>
    </div>
  );
}
