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
          background: 'linear-gradient(90deg, #15803D 0%, #16a34a 100%)',
          borderRadius: 12,
          padding: '0.875rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>⏰</span>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
          Betting goes live <strong>June 11, 2026</strong> — early lockers get a <strong>2× credit multiplier bonus</strong>. Lock now while it still counts.
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
              Lock early. Bet first.
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: '#64748B' }}>
              Here&apos;s how it works: you lock your $WCB tokens through Streamflow Finance, and in return you earn betting credits. The longer you lock, the more credits you stack up. Those credits become your bankroll when real predictions open on June 11, 2026 — and early lockers get a 2× bonus on top.
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
          { label: 'Total Locked', value: formatTokenAmount(totalLocked) + ' $WCB', icon: '🔒', sub: 'by the community so far' },
          { label: 'Credits Issued', value: formatCredits(totalCredits), icon: '💳', sub: 'ready to bet with' },
          { label: 'People Locking', value: totalLockers.toString(), icon: '👥', sub: 'and counting' },
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
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.15rem' }}>{s.sub}</div>
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
            My Locks & Credits
          </h2>
          <WalletDashboardDynamic />
        </div>

        {/* Col 3: Info */}
        <CreditRedemptionInfo />
      </div>

      {/* Why lock now? */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
          Why lock now?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            {
              icon: '⏳',
              title: 'The 2× bonus disappears at launch',
              desc: 'Early lockers get double credits. Once June 11 hits, that multiplier is gone. There\'s no way to retroactively earn it.',
              img: 'Countdown Visual',
            },
            {
              icon: '🎯',
              title: 'Credits = your betting power',
              desc: 'When real predictions open, credits are what you bet with. More credits means more bets, more chances to climb the leaderboard.',
              img: 'Betting Credits Visual',
            },
            {
              icon: '🔐',
              title: 'Your tokens stay yours',
              desc: 'Locking is non-custodial via Streamflow. You set the unlock date. Nobody else touches your $WCB.',
              img: 'Security Visual',
            },
          ].map((r) => (
            <div
              key={r.title}
              className="card"
              style={{ padding: 0, overflow: 'hidden', borderLeft: '3px solid #15803D' }}
            >
              <ImagePlaceholder
                width="100%"
                height={120}
                label={r.img}
                rounded={0}
                style={{ border: 'none', borderRadius: 0 }}
              />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>{r.icon}</div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.375rem' }}>{r.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
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
