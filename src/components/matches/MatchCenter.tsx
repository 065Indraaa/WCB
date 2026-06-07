'use client';

import { useState, useMemo } from 'react';
import { MatchCard } from './MatchCard';
import { MatchFilter, type MatchFilterValue } from './MatchFilter';
import type { Match } from '@/types/match';

interface MatchCenterProps {
  matches: Match[];
}

function utcDateKey(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return `${days[t.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function groupByDate(matches: Match[]) {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = utcDateKey(m.kickoff);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  map.forEach((list: Match[]) => {
    list.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  });
  return map;
}

export function MatchCenter({ matches }: MatchCenterProps) {
  const [filter, setFilter] = useState<MatchFilterValue>('all');
  const liveCount = matches.filter((m) => m.displayStatus === 'LIVE').length;

  const filtered = useMemo(() => {
    if (filter === 'all') return matches;
    if (filter === 'live') return matches.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME');
    if (filter === 'upcoming') return matches.filter((m) => m.displayStatus === 'UPCOMING');
    if (filter === 'finished') return matches.filter((m) => m.displayStatus === 'FINISHED');
    return matches;
  }, [matches, filter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const dateKeys = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => {
      const ad = new Date(grouped.get(a)![0].kickoff).getTime();
      const bd = new Date(grouped.get(b)![0].kickoff).getTime();
      return ad - bd;
    });
  }, [grouped]);

  return (
    <section id="match-center" className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-6">
          <p className="section-eyebrow mb-2">Match Center</p>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Live Matches & Fixtures
          </h2>
          <p className="text-base max-w-2xl" style={{ color: '#B3B3B3' }}>
            Follow every World Cup 2026 match with live scores, previews, and community sentiment.
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <MatchFilter value={filter} onChange={setFilter} liveCount={liveCount} />
          <p style={{ fontSize: '0.75rem', color: '#484F58', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontWeight: 700, color: '#E6EDF3' }}>{filtered.length}</span>
            {' '}of{' '}
            <span style={{ fontWeight: 700, color: '#E6EDF3' }}>{matches.length}</span>
            {' '}matches
          </p>
        </div>

        {dateKeys.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: '#E6EDF3' }}>No matches found</p>
            <p style={{ color: '#8B949E', fontSize: '0.875rem' }}>Try a different filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {dateKeys.map((date) => {
              const list = grouped.get(date)!;
              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#484F58',
                        margin: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {date}
                    </h3>
                    <div style={{ flex: 1, height: 1, background: '#21262D' }} />
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: '#484F58',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {list.length} match{list.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {list.map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
