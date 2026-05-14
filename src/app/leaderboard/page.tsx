'use client';

import { formatWallet } from '@/lib/utils/formatters';

const TIERS = [
  { tier: 'Bronze',   color: '#CD7F32', tint: '#FCE7C8', min: '1' },
  { tier: 'Silver',   color: '#94A3B8', tint: '#E2E8F0', min: '100K' },
  { tier: 'Gold',     color: '#D97706', tint: '#FEF3C7', min: '1M' },
  { tier: 'Platinum', color: '#7C3AED', tint: '#EDE9FE', min: '10M' },
];

// Static mock leaderboard — replace with real Helius data when token is live
const MOCK_ENTRIES = [
  { rank: 1, address: 'Ax3kR9mPqWzYbNvL', holdings: 42000000, tier: 'Platinum' as const },
  { rank: 2, address: 'Bz7rT4nKwXcMdEfG', holdings: 18500000, tier: 'Platinum' as const },
  { rank: 3, address: 'Cy2sU8vLxHjIoQpR', holdings: 9800000,  tier: 'Gold' as const },
  { rank: 4, address: 'Dw5tV3oMyZaKlSmN', holdings: 5200000,  tier: 'Gold' as const },
  { rank: 5, address: 'Ez9uW7pNzBcDeFgH', holdings: 2100000,  tier: 'Gold' as const },
  { rank: 6, address: 'Fa1vX2qOaIjKlMnO', holdings: 980000,   tier: 'Silver' as const },
  { rank: 7, address: 'Gb4wY6rPbPqRstuV', holdings: 450000,   tier: 'Silver' as const },
  { rank: 8, address: 'Hc8xZ1sMcWxYzAbC', holdings: 210000,   tier: 'Silver' as const },
  { rank: 9, address: 'Id6yA5tNdDefGhIj', holdings: 95000,    tier: 'Bronze' as const },
  { rank: 10, address: 'Je3zB9uOeKlMnOpQ', holdings: 42000,   tier: 'Bronze' as const },
];

export default function LeaderboardPage() {
  const entries = MOCK_ENTRIES;
  const isLoading = false;
  const hasMore = false;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">🏆 Early Adopters</p>
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{ color: '#0F172A' }}
        >
          The $WCB Leaderboard
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#64748B' }}>
          Top holders of $WCB on Solana. Climb the tiers, earn badges, and lock in priority access for launch day.
        </p>
      </div>

      {/* Tier legend */}
      <div className="card p-5 mb-8">
        <p
          className="font-bold uppercase tracking-widest mb-3"
          style={{ fontSize: '0.7rem', color: '#64748B' }}
        >
          Tier Thresholds
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: t.tint, border: '1px solid #E2E8F0' }}
            >
              <div
                className="rounded-full flex-shrink-0"
                style={{ width: 12, height: 40, background: t.color }}
                aria-hidden="true"
              />
              <div>
                <p className="font-bold text-sm" style={{ color: t.color }}>
                  {t.tier}
                </p>
                <p className="font-semibold" style={{ fontSize: '11px', color: '#64748B' }}>
                  ≥ {t.min} $WCB
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard table */}
      {isLoading ? (
        <div className="card overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 animate-pulse"
              style={{ borderBottom: '1px solid #E2E8F0' }}
            >
              <div className="rounded" style={{ width: 32, height: 20, background: '#F1F5F0' }} />
              <div className="rounded" style={{ width: 128, height: 16, background: '#F1F5F0' }} />
              <div className="flex-1 rounded" style={{ height: 16, background: '#F1F5F0' }} />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4" aria-hidden="true">🏆</p>
          <p className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
            Leaderboard launching soon
          </p>
          <p className="mb-6" style={{ color: '#64748B' }}>
            Be the first to claim your spot. Buy $WCB now to lock in early adopter status.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            🚀 Buy $WCB on Pump.fun
          </a>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full" aria-label="Leaderboard">
              <thead>
                <tr
                  style={{
                    background: '#F1F5F0',
                    borderBottom: '1px solid #E2E8F0',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#64748B',
                  }}
                >
                  <th className="py-3 px-4 text-left w-16" scope="col">Rank</th>
                  <th className="py-3 px-4 text-left" scope="col">Wallet</th>
                  <th className="py-3 px-4 text-right" scope="col">Holdings</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell" scope="col">Tier</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e.address}
                    style={{ borderBottom: '1px solid #E2E8F0' }}
                  >
                    <td className="py-4 px-4 font-bold" style={{ color: '#0F172A' }}>
                      {e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : `#${e.rank}`}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm" style={{ color: '#334155' }}>
                      {formatWallet(e.address)}
                    </td>
                    <td
                      className="py-4 px-4 text-right tabular-nums font-bold"
                      style={{ color: '#0F172A' }}
                    >
                      {e.holdings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td className="py-4 px-4 text-center hidden sm:table-cell">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          color: TIERS.find((t) => t.tier === e.tier)?.color ?? '#64748B',
                          background: TIERS.find((t) => t.tier === e.tier)?.tint ?? '#F1F5F9',
                        }}
                      >
                        {e.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button className="btn-secondary">
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
