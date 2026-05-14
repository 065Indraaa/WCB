'use client';

import { MOCK_ACTIVE_LOCKS, formatCredits, formatTokenAmount, type ActiveLock } from '@/lib/lock';

function ProgressBar({ startDate, endDate }: { startDate: string; endDate: string }) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(endDate);
  const unlockStr = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
          {daysLeft > 0 ? `${daysLeft} days left` : 'Unlocked'}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
          Unlocks {unlockStr}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 9999, background: '#E2E8F0', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #15803D 0%, #22C55E 100%)',
            borderRadius: 9999,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

function LockRow({ lock }: { lock: ActiveLock }) {
  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #E2E8F0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1.5fr',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      {/* Wallet */}
      <div>
        <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.125rem' }}>Wallet</p>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
          {lock.wallet}
        </p>
      </div>

      {/* Amount */}
      <div>
        <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.125rem' }}>Locked</p>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
          {formatTokenAmount(lock.amount)} $WCB
        </p>
      </div>

      {/* Credits */}
      <div>
        <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.125rem' }}>Credits</p>
        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D' }}>
          {formatCredits(lock.credits)}
        </p>
      </div>

      {/* Progress */}
      <div>
        <ProgressBar startDate={lock.startDate} endDate={lock.endDate} />
      </div>
    </div>
  );
}

export function ActiveLocksTable() {
  const locks = MOCK_ACTIVE_LOCKS;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Active Locks
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.125rem' }}>
            {locks.length} active lock{locks.length !== 1 ? 's' : ''} · Community overview
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'live-pulse 1.4s ease-in-out infinite' }} aria-hidden="true" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D' }}>Live</span>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          padding: '0.625rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1.5fr',
          gap: '1rem',
          background: '#F1F5F0',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {['Wallet', 'Locked', 'Credits', 'Progress'].map((h) => (
          <span key={h} style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {locks.map((lock) => (
        <LockRow key={lock.id} lock={lock} />
      ))}

      {/* Footer */}
      <div style={{ padding: '0.875rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
          Showing community locks · Connect wallet to see your own locks
        </p>
      </div>
    </div>
  );
}
