'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { useOdds } from '@/lib/hooks/useOdds';
import { usePrevious } from '@/lib/hooks/usePrevious';
import type { PredictionChoice } from '@/lib/predictions';
import type { Match, MatchStatus } from '@/types/match';
import type { BetSelection } from './types';

function phaseLabel(status: MatchStatus): string {
  switch (status) {
    case '1H': return '1st Half';
    case '2H': return '2nd Half';
    case 'HT': return 'Half Time';
    case 'ET':
    case 'AET': return 'Extra Time';
    case 'PEN': return 'Penalties';
    default: return 'Live';
  }
}

function OddsButton({
  label,
  odds,
  movement,
  active,
  onClick,
  disabled,
  suspended,
}: {
  label: string;
  odds: string;
  movement: 'up' | 'down' | 'flat';
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  suspended?: boolean;
}) {
  const prev = usePrevious(odds);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (prev == null || prev === odds) return;
    const a = parseFloat(odds);
    const b = parseFloat(prev);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return;
    setFlash(a > b ? 'up' : 'down');
    const t = setTimeout(() => setFlash(null), 900);
    return () => clearTimeout(t);
  }, [odds, prev]);

  const flashBg = flash === 'up' ? 'rgba(20,241,149,0.18)' : flash === 'down' ? 'rgba(239,68,68,0.18)' : undefined;
  const flashBorder = flash === 'up' ? 'rgba(20,241,149,0.5)' : flash === 'down' ? 'rgba(239,68,68,0.5)' : undefined;

  if (suspended) {
    return (
      <button
        disabled
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
          minHeight: 52,
          padding: '8px 6px',
          borderRadius: 8,
          border: '1.5px solid rgba(242,181,68,0.35)',
          background: 'rgba(242,181,68,0.08)',
          color: '#F2B544',
          cursor: 'not-allowed',
          opacity: 0.7,
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F2B544' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>SUSPENDED</span>
      </button>
    );
  }

  const arrowColor = movement === 'up' ? '#14F195' : movement === 'down' ? '#EF4444' : 'transparent';
  const arrow = movement === 'up' ? '▲' : movement === 'down' ? '▼' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        width: '100%',
        minHeight: 52,
        padding: '8px 6px',
        borderRadius: 8,
        border: `1.5px solid ${active ? '#F2B544' : flashBorder ?? '#2A2A2A'}`,
        background: active ? 'rgba(242,181,68,0.12)' : flashBg ?? '#141414',
        color: active ? '#FFD36B' : '#FFFFFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      aria-label={`Bet ${label} at ${odds}`}
    >
      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: active ? 'rgba(255,211,107,0.7)' : '#6E6E6E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.92rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
        {odds}
      </span>
      <span style={{ fontSize: '0.55rem', fontWeight: 800, color: arrowColor, height: 10, lineHeight: 1 }}>
        {arrow}
      </span>
      {active && (
        <span style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: '50%', background: '#F2B544', border: '2px solid #070707' }} />
      )}
    </button>
  );
}

function isBettingOpen(match: Match, suspended: boolean): boolean {
  if (match.displayStatus === 'FINISHED') return false;
  if (suspended) return false;
  return true;
}

export function BettingMatchCard({ match, onSelect, selectedChoice }: BettingMatchCardProps) {
  const odds = useOdds(
    match.id,
    match.homeTeam.fifaRanking ?? 50,
    match.awayTeam.fifaRanking ?? 50,
    false,
    match.kickoff,
    match.displayStatus,
    match.elapsed
  );

  const isLive = match.displayStatus === 'LIVE' || match.displayStatus === 'HALFTIME';
  const officialHome = match.score.home;
  const officialAway = match.score.away;

  // Use simulated live score when official score is unavailable
  const homeScore = officialHome ?? odds.liveScore?.home ?? 0;
  const awayScore = officialAway ?? odds.liveScore?.away ?? 0;

  const bettingOpen = isBettingOpen(match, odds.suspended);

  const markets = [
    { choice: 'home' as PredictionChoice, label: match.homeTeam.code ?? 'Home', odds: odds.home, movement: odds.movement.home },
    { choice: 'draw' as PredictionChoice, label: 'Draw', odds: odds.draw, movement: odds.movement.draw },
    { choice: 'away' as PredictionChoice, label: match.awayTeam.code ?? 'Away', odds: odds.away, movement: odds.movement.away },
  ];

  return (
    <article
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%), #0E0E0E',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,181,68,0.20)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      {/* Meta bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E' }}>
          {match.group}
        </span>
        <StatusBadge status={match.displayStatus} elapsed={odds.elapsed ?? match.elapsed} />
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px' }}>
        {/* Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="md" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0, minWidth: 72 }}>
          {isLive || match.displayStatus === 'FINISHED' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AnimatedScore value={homeScore} />
              <span style={{ color: '#3A3A3A', fontWeight: 700, fontSize: '0.85rem' }}>—</span>
              <AnimatedScore value={awayScore} />
            </div>
          ) : (
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#6E6E6E', letterSpacing: '0.12em' }}>VS</span>
          )}
          <span style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: isLive ? '#EF4444' : '#6E6E6E' }}>
            {phaseLabel(match.status)}
          </span>
        </div>

        {/* Away */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
            {match.awayTeam.name}
          </span>
          <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="md" />
        </div>
      </div>

      {/* Suspension banner */}
      {odds.suspended && odds.suspensionReason && (
        <div style={{ padding: '0 14px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, background: 'rgba(242,181,68,0.08)', border: '1px solid rgba(242,181,68,0.25)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F2B544' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F2B544', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {odds.suspensionReason}
            </span>
          </div>
        </div>
      )}

      {/* Odds */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 14px 12px' }}>
        {markets.map((m) => (
          <OddsButton
            key={m.choice}
            label={m.label}
            odds={m.odds}
            movement={m.movement}
            active={selectedChoice === m.choice}
            disabled={!bettingOpen}
            suspended={odds.suspended}
            onClick={() => onSelect({ match, choice: m.choice, odds: m.odds })}
          />
        ))}
      </div>
    </article>
  );
}

function StatusBadge({ status, elapsed }: { status: Match['displayStatus']; elapsed?: number }) {
  const isLive = status === 'LIVE';
  const isHT = status === 'HALFTIME';

  const bg = isLive ? 'rgba(239,68,68,0.12)' : isHT ? 'rgba(242,181,68,0.10)' : 'rgba(255,255,255,0.03)';
  const color = isLive ? '#EF4444' : isHT ? '#F2B544' : '#6E6E6E';
  const border = isLive ? 'rgba(239,68,68,0.22)' : isHT ? 'rgba(242,181,68,0.18)' : 'rgba(255,255,255,0.06)';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: bg, color, border: `1px solid ${border}`, fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {isLive && <span className="live-dot" style={{ width: 5, height: 5 }} aria-hidden="true" />}
      {elapsed != null ? `${elapsed}'` : isHT ? 'HT' : isLive ? 'LIVE' : 'Upcoming'}
    </span>
  );
}

function AnimatedScore({ value }: { value: number }) {
  const prev = usePrevious(value);
  const changed = prev != null && prev !== value;
  return (
    <motion.span
      key={value}
      initial={changed ? { scale: 1.4, color: '#14F195' } : false}
      animate={{ scale: 1, color: '#FFFFFF' }}
      transition={{ duration: 0.35 }}
      style={{ fontSize: '1.5rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1, minWidth: 22, textAlign: 'center' }}
    >
      {value}
    </motion.span>
  );
}

interface BettingMatchCardProps {
  match: Match;
  onSelect: (selection: BetSelection) => void;
  selectedChoice?: PredictionChoice | null;
}
