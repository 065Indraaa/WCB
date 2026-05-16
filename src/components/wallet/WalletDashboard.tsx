'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletLocks } from '@/lib/hooks/useWalletLocks';
import { FIXED_LOCK_DAYS, formatCredits, formatTokenAmount, getTierForDays } from '@/lib/lock';
import { truncateAddress } from '@/lib/wallet';
import { WalletMultiButtonDynamic } from './WalletButtonDynamic';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 12,
        background: '#111111',
        border: '1px solid #2A2A2A',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.375rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.4rem', fontWeight: 900, color: color ?? '#FFFFFF', lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: '0.7rem', color: '#B3B3B3', marginTop: '0.25rem' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function LockRow({ lock }: { lock: ReturnType<typeof useWalletLocks>['locks'][0] }) {
  const now = Date.now() / 1000;
  const pct = Math.min(100, Math.max(0, ((now - lock.startTs) / (lock.endTs - lock.startTs)) * 100));
  const daysLeft = Math.max(0, Math.ceil((lock.endTs - now) / 86400));
  const tier = getTierForDays(lock.durationDays);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const unlockDate = (() => {
    const d = new Date(lock.endTs * 1000);
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  })();

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 12,
        border: `1px solid ${lock.isActive ? 'rgba(242,181,68,0.34)' : '#2A2A2A'}`,
        background: lock.isActive ? 'rgba(242,181,68,0.08)' : '#111111',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF' }}>
              {formatTokenAmount(lock.amount)} $WCB
            </span>
            {tier && (
              <span
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 9999,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: tier.color + '20',
                  color: tier.color,
                  border: `1px solid ${tier.color}40`,
                }}
              >
                {tier.badge}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#B3B3B3' }}>
            {lock.durationDays} days | Unlocks {unlockDate}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F2B544' }}>
            {formatCredits(lock.credits)} credits
          </p>
          <p style={{ fontSize: '0.7rem', color: '#B3B3B3' }}>
            {lock.isActive ? `${daysLeft} days left` : 'Completed'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 9999, background: '#2A2A2A', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: lock.isActive
              ? 'linear-gradient(90deg, #C8922E 0%, #F2B544 100%)'
              : '#6E6E6E',
            borderRadius: 9999,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

export function WalletDashboard() {
  const { connected, publicKey } = useWallet();
  const { locks, stats, loading, error, refetch } = useWalletLocks();

  if (!connected || !publicKey) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderRadius: 16,
          border: '1px dashed #3A3A3A',
          background: '#111111',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, margin: '0 auto 1rem', border: '1px solid rgba(242,181,68,0.38)', background: 'rgba(242,181,68,0.1)' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Connect your wallet
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#B3B3B3', marginBottom: '1.5rem', maxWidth: 320, margin: '0 auto 1.5rem' }}>
          Connect a Solana wallet to review your real Streamflow $WCB locks, platform credits, and on-chain history.
        </p>
        <WalletMultiButtonDynamic
          style={{
            background: '#F2B544',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 800,
            height: 44,
            padding: '0 2rem',
            color: '#070707',
            boxShadow: '0 8px 22px rgba(242,181,68,0.24)',
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Wallet header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#14F195', flexShrink: 0, boxShadow: '0 0 10px rgba(20,241,149,0.45)' }} aria-hidden="true" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>
            {truncateAddress(publicKey.toBase58(), 6)}
          </span>
        </div>
        <button
          onClick={refetch}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: 8,
            border: '1px solid #2A2A2A',
            background: '#171717',
            color: '#B3B3B3',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Locked" value={formatTokenAmount(stats.totalLocked)} sub="$WCB tokens" color="#FFFFFF" />
        <StatCard label="Total Credits" value={formatCredits(stats.totalCredits)} sub="platform credits" color="#F2B544" />
        <StatCard label="Active Locks" value={stats.activeLocks.toString()} sub="on Streamflow" />
        <StatCard label="Lock Term" value={stats.longestDays > 0 ? `${FIXED_LOCK_DAYS}d` : '-'} sub="eligible duration" />
      </div>

      {/* Locks list */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginBottom: '0.875rem' }}>
          Your Locks
        </p>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ height: 100, borderRadius: 12, background: '#171717' }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', borderRadius: 10, background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <AnimatePresence>
          {!loading && !error && locks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '2rem', textAlign: 'center', borderRadius: 12, border: '1px dashed #3A3A3A' }}
            >
              <p style={{ fontSize: '0.9rem', color: '#B3B3B3', marginBottom: '0.5rem' }}>
                No eligible 60-day $WCB locks found for this wallet.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#6E6E6E' }}>
                Use the calculator to create a fixed 60-day Streamflow lock and earn credits.
              </p>
            </motion.div>
          )}

          {!loading && locks.map((lock) => (
            <motion.div key={lock.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <LockRow lock={lock} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
