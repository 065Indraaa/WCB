'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { PredictionModal } from '@/components/predictions/PredictionModal';
import { usePrediction } from '@/lib/hooks/usePrediction';
import type { Match, MatchDisplayStatus } from '@/types/match';

export interface MatchCardProps {
  match: Match;
}

function statusBadgeClass(status: MatchDisplayStatus) {
  switch (status) {
    case 'LIVE':     return 'badge badge-live';
    case 'HALFTIME': return 'badge badge-halftime';
    case 'FINISHED': return 'badge badge-finished';
    default:         return 'badge badge-upcoming';
  }
}

function statusLabel(status: MatchDisplayStatus, elapsed?: number) {
  switch (status) {
    case 'LIVE':     return elapsed != null ? `${elapsed}'` : 'LIVE';
    case 'HALFTIME': return 'HT';
    case 'FINISHED': return 'FT';
    default:         return 'UPCOMING';
  }
}

/** UTC kickoff, no hydration mismatch. */
function utcKickoff(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return { date, time: `${hh}:${mm}` };
}

export function MatchCard({ match }: MatchCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const { pct, previewOdds, myChoice, total, loaded } = usePrediction(
    match.id,
    match.homeTeam.fifaRanking,
    match.awayTeam.fifaRanking,
  );

  const showScore =
    match.displayStatus === 'LIVE' ||
    match.displayStatus === 'HALFTIME' ||
    match.displayStatus === 'FINISHED';

  const { date, time } = utcKickoff(match.kickoff);
  const isLive = match.displayStatus === 'LIVE';

  return (
    <>
      {/* Compact horizontal bet row */}
      <article
        className="bet-card"
        aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setModalOpen(true)}
      >
        {/* Top strip: group + status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px 10px',
            background: '#0B0B0B',
            borderBottom: '1px solid #2A2A2A',
          }}
        >
          <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E6E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
            {match.group}
          </span>
          <span className={statusBadgeClass(match.displayStatus)}>
            {isLive && <span className="live-dot" aria-hidden="true" />}
            {statusLabel(match.displayStatus, match.elapsed)}
          </span>
        </div>

        {/* Main row: teams + score/time + predict button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 10px',
            gap: 8,
            minHeight: 64,
          }}
        >
          {/* Home team */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
            <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="sm" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score / time */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56, gap: 2 }}>
            {showScore ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F0FDF4', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {match.score.home ?? 0}
                </span>
                <span style={{ color: '#6E6E6E', fontWeight: 700, fontSize: '0.9rem' }}>-</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F0FDF4', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {match.score.away ?? 0}
                </span>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6E6E6E' }}>
                  {date}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#B3B3B3', fontVariantNumeric: 'tabular-nums' }}>
                  {time}
                </span>
                <span style={{ fontSize: '0.55rem', color: '#6E6E6E', fontWeight: 600 }}>UTC</span>
              </>
            )}
          </div>

          {/* Away team */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {match.awayTeam.name}
            </span>
            <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="sm" />
          </div>

          {/* Preview odds */}
          <button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            className={`odds-btn${myChoice ? ' active' : ''}`}
            style={{ flexShrink: 0, marginLeft: 4 }}
            aria-label={`Open market preview for ${match.homeTeam.name} vs ${match.awayTeam.name}`}
          >
            <span className="odds-label">Preview</span>
            <span style={{ fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>
              {previewOdds.home}
            </span>
          </button>
        </div>

        {/* Community prediction bar */}
        <div style={{ padding: '0 10px 8px' }}>
          <div style={{ display: 'flex', height: 4, borderRadius: 9999, overflow: 'hidden', background: '#2A2A2A' }}>
            <motion.div
              style={{ background: '#F2B544', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.home}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              style={{ background: '#C8922E', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.draw}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              style={{ background: '#9945FF', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.away}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#F2B544', fontVariantNumeric: 'tabular-nums' }}>{pct.home}%</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#6E6E6E', fontVariantNumeric: 'tabular-nums' }}>
              {loaded ? `${total.toLocaleString()} votes` : '...'} / pre-launch sentiment
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9945FF', fontVariantNumeric: 'tabular-nums' }}>{pct.away}%</span>
          </div>
        </div>

        {/* Venue, desktop only via CSS */}
        <div
          style={{ padding: '0 10px 7px', display: 'none' }}
          className="md:block"
        >
          <p style={{ fontSize: '0.62rem', color: '#6E6E6E', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.venue}>
            {match.venue}
          </p>
        </div>
      </article>

      <PredictionModal
        match={match}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
