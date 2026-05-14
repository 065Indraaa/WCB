'use client';

import { useState, useMemo } from 'react';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchFilter, type MatchFilterValue } from '@/components/matches/MatchFilter';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import type { Match } from '@/types/match';

/** UTC-based date key — identical on server and client */
function utcDateKey(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // getUTCDay() returns 0=Sun, need to compute day of week from UTC date
  const y = d.getUTCFullYear();
  const mo = d.getUTCMonth();
  const da = d.getUTCDate();
  // Zeller-like: compute day of week for UTC date
  const t = new Date(Date.UTC(y, mo, da));
  const dow = days[t.getUTCDay()];
  return `${dow}, ${months[mo]} ${da}, ${y}`;
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

export default function MatchesPage() {
  const [filter, setFilter] = useState<MatchFilterValue>('all');

  const all = WC_2026_GROUP_MATCHES;
  const liveCount = all.filter((m) => m.displayStatus === 'LIVE').length;

  const filtered = useMemo(() => {
    if (filter === 'all') return all;
    if (filter === 'live')
      return all.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME');
    if (filter === 'upcoming') return all.filter((m) => m.displayStatus === 'UPCOMING');
    if (filter === 'finished') return all.filter((m) => m.displayStatus === 'FINISHED');
    return all;
  }, [all, filter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const dateKeys = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => {
      const ad = new Date(grouped.get(a)![0].kickoff).getTime();
      const bd = new Date(grouped.get(b)![0].kickoff).getTime();
      return ad - bd;
    });
  }, [grouped]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">⚽ Match Center</p>
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{ color: '#0F172A' }}
        >
          Every match of World Cup 2026
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#64748B' }}>
          Live scores, upcoming kickoffs, and full results. Predict any match and see how the community is voting.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <MatchFilter value={filter} onChange={setFilter} liveCount={liveCount} />
        <p className="text-sm" style={{ color: '#64748B' }}>
          Showing{' '}
          <span className="font-bold" style={{ color: '#0F172A' }}>{filtered.length}</span>
          {' '}of{' '}
          <span className="font-bold" style={{ color: '#0F172A' }}>{all.length}</span>
          {' '}matches
        </p>
      </div>

      {/* Matches grouped by date */}
      {dateKeys.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4" aria-hidden="true">⚽</p>
          <p className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>No matches found</p>
          <p style={{ color: '#64748B' }}>Try a different filter to see more matches.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {dateKeys.map((date) => {
            const matches = grouped.get(date)!;
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-5">
                  <h2
                    className="text-base font-bold uppercase tracking-widest"
                    style={{ color: '#64748B' }}
                  >
                    {date}
                  </h2>
                  <div className="flex-1 field-divider" />
                  <span className="text-sm font-semibold" style={{ color: '#64748B' }}>
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {matches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
