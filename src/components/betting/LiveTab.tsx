'use client';

import { useMemo, useState } from 'react';
import { CountdownTimer } from '@/components/hero/CountdownTimer';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import type { Match } from '@/types/match';
import type { PredictionChoice } from '@/lib/predictions';
import { BettingMatchCard } from './BettingMatchCard';
import type { BetSelection } from './types';

interface LiveTabProps {
  liveMatches: Match[];
  loading: boolean;
  onSelect: (selection: BetSelection) => void;
  selectedMatchId?: number | null;
  selectedChoice?: PredictionChoice | null;
  onGoToSchedule: () => void;
}

function useNextMatch(): Match | null {
  const now = Date.now();
  return useMemo(() => {
    const upcoming = WC_2026_GROUP_MATCHES
      .filter((m) => new Date(m.kickoff).getTime() > now)
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    return upcoming[0] ?? null;
  }, []);
}

type FilterMode = 'all' | 'live' | 'upcoming';

export function LiveTab({ liveMatches, loading, onSelect, selectedMatchId, selectedChoice }: LiveTabProps) {
  const nextMatch = useNextMatch();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    if (filter === 'live') return liveMatches.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME');
    if (filter === 'upcoming') return liveMatches.filter((m) => m.displayStatus === 'UPCOMING');
    return liveMatches;
  }, [liveMatches, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = m.group ?? 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const liveCount = liveMatches.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME').length;
  const upcomingCount = liveMatches.filter((m) => m.displayStatus === 'UPCOMING').length;

  if (loading && liveMatches.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <div style={{ 
        padding: '2.5rem 1.5rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(242,181,68,0.03) 0%, transparent 100%)',
        border: '1px solid rgba(242,181,68,0.1)',
        borderRadius: 12
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.5 }}>⚽</div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', lineHeight: 1.3 }}>
          {nextMatch ? 'Next Match Coming Up' : 'No Live Matches'}
        </h2>
        {nextMatch ? (
          <>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 10, 
              margin: '16px 0 20px', 
              flexWrap: 'wrap',
              padding: '12px 16px',
              background: 'rgba(11,11,11,0.3)',
              borderRadius: 10,
              border: '1px solid rgba(42,42,42,0.5)',
              maxWidth: 360,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <TeamRow code={nextMatch.homeTeam.code} name={nextMatch.homeTeam.name} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6E6E6E' }}>vs</span>
              <TeamRow code={nextMatch.awayTeam.code} name={nextMatch.awayTeam.name} reverse />
            </div>
            <CountdownTimer targetDate={new Date(nextMatch.kickoff)} compact />
          </>
        ) : (
          <p style={{ fontSize: '0.8rem', color: '#B3B3B3', marginTop: 10, lineHeight: 1.5 }}>
            Check the schedule for upcoming fixtures
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Simplified Filter */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 20,
        padding: '6px',
        background: 'rgba(11,11,11,0.4)',
        borderRadius: 10,
        border: '1px solid rgba(42,42,42,0.6)'
      }}>
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={liveMatches.length} />
        {liveCount > 0 && (
          <FilterPill active={filter === 'live'} onClick={() => setFilter('live')} label="Live" count={liveCount} accent="#EF4444" />
        )}
        <FilterPill active={filter === 'upcoming'} onClick={() => setFilter('upcoming')} label="Soon" count={upcomingCount} />
      </div>

      {/* Matches grouped */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {grouped.map(([groupName, matches]) => (
          <section key={groupName}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              marginBottom: 12,
              padding: '8px 12px',
              background: 'linear-gradient(90deg, rgba(242,181,68,0.06) 0%, transparent 100%)',
              borderRadius: 8,
              border: '1px solid rgba(242,181,68,0.12)'
            }}>
              <div style={{
                width: 3,
                height: 16,
                borderRadius: 2,
                background: '#F2B544'
              }} />
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em', 
                color: '#F2B544',
                flex: 1
              }}>
                {groupName}
              </span>
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: '#6E6E6E',
                padding: '2px 8px',
                background: 'rgba(242,181,68,0.06)',
                borderRadius: 4
              }}>
                {matches.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {matches.map((m) => (
                <BettingMatchCard
                  key={m.id}
                  match={m}
                  onSelect={onSelect}
                  selectedChoice={selectedMatchId === m.id ? selectedChoice : null}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, accent }: { active: boolean; onClick: () => void; label: string; count: number; accent?: string }) {
  const accentColor = accent ?? '#F2B544';
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 'fit-content',
        padding: '8px 12px',
        borderRadius: 8,
        border: active ? `1.5px solid ${accentColor}` : '1.5px solid transparent',
        background: active 
          ? `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}08 100%)`
          : 'transparent',
        color: active ? (accent ? accentColor : '#FFD36B') : '#B3B3B3',
        fontSize: '0.75rem',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        boxShadow: active ? `0 0 16px ${accentColor}15` : 'none'
      }}
    >
      <span>{label}</span>
      <span style={{ 
        fontSize: '0.68rem', 
        fontWeight: 900, 
        padding: '2px 6px', 
        borderRadius: 4, 
        background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
        color: active ? 'inherit' : '#6E6E6E',
        minWidth: 20,
        textAlign: 'center' 
      }}>
        {count}
      </span>
    </button>
  );
}

function TeamRow({ code, name, reverse }: { code: string; name: string; reverse?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexDirection: reverse ? 'row-reverse' : 'row' }}>
      <TeamFlag code={code} name={name} size="sm" />
      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>{name}</span>
    </span>
  );
}

function SkeletonCard() {
  return (
    <div style={{ 
      padding: '16px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%), #0E0E0E',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      position: 'relative',
      overflow: 'hidden'
    }} aria-hidden="true">      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 80, height: 12, borderRadius: 6, background: 'rgba(26,26,26,0.8)' }} />
        <div style={{ width: 60, height: 12, borderRadius: 6, background: 'rgba(26,26,26,0.8)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ width: '38%', height: 16, borderRadius: 6, background: 'rgba(26,26,26,0.8)' }} />
        <div style={{ width: 50, height: 20, borderRadius: 6, background: 'rgba(26,26,26,0.8)' }} />
        <div style={{ width: '38%', height: 16, borderRadius: 6, background: 'rgba(26,26,26,0.8)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <div style={{ height: 52, borderRadius: 8, background: 'rgba(26,26,26,0.8)' }} />
        <div style={{ height: 52, borderRadius: 8, background: 'rgba(26,26,26,0.8)' }} />
        <div style={{ height: 52, borderRadius: 8, background: 'rgba(26,26,26,0.8)' }} />
      </div>
    </div>
  );
}
