'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from './LeaderboardEntry';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { useCombinedLeaderboard } from '@/lib/hooks/useCombinedLeaderboard';
import { useLaunchState } from '@/lib/hooks/useLaunchState';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ComingSoonModal } from '@/components/shared/ComingSoonModal';
import type { Tier, Badge } from '@/types/leaderboard';

export function LeaderboardSection() {
  const { holderEntries, lockerEntries, isLoading, holdersError, totalHolders } =
    useCombinedLeaderboard(100);
  const launchState = useLaunchState();
  const reducedMotion = useReducedMotion();
  const [tab, setTab] = useState<'holders' | 'lockers'>('holders');
  const [showModal, setShowModal] = useState(false);

  const entries = tab === 'holders' ? holderEntries : lockerEntries;

  return (
    <section id="leaderboard" className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-6">
            <p className="section-eyebrow mb-2">Leaderboard</p>
            <h2
              className="text-3xl sm:text-4xl font-black tracking-tight mb-3"
              style={{ color: '#FFFFFF' }}
            >
              Early Adopters
            </h2>
            <p className="text-base max-w-2xl" style={{ color: '#B3B3B3' }}>
              Top $WCB holders ranked by balance. Climb from Bronze to Platinum and collect achievement badges.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(
              [
                { id: 'holders', label: 'Top Holders', count: holderEntries.length },
                { id: 'lockers', label: 'Top Lockers', count: lockerEntries.length },
              ] as const
            ).map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: active ? 'rgba(242,181,68,0.35)' : '#2A2A2A',
                    background: active ? 'rgba(242,181,68,0.10)' : '#111111',
                    color: active ? '#FFD36B' : '#6E6E6E',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: active ? 'rgba(242,181,68,0.18)' : 'rgba(255,255,255,0.05)',
                      color: active ? '#FFD36B' : '#6E6E6E',
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table header */}
          <div
            className="hidden sm:flex items-center gap-3 px-4 py-2"
            style={{
              background: '#0B0B0B',
              borderBottom: '1px solid #2A2A2A',
              fontSize: '0.62rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6E6E6E',
            }}
          >
            <div style={{ width: 32, textAlign: 'center' }}>Rank</div>
            <div className="flex-1">Wallet</div>
            <div className="text-right" style={{ minWidth: 80 }}>
              {tab === 'holders' ? 'Holdings' : 'Locked'}
            </div>
            <div className="flex-shrink-0" style={{ width: 72 }}>
              Tier
            </div>
            <div className="flex-shrink-0" style={{ width: 64 }}>
              Badges
            </div>
          </div>

          {/* Entries */}
          <div className="card overflow-hidden mb-4">
            {isLoading && entries.length === 0 && (
              <div className="p-8 text-center">
                <p style={{ color: '#B3B3B3' }}>Loading leaderboard...</p>
              </div>
            )}

            {holdersError && entries.length === 0 && (
              <div className="p-8 text-center">
                <p style={{ color: '#EF4444', fontWeight: 700 }}>
                  Rankings may be delayed
                </p>
                <p className="text-xs mt-1" style={{ color: '#6E6E6E' }}>
                  {String(holdersError)}
                </p>
              </div>
            )}

            {entries.map((entry) => (
              <LeaderboardEntry
                key={entry.address}
                entry={{
                  rank: entry.rank,
                  address: entry.address,
                  displayAddress: entry.displayAddress,
                  holdings: 'holdings' in entry ? entry.holdings : 0,
                  tier: entry.tier as Tier,
                  badges: ('badges' in entry ? entry.badges : []) as Badge[],
                  isLocker: 'isLocker' in entry ? (entry as { isLocker?: boolean }).isLocker : false,
                }}
              />
            ))}

            {!isLoading && entries.length === 0 && (
              <div className="p-8 text-center">
                <p style={{ color: '#B3B3B3' }}>No entries found.</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs" style={{ color: '#6E6E6E' }}>
              Showing top {entries.length} wallets
              {totalHolders > 0 ? ` of ${totalHolders.toLocaleString()} tracked` : ''}
            </p>

            {launchState !== 'live' && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-bold"
                style={{ color: '#F2B544', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Predictions open June 11, 2026 →
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Climb the leaderboard by holding $WCB. Early holders get priority access when predictions go live."
      />
    </section>
  );
}
