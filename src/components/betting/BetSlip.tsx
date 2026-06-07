'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { useOdds } from '@/lib/hooks/useOdds';
import type { PlaceBetResponse } from '@/types/betting';
import type { PredictionChoice } from '@/lib/predictions';
import type { BetSelection } from './types';

const QUICK_AMOUNTS = [50, 100, 250, 500];
const ODDS_MOVE_THRESHOLD = 0.1;

interface BetSlipProps {
  selection: BetSelection | null;
  onClose: () => void;
  walletConnected: boolean;
  available: number | null;
  balanceLoading?: boolean;
  placeBet: (matchId: number, choice: PredictionChoice, amount: number, odds: string) => Promise<PlaceBetResponse>;
  placing: boolean;
}

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export function BetSlip(props: BetSlipProps) {
  const isDesktop = useIsDesktop();
  const open = props.selection != null;

  return (
    <AnimatePresence>
      {open && props.selection && (
        <>
          <motion.div
            key="betslip-backdrop"
            style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={props.onClose}
            aria-hidden="true"
          />
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 55, display: 'flex', pointerEvents: 'none', alignItems: 'flex-end', justifyContent: 'center' }}
            className="sm:items-stretch sm:justify-end"
          >
            <motion.div
              key="betslip-panel"
              style={{ width: '100%', maxWidth: isDesktop ? 420 : 520, height: isDesktop ? '100%' : 'auto', maxHeight: isDesktop ? '100%' : '85vh', pointerEvents: 'auto' }}
              initial={isDesktop ? { x: 440 } : { y: 80, opacity: 0 }}
              animate={isDesktop ? { x: 0 } : { y: 0, opacity: 1 }}
              exit={isDesktop ? { x: 440 } : { y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              role="dialog"
              aria-modal="true"
              aria-label="Bet slip"
            >
              <BetSlipContent {...props} selection={props.selection} isDesktop={isDesktop} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function choiceName(selection: BetSelection): string {
  if (selection.choice === 'home') return selection.match.homeTeam.name;
  if (selection.choice === 'away') return selection.match.awayTeam.name;
  return 'Draw';
}

function BetSlipContent({
  selection,
  onClose,
  walletConnected,
  available,
  balanceLoading,
  placeBet,
  placing,
  isDesktop,
}: BetSlipProps & { selection: BetSelection; isDesktop: boolean }) {
  const { match, choice } = selection;
  const odds = useOdds(
    match.id,
    match.homeTeam.fifaRanking ?? 50,
    match.awayTeam.fifaRanking ?? 50,
    false,
    match.kickoff,
    match.displayStatus,
    match.elapsed
  );

  const [amount, setAmount] = useState<number | ''>('');
  const [acceptedOdds, setAcceptedOdds] = useState(selection.odds);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const liveOdds = odds[choice];
  const oddsMoved = Math.abs(parseFloat(liveOdds) - parseFloat(acceptedOdds)) > ODDS_MOVE_THRESHOLD;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const oddsNum = parseFloat(acceptedOdds) || 1;
  const amt = typeof amount === 'number' ? amount : 0;
  const potentialWin = Math.round(amt * (oddsNum - 1));
  const refund = Math.round(amt * 0.2);
  const maxLoss = amt - refund;

  const availableNum = available ?? 0;
  const overBalance = amt > availableNum;
  const zeroBalance = walletConnected && !balanceLoading && availableNum <= 0;
  const isLoadingBalance = walletConnected && balanceLoading && available == null;

  const bettingClosed = match.displayStatus === 'FINISHED' || odds.suspended;

  const reason = useMemo(() => {
    if (bettingClosed) return odds.suspended ? 'Market suspended — wait for odds update' : 'Betting closed — match finished';
    if (!walletConnected) return 'Connect wallet';
    if (isLoadingBalance) return 'Loading credits…';
    if (zeroBalance) return 'Lock $WCB to activate betting credits.';
    if (oddsMoved) return 'Accept new odds to continue';
    if (amt <= 0) return 'Enter an amount';
    if (overBalance) return 'Insufficient credits';
    return null;
  }, [bettingClosed, odds.suspended, walletConnected, isLoadingBalance, zeroBalance, oddsMoved, amt, overBalance]);

  const canPlace = reason == null && !placing;

  const submit = async () => {
    if (!canPlace) return;
    setError(null);
    try {
      const res = await placeBet(match.id, choice, amt, acceptedOdds);
      if (res.success) {
        setSuccess(true);
        setTimeout(onClose, 1400);
      } else {
        setError(res.error ?? 'Failed to place bet');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to place bet');
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderRadius: isDesktop ? '12px 0 0 12px' : '16px 16px 0 0',
      }}
    >
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 4 }}>Bet Slip</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="sm" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>{match.homeTeam.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#6E6E6E', fontWeight: 700 }}>v</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>{match.awayTeam.name}</span>
            <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="sm" />
          </div>
        </div>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close bet slip"
          style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#B3B3B3', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
        {/* Selected outcome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: 'rgba(242,181,68,0.08)', border: '1px solid rgba(242,181,68,0.24)', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', margin: 0 }}>Your pick</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF', margin: '2px 0 0' }}>{choiceName(selection)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', margin: 0 }}>Odds</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F2B544', margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>{acceptedOdds}</p>
          </div>
        </div>

        {/* Odds movement warning */}
        <AnimatePresence>
          {oddsMoved && !success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(242,181,68,0.1)', border: '1px solid rgba(242,181,68,0.3)' }}>
                <p style={{ fontSize: '0.76rem', color: '#FFE8C8', margin: 0, lineHeight: 1.4 }}>
                  Odds have changed to <strong>{liveOdds}</strong>. Accept new odds to continue.
                </p>
                <button
                  onClick={() => setAcceptedOdds(liveOdds)}
                  style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#F2B544', color: '#070707', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Accept
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suspension warning */}
        <AnimatePresence>
          {odds.suspended && !success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(242,181,68,0.08)', border: '1px solid rgba(242,181,68,0.25)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F2B544' }} />
                <p style={{ fontSize: '0.76rem', color: '#FFE8C8', margin: 0, lineHeight: 1.4 }}>
                  {odds.suspensionReason ?? 'Market suspended — odds updating'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Amount input */}
        <label style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', display: 'block', marginBottom: 6 }}>
          Bet amount ($WCB credits)
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={amount}
          onChange={(e) => {
            const v = e.target.value;
            setAmount(v === '' ? '' : Math.max(0, Math.floor(Number(v))));
            setError(null);
          }}
          placeholder="0"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            background: '#0B0B0B',
            border: `1px solid ${overBalance ? 'rgba(239,68,68,0.5)' : '#2A2A2A'}`,
            color: '#FFFFFF',
            fontSize: '1.1rem',
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            outline: 'none',
          }}
        />

        {/* Quick amounts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }} className="sm:grid-cols-5">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => { setAmount(q); setError(null); }}
              style={quickBtnStyle(amount === q)}
            >
              {q}
            </button>
          ))}
          <button
            onClick={() => { setAmount(availableNum); setError(null); }}
            disabled={availableNum <= 0}
            style={{ ...quickBtnStyle(amount === availableNum && availableNum > 0), opacity: availableNum <= 0 ? 0.45 : 1 }}
          >
            MAX
          </button>
        </div>

        <p style={{ fontSize: '0.68rem', color: '#6E6E6E', marginTop: 8 }}>
          Available: <strong style={{ color: '#FFFFFF' }}>{walletConnected ? availableNum.toLocaleString() : '—'}</strong> $WCB credits
        </p>

        {/* Calculation rows */}
        <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: '#0B0B0B', border: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CalcRow label="Bet Amount" value={`${amt.toLocaleString()} $WCB`} />
          <CalcRow label="Potential Win" value={`${potentialWin.toLocaleString()} $WCB`} valueColor="#14F195" bold />
          <CalcRow label="If Lost, Refunded (20%)" value={`${refund.toLocaleString()} $WCB`} valueColor="#F2B544" />
          <CalcRow label="Max Net Loss" value={`${maxLoss.toLocaleString()} $WCB`} valueColor="#EF4444" />
        </div>

        {/* Zero-balance banner */}
        {zeroBalance && (
          <Link
            href="/lock"
            style={{ display: 'block', marginTop: 14, padding: '12px 14px', borderRadius: 10, background: 'rgba(242,181,68,0.08)', border: '1px solid rgba(242,181,68,0.28)', textDecoration: 'none' }}
          >
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFE8C8', margin: 0 }}>
              Lock $WCB to activate betting credits →
            </p>
          </Link>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.28)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFDDDD', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.28)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D9FFF0', margin: 0 }}>
              Bet placed ✓ — {amt.toLocaleString()} $WCB on {choiceName(selection)}.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #2A2A2A', flexShrink: 0 }}>
        <button
          onClick={submit}
          disabled={!canPlace}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', opacity: canPlace ? 1 : 0.5, cursor: canPlace ? 'pointer' : 'not-allowed' }}
          title={reason ?? undefined}
        >
          {placing ? 'Placing…' : reason ?? `Place Bet · ${amt.toLocaleString()} $WCB`}
        </button>
        <p style={{ fontSize: '0.68rem', color: '#6E6E6E', textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
          Bets are final once confirmed on-chain. Odds are locked at time of confirmation.
        </p>
      </div>
    </div>
  );
}

function CalcRow({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.78rem', color: '#B3B3B3' }}>{label}</span>
      <span style={{ fontSize: bold ? '0.92rem' : '0.82rem', fontWeight: bold ? 900 : 700, color: valueColor ?? '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
}

function quickBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 0',
    borderRadius: 8,
    border: `1px solid ${active ? '#F2B544' : '#2A2A2A'}`,
    background: active ? 'rgba(242,181,68,0.14)' : '#171717',
    color: active ? '#FFD36B' : '#FFFFFF',
    fontSize: '0.78rem',
    fontWeight: 800,
    cursor: 'pointer',
  };
}
