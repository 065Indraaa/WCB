'use client';

import { useState } from 'react';
import { LockCalculator } from '@/components/lock/LockCalculator';
import { LockConfirmModal } from '@/components/lock/LockConfirmModal';
import { CreditRedemptionInfo } from '@/components/lock/CreditRedemptionInfo';
import { WalletDashboardDynamic, WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';
import { MOCK_ACTIVE_LOCKS, formatCredits, formatTokenAmount } from '@/lib/lock';

export default function LockPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingLock, setPendingLock] = useState<{ amount: number; days: number; credits: number } | null>(null);

  const handleLockIntent = (amount: number, days: number, credits: number) => {
    setPendingLock({ amount, days, credits });
    setConfirmOpen(true);
  };

  // Community aggregate stats from mock (will be replaced with on-chain query)
  const totalLocked = MOCK_ACTIVE_LOCKS.reduce((s, l) => s + l.amount, 0);
  const totalCredits = MOCK_ACTIVE_LOCKS.reduce((s, l) => s + l.credits, 0);
  const totalLockers = MOCK_ACTIVE_LOCKS.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <p className="section-eyebrow">🔒 Early Stage</p>
          <span
            style={{
              padding: '0.2rem 0.75rem',
              borderRadius: 9999,
              fontSize: '0.7rem',
              fontWeight: 800,
              background: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #BBF7D0',
            }}
          >
            LIVE NOW
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ color: '#0F172A', marginBottom: '0.75rem' }}
            >
              Lock $WCB. Earn Credits.
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: '#64748B' }}>
              Lock your tokens via Streamflow Finance and earn betting credits. The longer you lock, the more credits you earn. Credits are your capital when predictions go live on June 11, 2026.
            </p>
          </div>
          <WalletButtonDynamic />
        </div>
      </div>

      {/* Community stats strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        {[
          { label: 'Community Locked', value: formatTokenAmount(totalLocked) + ' $WCB', icon: '🔒' },
          { label: 'Credits Issued', value: formatCredits(totalCredits), icon: '💳' },
          { label: 'Active Lockers', value: totalLockers.toString(), icon: '👥' },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginTop: '0.25rem' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main 3-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
          marginBottom: '2.5rem',
        }}
      >
        {/* Col 1: Calculator */}
        <LockCalculator onLockIntent={handleLockIntent} />

        {/* Col 2: Wallet Dashboard */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
            My Locks & Credits
          </h2>
          <WalletDashboardDynamic />
        </div>

        {/* Col 3: Info */}
        <CreditRedemptionInfo />
      </div>

      {/* Confirm modal */}
      {pendingLock && (
        <LockConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          amount={pendingLock.amount}
          days={pendingLock.days}
          credits={pendingLock.credits}
        />
      )}
    </div>
  );
}
