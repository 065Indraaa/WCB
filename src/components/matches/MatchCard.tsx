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

/** UTC kickoff string — identical on server and client, no hydration mismatch */
function utcKickoff(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date = `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return { date, time: `${hh}:${mm} UTC` };
}

export function MatchCard({ match }: MatchCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Live prediction data — updates instantly when any vote is cast
  const { pct, myChoice, total, loaded } = usePrediction(
    match.id,
    match.homeTeam.fifaRanking,
    match.awayTeam.fifaRanking,
  );

  const showScore =
    match.displayStatus === 'LIVE' ||
    match.displayStatus === 'HALFTIME' ||
    match.displayStatus === 'FINISHED';

  const { date, time } = utcKickoff(match.kickoff);

  return (
    <>
      <article
        className="card card-hover overflow-hidden flex flex-col"
        aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      >
        {/* Status strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
            {match.group}
          </span>
          <span className={statusBadgeClass(match.displayStatus)}>
            {match.displayStatus === 'LIVE' && <span className="live-dot" aria-hidden="true" />}
            {statusLabel(match.displayStatus, match.elapsed)}
          </span>
        </div>

        {/* Teams + score/time */}
        <div style={{ padding: '1.25rem 1rem 0.75rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            {/* Home */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
              <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="lg" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                {match.homeTeam.name}
              </span>
            </div>

            {/* Score / kickoff */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 72 }}>
              {showScore ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                    {match.score.home ?? 0}
                  </span>
                  <span style={{ color: '#CBD5E1', fontWeight: 700, fontSize: '1.25rem' }}>–</span>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                    {match.score.away ?? 0}
                  </span>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                    {date}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A', marginTop: '0.125rem' }}>
                    {time}
                  </span>
                </>
              )}
            </div>

            {/* Away */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
              <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="lg" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </div>

        {/* Community prediction bar */}
        <div style={{ padding: '0 1rem 0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>
              Community
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#CBD5E1' }}>
              {loaded ? `${total.toLocaleString()} votes` : '…'}
            </span>
          </div>

          {/* 3-segment animated bar */}
          <div style={{ display: 'flex', height: 8, borderRadius: 9999, overflow: 'hidden', background: '#E2E8F0' }}>
            <motion.div
              style={{ background: '#22C55E', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.home}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              style={{ background: '#F59E0B', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.draw}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              style={{ background: '#7C3AED', height: '100%' }}
              initial={false}
              animate={{ width: `${pct.away}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.375rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803D' }}>{pct.home}%</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8' }}>{pct.draw}% draw</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7C3AED' }}>{pct.away}%</span>
          </div>
        </div>

        {/* Venue */}
        <div style={{ padding: '0 1rem 0.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.venue}>
            📍 {match.venue}
          </p>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 1rem 1rem' }}>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary w-full"
            style={{ fontSize: '0.85rem', padding: '0.625rem 1rem', justifyContent: 'center' }}
            aria-label={`Predict ${match.homeTeam.name} vs ${match.awayTeam.name}`}
          >
            {myChoice ? (
              <>✅ Voted · Change Pick</>
            ) : (
              <>🎯 Predict this match</>
            )}
          </button>
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
