'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletLocks } from '@/lib/hooks/useWalletLocks';
import { useCommunityLocks } from '@/lib/hooks/useCommunityLocks';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { usePrizePoolMetrics } from '@/lib/hooks/usePrizePoolMetrics';
import type { PrizePoolMetrics } from '@/lib/api/prizepool';
import { FIXED_LOCK_DAYS, formatCredits, formatTokenAmount } from '@/lib/lock';
import { WCB_MINT } from '@/lib/wallet';
import { WalletButtonDynamic, WalletMultiButtonDynamic } from '@/components/wallet/WalletButtonDynamic';
import { WcbMark } from '@/components/shared/WcbText';
import type { WalletEntry } from '@/types/leaderboard';

const LEADERBOARD_PAGE_SIZE = 10;
const LEADERBOARD_MAX_ROWS = 20;

const TIERS = [
  { tier: 'Bronze',   color: '#CD7F32', tint: 'rgba(205,127,50,0.12)', min: '1' },
  { tier: 'Silver',   color: '#B3B3B3', tint: 'rgba(179,179,179,0.12)', min: '100K' },
  { tier: 'Gold',     color: '#F2B544', tint: 'rgba(242,181,68,0.12)', min: '1M' },
  { tier: 'Platinum', color: '#9945FF', tint: 'rgba(153,69,255,0.12)', min: '10M' },
];

const PRIZE_POOL_FLOW = [
  {
    code: '01',
    title: 'Live creator fee',
    desc: 'Creator fee is the only funding source tracked for the prize pool credit reserve.',
  },
  {
    code: '02',
    title: 'Reserve accounting',
    desc: 'A configured share of creator fee is tracked before each campaign or matchday distribution window.',
  },
  {
    code: '03',
    title: 'Eligibility snapshot',
    desc: 'Holder rank, lock credits, and campaign activity define who is eligible when a reward window closes.',
  },
  {
    code: '04',
    title: 'Credit allocation',
    desc: 'Prize pool credit is allocated only under published rules after eligibility review.',
  },
];

const HOLDER_BENEFITS = [
  'Ranked by live $WCB holdings',
  'Tier and badge status layer',
  'Eligible for holder snapshots',
  'Separate from Streamflow lock rank',
];

function getTierVisual(tier: string) {
  return TIERS.find((item) => item.tier === tier) ?? TIERS[0];
}

function formatUsd(value: number | undefined) {
  const safeValue = Number.isFinite(value) ? value ?? 0 : 0;
  if (safeValue >= 1_000_000) return `$${(safeValue / 1_000_000).toFixed(2)}M`;
  if (safeValue >= 1_000) return `$${(safeValue / 1_000).toFixed(2)}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: safeValue >= 10 ? 0 : 2,
  }).format(safeValue);
}

function formatRate(value: number | undefined) {
  const safeValue = Number.isFinite(value) ? value ?? 0 : 0;
  return `${(safeValue * 100).toFixed(safeValue > 0 && safeValue < 0.001 ? 3 : 2)}%`;
}

function formatSol(value: number | undefined) {
  const safeValue = Number.isFinite(value) ? value ?? 0 : 0;
  if (safeValue >= 1_000_000) return `${(safeValue / 1_000_000).toFixed(2)}M SOL`;
  if (safeValue >= 1_000) return `${(safeValue / 1_000).toFixed(2)}K SOL`;
  return `${safeValue.toFixed(safeValue < 0.1 ? 4 : 2)} SOL`;
}

// My position banner
function MyPositionBanner() {
  const { connected, publicKey } = useWallet();
  const { stats, loading, locks } = useWalletLocks();

  // Not connected: teaser to connect.
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
          {/* Locked preview stats */}
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

  // Connected: show real stats.
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
          {
            label: 'My Locked',
            value: <>{formatTokenAmount(stats.totalLocked)} <WcbMark /></>,
            highlight: stats.totalLocked > 0,
          },
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
            Lock <WcbMark /> to earn credits and appear on the leaderboard
          </p>
          <a href="/lock" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem', borderRadius: 8, background: '#F2B544', color: '#070707', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' }}>
            Lock Now
          </a>
        </div>
      )}
    </motion.div>
  );
}

function PrizePoolCreditPanel({
  metrics,
  loading,
  error,
  refetch,
}: {
  metrics?: PrizePoolMetrics;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}) {
  const statusLabel = error
    ? 'API fallback'
    : metrics?.pumpCreatorVault
      ? 'Live creator vault'
      : metrics?.available
        ? 'Live estimate'
        : metrics?.message ?? 'Awaiting volume';

  const liveMetrics = [
    { label: 'Prize Pool 24h', value: loading ? 'Syncing' : formatUsd(metrics?.prizePoolCredit24hUsd), color: '#14F195' },
    {
      label: metrics?.pumpCreatorVault ? 'Live Vault' : 'Creator Fee 24h',
      value: loading
        ? 'Syncing'
        : metrics?.pumpCreatorVault
          ? `${formatUsd(metrics.pumpCreatorVault.liveCreatorFeeUsd ?? undefined)} / ${formatSol(metrics.pumpCreatorVault.liveCreatorFeeSol)}`
          : formatUsd(metrics?.creatorFee24hUsd),
      color: '#F2B544',
    },
    { label: '24h Volume', value: loading ? 'Syncing' : formatUsd(metrics?.volume24hUsd), color: '#FFFFFF' },
    { label: 'Fee Rate', value: loading ? 'Syncing' : formatRate(metrics?.creatorFeeRate), color: '#FFD36B' },
  ];

  return (
    <section
      style={{
        marginBottom: '1.5rem',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid rgba(20,241,149,0.22)',
        background: 'linear-gradient(135deg, #0B0F0D 0%, #111111 48%, #171717 100%)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
      }}
    >
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A2A2A' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>
              Prize Pool Credit
            </p>
            <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Live creator-fee estimate for holder and locker rewards.
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#B3B3B3', lineHeight: 1.7, maxWidth: 760 }}>
              The prize pool credit counter only tracks creator fee. It uses a live creator vault when available; otherwise it estimates creator-fee capacity from token volume and Pump.fun creator-fee tiers.
            </p>
            {error && (
              <p style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.65rem' }}>
                {error}
              </p>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: '0.6rem', minWidth: 280 }}>
            {liveMetrics.map((item) => (
              <div key={item.label} style={{ padding: '0.85rem', borderRadius: 12, background: '#111111', border: '1px solid #2A2A2A' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E', marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.88rem', fontWeight: 900, color: item.color, margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0.8rem 1.15rem', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', background: '#0E0E0E' }}>
        <p style={{ fontSize: '0.74rem', color: '#B3B3B3', margin: 0 }}>
          Funding source: creator fee only / Data: {metrics?.source ?? 'jupiter-token-api'} / Allocation: {formatRate(metrics?.allocationRate)} / Status: {statusLabel}
        </p>
        <button
          onClick={refetch}
          style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid rgba(20,241,149,0.25)', background: 'rgba(20,241,149,0.08)', color: '#14F195', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
        >
          Refresh Fee Count
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
        {PRIZE_POOL_FLOW.map((step) => (
          <div
            key={step.code}
            style={{
              padding: '1.15rem',
              borderRight: '1px solid #2A2A2A',
              borderBottom: '1px solid #2A2A2A',
            }}
          >
            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#14F195', marginBottom: 8 }}>
              {step.code}
            </p>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#B3B3B3', lineHeight: 1.55, margin: 0 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HolderLeaderboardPanel({
  entries,
  total,
  loading,
  error,
  refetch,
}: {
  entries: WalletEntry[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 6 }}>
            Holder Leaderboard
          </p>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF' }}>
            Top $WCB holders by wallet balance
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6E6E6E', marginTop: 4 }}>
            {total > 0 ? `${total.toLocaleString('en-US')} wallets tracked from token accounts` : 'Reads token accounts for the configured mint'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {HOLDER_BENEFITS.map((item) => (
            <span
              key={item}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: 9999,
                border: '1px solid rgba(242,181,68,0.24)',
                background: 'rgba(242,181,68,0.08)',
                color: '#FFD36B',
                fontSize: '0.68rem',
                fontWeight: 800,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ borderBottom: '1px solid #2A2A2A' }}>
              <div style={{ width: 32, height: 20, background: '#171717', borderRadius: 4 }} />
              <div style={{ width: 160, height: 16, background: '#171717', borderRadius: 4 }} />
              <div style={{ flex: 1, height: 16, background: '#171717', borderRadius: 4 }} />
              <div style={{ width: 80, height: 16, background: '#171717', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p style={{ color: '#EF4444', fontWeight: 700, marginBottom: '0.75rem' }}>{error}</p>
          <button onClick={refetch} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            Refresh Holder Board
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-10 text-center">
          <p style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Holder data is not live yet
          </p>
          <p style={{ fontSize: '0.85rem', color: '#B3B3B3' }}>
            Set the token address and Helius key to populate ranked holder data.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full" aria-label="$WCB Holder Leaderboard">
            <thead>
              <tr style={{ background: '#111111', borderBottom: '1px solid #2A2A2A', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E' }}>
                <th className="py-3 px-4 text-left w-16" scope="col">Rank</th>
                <th className="py-3 px-4 text-left" scope="col">Wallet</th>
                <th className="py-3 px-4 text-right" scope="col">Holdings</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell" scope="col">Tier</th>
                <th className="py-3 px-4 text-center hidden md:table-cell" scope="col">Snapshot Role</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                  const tier = getTierVisual(entry.tier);
                  const snapshotRole = entry.badges[0] ?? (idx < 3 ? 'Core holder' : 'Holder');

                  return (
                    <motion.tr
                      key={entry.address}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.035 }}
                      style={{ borderBottom: '1px solid #2A2A2A' }}
                    >
                      <td className="py-4 px-4 font-bold" style={{ color: '#FFFFFF' }}>#{entry.rank}</td>
                      <td className="py-4 px-4">
                        <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: '#B3B3B3' }}>
                          {entry.displayAddress}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '0.9rem' }}>
                          {formatTokenAmount(entry.holdings)} <WcbMark />
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        <span style={{ padding: '0.2rem 0.625rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 800, color: tier.color, background: tier.tint, border: `1px solid ${tier.color}35` }}>
                          {entry.tier}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center hidden md:table-cell">
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: idx < 3 ? '#FFD36B' : '#B3B3B3' }}>
                          {snapshotRole}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
          <div style={{ padding: '0.875rem 1.25rem', background: '#111111', borderTop: '1px solid #2A2A2A', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: '#6E6E6E' }}>
              Holder leaderboard is ranked by balance. Lock leaderboard below is ranked by locked amount.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// Main page
export default function LeaderboardPage() {
  const [holderPage, setHolderPage] = useState(0);
  const [lockPage, setLockPage] = useState(0);
  const { leaderboard, totals, meta, loading, error, refetch } = useCommunityLocks();
  const holderQuery = useLeaderboard(1, 100);
  const prizePoolQuery = usePrizePoolMetrics();
  const lockLeaderboard = [...leaderboard].sort((a, b) => {
    if (b.totalLocked !== a.totalLocked) return b.totalLocked - a.totalLocked;
    return b.totalCredits - a.totalCredits;
  });
  const holderEntries = holderQuery.data?.entries ?? [];
  const holderTotal = holderQuery.data?.total ?? holderEntries.length;
  const topHolderEntries = [...holderEntries]
    .sort((a, b) => b.holdings - a.holdings)
    .slice(0, LEADERBOARD_MAX_ROWS);
  const holderPageCount = Math.max(1, Math.ceil(topHolderEntries.length / LEADERBOARD_PAGE_SIZE));
  const visibleHolderEntries = topHolderEntries.slice(
    holderPage * LEADERBOARD_PAGE_SIZE,
    holderPage * LEADERBOARD_PAGE_SIZE + LEADERBOARD_PAGE_SIZE,
  );
  const topLockLeaderboard = lockLeaderboard.slice(0, LEADERBOARD_MAX_ROWS);
  const lockPageCount = Math.max(1, Math.ceil(topLockLeaderboard.length / LEADERBOARD_PAGE_SIZE));
  const visibleLockLeaderboard = topLockLeaderboard.slice(
    lockPage * LEADERBOARD_PAGE_SIZE,
    lockPage * LEADERBOARD_PAGE_SIZE + LEADERBOARD_PAGE_SIZE,
  );
  const holderSource = holderQuery.data?.source ?? 'token accounts';
  const holderError = holderQuery.error instanceof Error ? holderQuery.error.message : holderQuery.error ? 'Failed to load holder leaderboard' : null;
  const prizePoolError = prizePoolQuery.error instanceof Error ? prizePoolQuery.error.message : prizePoolQuery.error ? 'Failed to load prize pool metrics' : null;
  const refreshAll = () => {
    refetch();
    void holderQuery.refetch();
    void prizePoolQuery.refetch();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">

      {/* Page header */}
      <div className="premium-panel" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', padding: '1.45rem', borderRadius: 16 }}>
        <div>
          <p className="section-eyebrow mb-2">Live Ranking Center</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: '#FFFFFF' }}>
            <WcbMark /> Leaderboards
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
            Holder rank shows ownership. Lock rank shows eligible {FIXED_LOCK_DAYS}-day Streamflow locks. Prize pool credit is funded only from creator fee once markets are active.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 14 }}>
            <span className="data-pill">Holder source: {holderSource}</span>
            <span className="data-pill">Lock source: {meta.source ?? 'Streamflow'}</span>
            <span className="data-pill">Mint: {WCB_MINT ? `${WCB_MINT.slice(0, 8)}...${WCB_MINT.slice(-6)}` : 'N/A'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button
            onClick={refreshAll}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
          >
            Refresh
          </button>
          <WalletButtonDynamic />
        </div>
      </div>

      {/* Community stats */}
      <div className="stats-grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Tracked Holders', value: holderTotal.toLocaleString('en-US'), color: '#F2B544' },
          { label: 'Platform Credits', value: formatCredits(totals.totalCredits), color: '#9945FF' },
          { label: 'Active Locks', value: (totals.totalLocks ?? totals.totalLockers).toLocaleString('en-US'), color: '#FFD36B' },
          { label: 'Prize Pool 24h', value: prizePoolQuery.isLoading ? 'Syncing' : formatUsd(prizePoolQuery.data?.prizePoolCredit24hUsd), color: '#14F195' },
        ].map((s) => (
          <div key={s.label} className="card card-hover" style={{ padding: '1.25rem', textAlign: 'center', minHeight: 108 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <PrizePoolCreditPanel
        metrics={prizePoolQuery.data}
        loading={prizePoolQuery.isLoading}
        error={prizePoolError}
        refetch={() => { void prizePoolQuery.refetch(); }}
      />

      {/* My position changes based on wallet state */}
      <MyPositionBanner />

      <HolderLeaderboardPanel
        entries={visibleHolderEntries}
        total={holderTotal}
        loading={holderQuery.isLoading}
        error={holderError}
        refetch={() => { void holderQuery.refetch(); }}
      />
      {topHolderEntries.length > LEADERBOARD_PAGE_SIZE && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setHolderPage((page) => Math.max(0, page - 1))}
            disabled={holderPage === 0}
            className="btn-secondary"
            style={{ opacity: holderPage === 0 ? 0.45 : 1, cursor: holderPage === 0 ? 'not-allowed' : 'pointer' }}
          >
            Prev
          </button>
          <span style={{ color: '#B3B3B3', fontSize: '0.8rem', fontWeight: 800 }}>
            Holder Top {holderPage * LEADERBOARD_PAGE_SIZE + 1}-{Math.min((holderPage + 1) * LEADERBOARD_PAGE_SIZE, topHolderEntries.length)}
          </span>
          <button
            type="button"
            onClick={() => setHolderPage((page) => Math.min(holderPageCount - 1, page + 1))}
            disabled={holderPage >= holderPageCount - 1}
            className="btn-secondary"
            style={{ opacity: holderPage >= holderPageCount - 1 ? 0.45 : 1, cursor: holderPage >= holderPageCount - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Tier legend */}
      <div className="card p-5 mb-6" style={{ borderColor: 'rgba(242,181,68,0.16)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.75rem' }}>
          Tier Thresholds
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <div key={t.tier} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: t.tint, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 10, height: 36, borderRadius: 9999, background: t.color, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: t.color }}>{t.tier}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#B3B3B3' }}>{t.min}+ <WcbMark /></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lock leaderboard table */}
      <div className="premium-panel" style={{ marginBottom: '0.75rem', padding: '1rem 1.15rem', borderRadius: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 6 }}>
              Lock Leaderboard
            </p>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF' }}>
              Top wallets by Streamflow locked amount
            </h2>
          </div>
          <a
            href={meta.streamflowDashboardUrl ?? `https://app.streamflow.finance/token-dashboard/solana/mainnet/${WCB_MINT}?type=lock`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.5rem 0.75rem' }}
          >
            Verify on Streamflow
          </a>
        </div>
      </div>

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
        ) : topLockLeaderboard.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>No data yet</p>
            <p style={{ color: '#B3B3B3', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Lock <WcbMark /> to establish a leaderboard position.</p>
            <a href="/lock" className="btn-primary" style={{ display: 'inline-flex' }}>Lock <WcbMark tone="inherit" /> Now</a>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <table className="w-full" aria-label="$WCB Lock Leaderboard">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E' }}>
                  <th className="py-3 px-4 text-left w-16" scope="col">Rank</th>
                  <th className="py-3 px-4 text-left" scope="col">Wallet</th>
                  <th className="py-3 px-4 text-right" scope="col">Locked</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell" scope="col">Credits</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell" scope="col">Tier</th>
                  <th className="py-3 px-4 text-center" scope="col">Streamflow</th>
                </tr>
              </thead>
              <tbody>
                {visibleLockLeaderboard.map((e, idx) => (
                  <motion.tr
                    key={e.wallet}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => window.open(e.streamflowUrl, '_blank', 'noopener,noreferrer')}
                    onMouseEnter={(el) => (el.currentTarget.style.background = 'rgba(242,181,68,0.055)')}
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
                        {formatTokenAmount(e.totalLocked)} <WcbMark />
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.625rem', borderRadius: 8, border: '1px solid rgba(242,181,68,0.22)', background: 'rgba(242,181,68,0.07)', color: '#FFD36B', fontSize: '0.72rem', fontWeight: 800 }}>
                        View
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '0.875rem 1.25rem', background: '#111111', borderTop: '1px solid #2A2A2A', textAlign: 'center' }}>
              <p style={{ fontSize: '0.72rem', color: '#6E6E6E' }}>
                Top 20 locked positions / Token:{' '}
                <a href={`https://solscan.io/token/${WCB_MINT}`} target="_blank" rel="noopener noreferrer" style={{ color: '#F2B544', textDecoration: 'none' }}>
                  {WCB_MINT ? `${WCB_MINT.slice(0, 8)}...${WCB_MINT.slice(-6)}` : 'N/A'}
                </a>
                {' '}/ Click any row to view on Streamflow
              </p>
            </div>
            {topLockLeaderboard.length > LEADERBOARD_PAGE_SIZE && (
              <div style={{ padding: '0.875rem 1.25rem', background: '#0E0E0E', borderTop: '1px solid #2A2A2A', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setLockPage((page) => Math.max(0, page - 1))}
                  disabled={lockPage === 0}
                  className="btn-secondary"
                  style={{ opacity: lockPage === 0 ? 0.45 : 1, cursor: lockPage === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Prev
                </button>
                <span style={{ color: '#B3B3B3', fontSize: '0.8rem', fontWeight: 800 }}>
                  Lock Top {lockPage * LEADERBOARD_PAGE_SIZE + 1}-{Math.min((lockPage + 1) * LEADERBOARD_PAGE_SIZE, topLockLeaderboard.length)}
                </span>
                <button
                  type="button"
                  onClick={() => setLockPage((page) => Math.min(lockPageCount - 1, page + 1))}
                  disabled={lockPage >= lockPageCount - 1}
                  className="btn-secondary"
                  style={{ opacity: lockPage >= lockPageCount - 1 ? 0.45 : 1, cursor: lockPage >= lockPageCount - 1 ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div style={{ marginTop: '2rem', padding: '2rem', borderRadius: 16, background: 'linear-gradient(135deg, #111111 0%, #171717 100%)', border: '1px solid rgba(242,181,68,0.22)', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
          Want to climb the leaderboard?
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>
          Lock eligible {FIXED_LOCK_DAYS}-day Streamflow positions to earn platform credits and secure your tier.
        </p>
        <a href="/lock" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', borderRadius: 12, background: '#F2B544', color: '#070707', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 8px 22px rgba(242,181,68,0.24)' }}>
          Lock <WcbMark tone="inherit" /> Now
        </a>
      </div>
    </div>
  );
}
