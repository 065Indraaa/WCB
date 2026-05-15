'use client';

import { useState } from 'react';
import { LockCalculator } from '@/components/lock/LockCalculator';
import { LockConfirmModal } from '@/components/lock/LockConfirmModal';
import { CreditRedemptionInfo } from '@/components/lock/CreditRedemptionInfo';
import { WalletDashboardDynamic, WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
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
      {/* Urgency banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #111111 0%, #171717 100%)',
          border: '1px solid rgba(242,181,68,0.22)',
          borderRadius: 12,
          padding: '0.875rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
          Betting opens on <strong>June 11, 2026</strong>. Early locks receive a <strong>2x credit multiplier</strong> before launch.
        </p>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.2rem 0.75rem',
              borderRadius: 9999,
              fontSize: '0.7rem',
              fontWeight: 800,
              background: 'rgba(20,241,149,0.12)',
              color: '#14F195',
              border: '1px solid rgba(20,241,149,0.28)',
            }}
          >
            LIVE NOW
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}
            >
              Lock early. Bet first.
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
              Lock $WCB through Streamflow Finance to receive betting credits. Longer lock periods earn higher multipliers, and credits become available for match markets when betting opens on June 11, 2026.
            </p>
          </div>
          <WalletButtonDynamic />
        </div>
      </div>

      {/* Community stats strip */}
      <div
        className="stats-grid-3"
        style={{ marginBottom: '2.5rem' }}
      >
        {[
          { label: 'Total Locked', value: formatTokenAmount(totalLocked) + ' $WCB', sub: 'community allocation' },
          { label: 'Credits Issued', value: formatCredits(totalCredits), sub: 'reserved for launch' },
          { label: 'People Locking', value: totalLockers.toString(), sub: 'tracked wallets' },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{ padding: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F2B544' }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B3B3B3', marginTop: '0.25rem' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6E6E6E', marginTop: '0.15rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main 3-column layout */}
      <div
        className="lock-main-grid"
        style={{ marginBottom: '2.5rem' }}
      >
        {/* Col 1: Calculator */}
        <LockCalculator onLockIntent={handleLockIntent} />

        {/* Col 2: Wallet Dashboard */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            My Locks & Credits
          </h2>
          <WalletDashboardDynamic />
        </div>

        {/* Col 3: Info */}
        <CreditRedemptionInfo />
      </div>

      {/* Why lock now? */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1.25rem' }}>
          Why lock now?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            {
              title: 'Launch multiplier',
              desc: 'Early lockers receive double credits before the June 11 launch window closes.',
              img: 'Countdown Visual',
            },
            {
              title: 'Betting credits',
              desc: 'Credits determine the amount you can deploy across match markets once betting opens.',
              img: 'Betting Credits Visual',
            },
            {
              title: 'Non-custodial lock',
              desc: 'Locking is non-custodial via Streamflow. You set the unlock date. Nobody else touches your $WCB.',
              img: 'Security Visual',
            },
          ].map((r) => (
            <div
              key={r.title}
              className="card"
              style={{ padding: 0, overflow: 'hidden', borderLeft: '3px solid #F2B544' }}
            >
              <ImagePlaceholder
                width="100%"
                height={120}
                label={r.img}
                rounded={0}
                style={{ border: 'none', borderRadius: 0 }}
              />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.375rem' }}>{r.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#B3B3B3', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
