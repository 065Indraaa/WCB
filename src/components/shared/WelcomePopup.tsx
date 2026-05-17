'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { EARLY_TOKENS_PER_CREDIT, FIXED_LOCK_DAYS, POST_LAUNCH_TOKENS_PER_CREDIT } from '@/lib/lock';
import {
  getPrediction,
  castPrediction,
  subscribe,
  toPercent,
  type PredictionChoice,
} from '@/lib/predictions';

const STORAGE_KEY = 'wcb.welcome.v2';
const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

/* ─── featured matches — matchId must match matches2026 ids ─── */
const FEATURED = [
  { id: 1,  home: { name: 'Mexico',    code: 'mx', rank: 16 }, away: { name: 'S. Korea', code: 'kr', rank: 22 }, group: 'Group A', kickoff: 'Jun 11 · 19:00' },
  { id: 49, home: { name: 'Argentina', code: 'ar', rank: 1  }, away: { name: 'Algeria',  code: 'dz', rank: 52 }, group: 'Group J', kickoff: 'Jun 12 · 16:00' },
  { id: 9,  home: { name: 'Brazil',    code: 'br', rank: 5  }, away: { name: 'Morocco',  code: 'ma', rank: 14 }, group: 'Group C', kickoff: 'Jun 13 · 19:00' },
  { id: 45, home: { name: 'France',    code: 'fr', rank: 4  }, away: { name: 'Senegal',  code: 'sn', rank: 20 }, group: 'Group I', kickoff: 'Jun 14 · 22:00' },
] as const;

/* ─── vote button ────────────────────────────────────────────── */
function VoteBtn({
  choice,
  label,
  pct,
  selected,
  color,
  onVote,
}: {
  choice: PredictionChoice;
  label: string;
  pct: number;
  selected: boolean;
  color: string;
  onVote: (c: PredictionChoice) => void;
}) {
  return (
    <button
      onClick={() => onVote(choice)}
      aria-pressed={selected}
      aria-label={`Vote ${label} — ${pct}%`}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '7px 4px',
        borderRadius: 7,
        border: `1px solid ${selected ? color : '#2A2A2A'}`,
        background: '#111111',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        minWidth: 0,
        boxShadow: selected ? `0 0 0 2px ${color}22` : 'none',
      }}
    >
      {/* fill bar behind content */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `${color}18`,
          transformOrigin: 'left',
        }}
        initial={false}
        animate={{ scaleX: pct / 100 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      />
      {/* label */}
      <span style={{ position: 'relative', fontSize: '0.56rem', fontWeight: 700, color: selected ? color : '#6E6E6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      {/* pct */}
      <span style={{ position: 'relative', fontSize: '0.88rem', fontWeight: 900, color: selected ? color : '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
        {pct}%
      </span>
    </button>
  );
}

/* ─── match row with live vote state ────────────────────────── */
function MatchRow({ m }: { m: typeof FEATURED[number] }) {
  const [stats, setStats] = useState(() =>
    getPrediction(m.id, m.home.rank, m.away.rank)
  );

  const refresh = useCallback(() => {
    setStats(getPrediction(m.id, m.home.rank, m.away.rank));
  }, [m.id, m.home.rank, m.away.rank]);

  useEffect(() => {
    refresh();
    return subscribe(refresh);
  }, [refresh]);

  const pct = toPercent(stats);

  function vote(choice: PredictionChoice) {
    castPrediction(m.id, choice, m.home.rank, m.away.rank);
  }

  const totalVotes = stats.total;

  return (
    <div style={{ borderRadius: 8, border: '1px solid #1E1E1E', background: '#0B0B0B', overflow: 'hidden', marginBottom: 6 }}>
      {/* meta strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 10px', borderBottom: '1px solid #161616' }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#484F58', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {m.group}
        </span>
        <span style={{ fontSize: '0.58rem', color: '#484F58' }}>{m.kickoff} UTC</span>
      </div>

      <div style={{ padding: '8px 10px' }}>
        {/* teams */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TeamFlag code={m.home.code} name={m.home.name} size="xs" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {m.home.name}
          </span>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#484F58', padding: '1px 6px', borderRadius: 3, background: '#111111', border: '1px solid #1E1E1E', flexShrink: 0 }}>
            vs
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
            {m.away.name}
          </span>
          <TeamFlag code={m.away.code} name={m.away.name} size="xs" />
        </div>

        {/* vote buttons */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
          <VoteBtn choice="home"  label={m.home.name.split(' ')[0]} pct={pct.home} selected={stats.myChoice === 'home'} color="#F2B544" onVote={vote} />
          <VoteBtn choice="draw"  label="Draw"                       pct={pct.draw} selected={stats.myChoice === 'draw'} color="#B3B3B3" onVote={vote} />
          <VoteBtn choice="away"  label={m.away.name.split(' ')[0]} pct={pct.away} selected={stats.myChoice === 'away'} color="#9945FF" onVote={vote} />
        </div>

        {/* sentiment bar */}
        <div style={{ height: 3, borderRadius: 999, overflow: 'hidden', background: '#2A2A2A', display: 'flex' }}>
          <motion.div style={{ background: '#F2B544', height: '100%' }} initial={false} animate={{ width: `${pct.home}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          <motion.div style={{ background: '#555555', height: '100%' }} initial={false} animate={{ width: `${pct.draw}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          <motion.div style={{ background: '#9945FF', height: '100%' }} initial={false} animate={{ width: `${pct.away}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
        </div>

        {/* vote count + picked label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: '0.58rem', color: '#484F58', fontVariantNumeric: 'tabular-nums' }}>
            {totalVotes.toLocaleString()} community picks
          </span>
          {stats.myChoice && (
            <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#14F195' }}>
              ✓ picked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── countdown strip ────────────────────────────────────────── */
function CountdownStrip() {
  const target = new Date('2026-06-11T00:00:00Z');
  const [diff, setDiff] = useState<{ d: number; h: number; m: number } | null>(null);

  useEffect(() => {
    function tick() {
      const s = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
      if (s === 0) { setDiff(null); return; }
      setDiff({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60) });
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!diff) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: '#111111', border: '1px solid #2A2A2A', marginBottom: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px rgba(239,68,68,0.6)', flexShrink: 0, display: 'inline-block', animation: 'live-pulse 1.4s ease-in-out infinite' }} aria-hidden="true" />
      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6E6E6E' }}>Betting opens in</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFD36B', fontVariantNumeric: 'tabular-nums', marginLeft: 'auto' }}>
        {diff.d}d {diff.h}h {diff.m}m
      </span>
    </div>
  );
}

/* ─── main popup ─────────────────────────────────────────────── */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'markets' | 'lock'>('markets');
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          {/* panel wrapper */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0 0', pointerEvents: 'none' }}
            className="sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to WORLDCUPBET"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: 460,
                maxHeight: '92svh',
                overflowY: 'auto',
                background: '#0D0D0D',
                border: '1px solid rgba(242,181,68,0.22)',
                boxShadow: '0 -8px 60px rgba(0,0,0,0.55), 0 32px 80px rgba(0,0,0,0.6)',
                /* rounded top corners on mobile, all corners on desktop */
                borderRadius: '14px 14px 0 0',
              }}
              className="sm:rounded-2xl"
            >

              {/* ── header ── */}
              <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BrandLogo size="sm" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14F195', boxShadow: '0 0 7px rgba(20,241,149,0.55)', display: 'inline-block', flexShrink: 0 }} aria-hidden="true" />
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#14F195' }}>
                        Pre-launch
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#6E6E6E', marginTop: 1 }}>
                      Betting opens June 11, 2026
                    </p>
                  </div>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={close}
                  aria-label="Close"
                  style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #2A2A2A', background: '#111111', color: '#6E6E6E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.95rem', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* ── tabs ── */}
              <div style={{ display: 'flex', background: '#0B0B0B', borderBottom: '1px solid #1A1A1A' }}>
                {([
                  { id: 'markets', label: 'Community Picks' },
                  { id: 'lock',    label: 'Early Lock Bonus' },
                ] as const).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      flex: 1,
                      padding: '9px 6px',
                      border: 'none',
                      borderBottom: `2px solid ${tab === t.id ? '#F2B544' : 'transparent'}`,
                      background: 'transparent',
                      color: tab === t.id ? '#FFD36B' : '#6E6E6E',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'color 0.12s, border-color 0.12s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── body ── */}
              <div style={{ padding: '12px 12px 14px' }}>

                {/* MARKETS TAB */}
                {tab === 'markets' && (
                  <>
                    <CountdownStrip />

                    {/* match list */}
                    {FEATURED.map((m) => (
                      <MatchRow key={`${m.home.code}-${m.away.code}`} m={m} />
                    ))}

                    {/* small disclaimer */}
                    <p style={{ fontSize: '0.62rem', color: '#484F58', lineHeight: 1.5, margin: '8px 0 12px', padding: '6px 8px', borderRadius: 6, background: '#0B0B0B', border: '1px solid #161616' }}>
                      Cast your prediction before the market opens. Picks are saved to your device — lock $WCB now to convert them into real betting credits on June 11.
                    </p>

                    {/* stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>
                      {[
                        { v: '104', l: 'Markets' },
                        { v: '12',  l: 'Groups' },
                        { v: '48',  l: 'Nations' },
                      ].map((s) => (
                        <div key={s.l} style={{ padding: '8px 6px', borderRadius: 7, background: '#111111', border: '1px solid #2A2A2A', textAlign: 'center' }}>
                          <p style={{ fontSize: '1.05rem', fontWeight: 900, color: '#F2B544', lineHeight: 1 }}>{s.v}</p>
                          <p style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginTop: 3 }}>{s.l}</p>
                        </div>
                      ))}
                    </div>

                    <Link href="/matches" onClick={close} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 6, padding: '0.7rem' }}>
                      Pick All 104 Matches
                    </Link>
                    <Link href="/lock" onClick={close} className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}>
                      Lock $WCB — Get Early Credits
                    </Link>
                  </>
                )}

                {/* LOCK TAB */}
                {tab === 'lock' && (
                  <>
                    {/* rate cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {/* early */}
                      <div style={{ padding: '12px 10px', borderRadius: 10, background: 'rgba(242,181,68,0.07)', border: '1px solid rgba(242,181,68,0.28)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F2B544', marginBottom: 6 }}>
                          Now — Jun 10
                        </p>
                        <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFD36B', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                          {EARLY_TOKENS_PER_CREDIT}
                          <span style={{ fontSize: '0.75rem', color: '#B3B3B3', fontWeight: 700 }}>:1</span>
                        </p>
                        <p style={{ fontSize: '0.62rem', color: '#B3B3B3', marginTop: 4 }}>$WCB per credit</p>
                        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#14F195', display: 'inline-block', animation: 'live-pulse 1.4s ease-in-out infinite' }} aria-hidden="true" />
                          <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#14F195', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live now</span>
                        </div>
                      </div>

                      {/* post-launch */}
                      <div style={{ padding: '12px 10px', borderRadius: 10, background: '#111111', border: '1px solid #2A2A2A', textAlign: 'center', opacity: 0.65 }}>
                        <p style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E', marginBottom: 6 }}>
                          Jun 11+
                        </p>
                        <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6E6E6E', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                          {POST_LAUNCH_TOKENS_PER_CREDIT}
                          <span style={{ fontSize: '0.75rem', color: '#484F58', fontWeight: 700 }}>:1</span>
                        </p>
                        <p style={{ fontSize: '0.62rem', color: '#484F58', marginTop: 4 }}>$WCB per credit</p>
                        <div style={{ marginTop: 8, display: 'inline-flex', padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid #2A2A2A' }}>
                          <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#484F58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Post-launch</span>
                        </div>
                      </div>
                    </div>

                    {/* what you get — plain rows, no emoji overload */}
                    <div style={{ borderRadius: 10, border: '1px solid #1E1E1E', overflow: 'hidden', marginBottom: 12 }}>
                      {[
                        { label: 'Lock term',        value: `${FIXED_LOCK_DAYS} days fixed` },
                        { label: 'Lock provider',    value: 'Streamflow Finance' },
                        { label: 'Early multiplier', value: `${POST_LAUNCH_TOKENS_PER_CREDIT / EARLY_TOKENS_PER_CREDIT}× vs post-launch` },
                        { label: 'Credit use',       value: 'Betting balance from Jun 11' },
                        { label: 'Custody',          value: 'Non-custodial, on-chain' },
                      ].map((row, i, arr) => (
                        <div
                          key={row.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderBottom: i < arr.length - 1 ? '1px solid #161616' : 'none',
                            background: i % 2 === 0 ? '#0D0D0D' : '#0B0B0B',
                          }}
                        >
                          <span style={{ fontSize: '0.72rem', color: '#6E6E6E', fontWeight: 600 }}>{row.label}</span>
                          <span style={{ fontSize: '0.72rem', color: '#FFFFFF', fontWeight: 800 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* prize pool note */}
                    <div style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(153,69,255,0.07)', border: '1px solid rgba(153,69,255,0.2)', marginBottom: 12 }}>
                      <p style={{ fontSize: '0.72rem', color: '#DCCBFF', lineHeight: 1.55 }}>
                        <strong style={{ color: '#BFA7FF' }}>Prize pool:</strong> funded by $WCB creator fees from trading volume. Holders and lockers share rewards when markets go live.
                      </p>
                    </div>

                    <Link href="/lock" onClick={close} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 6, padding: '0.7rem' }}>
                      Lock $WCB — Earn Early Credits
                    </Link>
                    <a href={PUMPFUN} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}>
                      Buy $WCB on Pump.fun
                    </a>
                  </>
                )}
              </div>

              {/* ── footer ── */}
              <div style={{ padding: '8px 12px', borderTop: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0B0B0B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#9945FF', boxShadow: '0 0 7px rgba(153,69,255,0.45)', display: 'inline-block' }} aria-hidden="true" />
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#6E6E6E' }}>Built on Solana</span>
                </div>
                <button
                  onClick={close}
                  style={{ fontSize: '0.65rem', fontWeight: 600, color: '#484F58', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 6px', borderRadius: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#B3B3B3'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#484F58'; }}
                >
                  Don&apos;t show again
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
