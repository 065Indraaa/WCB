'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletLocks } from '@/lib/hooks/useWalletLocks';
import { formatCredits, formatTokenAmount, getTierForDays } from '@/lib/lock';
import { truncateAddress } from '@/lib/wallet';
import { WalletMultiButtonDynamic } from './WalletButtonDynamic';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 12,
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: '0.375rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.4rem', fontWeight: 900, color: color ?? '#0F172A', lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.25rem' }}>
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
        border: `1.5px solid ${lock.isActive ? '#DCFCE7' : '#E2E8F0'}`,
        background: lock.isActive ? 'rgba(220,252,231,0.15)' : '#F8FAFC',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
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
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {lock.durationDays} days · Unlocks {unlockDate}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803D' }}>
            {formatCredits(lock.credits)} credits
          </p>
          <p style={{ fontSize: '0.7rem', color: '#64748B' }}>
            {lock.isActive ? `${daysLeft} days left` : 'Completed'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 9999, background: '#E2E8F0', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: lock.isActive
              ? 'linear-gradient(90deg, #15803D 0%, #22C55E 100%)'
              : '#94A3B8',
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
          border: '2px dashed #E2E8F0',
          background: '#FAFBF8',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
          Connect your wallet
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', maxWidth: 320, margin: '0 auto 1.5rem' }}>
          Connect your Solana wallet to see your $WCB locks, credits, and lock history.
        </p>
        <WalletMultiButtonDynamic
          style={{
            background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 800,
            height: 44,
            padding: '0 2rem',
            boxShadow: '0 4px 14px -2px rgba(21,128,61,0.3)',
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
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
            {truncateAddress(publicKey.toBase58(), 6)}
          </span>
        </div>
        <button
          onClick={refetch}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: 8,
            border: '1.5px solid #E2E8F0',
            background: '#ffffff',
            color: '#64748B',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Locked" value={formatTokenAmount(stats.totalLocked)} sub="$WCB tokens" color="#0F172A" />
        <StatCard label="Total Credits" value={formatCredits(stats.totalCredits)} sub="available to bet" color="#15803D" />
        <StatCard label="Active Locks" value={stats.activeLocks.toString()} sub="on Streamflow" />
        <StatCard label="Longest Lock" value={stats.longestDays > 0 ? `${stats.longestDays}d` : '—'} sub="duration" />
      </div>

      {/* Locks list */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: '0.875rem' }}>
          Your Locks
        </p>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ height: 100, borderRadius: 12, background: '#F1F5F0' }} />
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
              style={{ padding: '2rem', textAlign: 'center', borderRadius: 12, border: '1.5px dashed #E2E8F0' }}
            >
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>
                No $WCB locks found for this wallet.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Use the calculator to lock your tokens and earn credits.
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
