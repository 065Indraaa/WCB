'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LockCalculator } from '@/components/lock/LockCalculator';
import { LockConfirmModal } from '@/components/lock/LockConfirmModal';
import { CreditRedemptionInfo } from '@/components/lock/CreditRedemptionInfo';
import { WalletDashboardDynamic, WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { formatCredits, formatTokenAmount } from '@/lib/lock';
import { useCommunityLocks } from '@/lib/hooks/useCommunityLocks';

export default function LockPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingLock, setPendingLock] = useState<{ amount: number; days: number; credits: number } | null>(null);
  const { totals, loading: totalsLoading, meta, refetch } = useCommunityLocks();

  const handleLockIntent = (amount: number, days: number, credits: number) => {
    setPendingLock({ amount, days, credits });
    setConfirmOpen(true);
  };

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
          Pre-launch lock window: earn a <strong>2x credit multiplier</strong> before markets open on <strong>June 11, 2026</strong>.
        </p>
        <Link href="/docs" className="btn-secondary" style={{ marginLeft: 'auto' }}>
          Read Docs
        </Link>
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
              Lock early. Enter launch with more credit.
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
              Lock $WCB through Streamflow Finance to reserve betting credits before launch. Longer lock periods earn higher multipliers, and early locks receive a stronger launch position when markets open on June 11, 2026.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/docs" className="btn-secondary">
              Read Docs
            </Link>
            <WalletButtonDynamic />
          </div>
        </div>
      </div>

      {/* Community stats strip */}
      <div
        className="stats-grid-3"
        style={{ marginBottom: '2.5rem' }}
      >
        {[
          { label: 'Total Locked', value: totalsLoading ? 'Syncing' : formatTokenAmount(totals.totalLocked) + ' $WCB', sub: meta.source ?? 'Streamflow locks' },
          { label: 'Credits Issued', value: totalsLoading ? 'Syncing' : formatCredits(totals.totalCredits), sub: 'reserved for launch' },
          { label: 'Active Locks', value: totalsLoading ? 'Syncing' : (totals.totalLocks ?? totals.totalLockers).toString(), sub: 'tracked Streamflow locks' },
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => void refetch()}
          style={{ padding: '0.45rem 0.8rem', borderRadius: 8, border: '1px solid #2A2A2A', background: '#111111', color: '#B3B3B3', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
        >
          Refresh Streamflow Totals
        </button>
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
              desc: 'Lock before launch to receive a 2x credit multiplier while the pre-market window is still open.',
              img: 'Countdown Visual',
            },
            {
              title: 'Betting credits',
              desc: 'Credits define how much capacity you carry into the first match markets when betting opens.',
              img: 'Betting Credits Visual',
            },
            {
              title: 'Non-custodial lock',
              desc: 'Locking is non-custodial via Streamflow. You choose the duration, and the tokens remain under your control on-chain.',
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
