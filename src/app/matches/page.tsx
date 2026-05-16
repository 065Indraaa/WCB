'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchFilter, type MatchFilterValue } from '@/components/matches/MatchFilter';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import { EARLY_TOKENS_PER_CREDIT, FIXED_LOCK_DAYS, POST_LAUNCH_TOKENS_PER_CREDIT } from '@/lib/lock';
import type { Match } from '@/types/match';

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

export default function MatchesPage() {
  const [filter, setFilter] = useState<MatchFilterValue>('all');
  const all = WC_2026_GROUP_MATCHES;
  const liveCount = all.filter((m) => m.displayStatus === 'LIVE').length;

  const filtered = useMemo(() => {
    if (filter === 'all') return all;
    if (filter === 'live') return all.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME');
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
    <div className="page-layout">

      {/* Main column */}
      <div>
        {/* Page header */}
        <div style={{ marginBottom: '16px' }}>
          <div className="section-header">
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E6EDF3', margin: 0 }}>
              Match Center
            </h1>
          </div>
          <p style={{ color: '#B3B3B3', fontSize: '0.8rem', marginTop: 4 }}>
            {all.length} matches / Pre-launch prices are sentiment previews. Live betting opens June 11, 2026.
          </p>
        </div>

        {/* Filter bar + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <MatchFilter value={filter} onChange={setFilter} liveCount={liveCount} />
          <p style={{ fontSize: '0.75rem', color: '#484F58', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontWeight: 700, color: '#E6EDF3' }}>{filtered.length}</span>
            {' '}of{' '}
            <span style={{ fontWeight: 700, color: '#E6EDF3' }}>{all.length}</span>
            {' '}matches
          </p>
        </div>

        {/* Leaderboard banner ad */}
        <div style={{ marginBottom: '16px' }}>
          <ImagePlaceholder
            width="100%"
            height={90}
            label="Opening Line Watch 728 x 90"
            rounded={6}
          />
        </div>

        {/* Match list */}
        {dateKeys.length === 0 ? (
          <div className="bet-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: '#E6EDF3' }}>No matches found</p>
            <p style={{ color: '#8B949E', fontSize: '0.875rem' }}>Try a different filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {dateKeys.map((date) => {
              const matches = grouped.get(date)!;
              return (
                <div key={date}>
                  {/* Date header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58', margin: 0, whiteSpace: 'nowrap' }}>
                      {date}
                    </h2>
                    <div style={{ flex: 1, height: 1, background: '#21262D' }} />
                    <span style={{ fontSize: '0.65rem', color: '#484F58', fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {matches.length} match{matches.length !== 1 ? 'es' : ''}
                    </span>
                  </div>

                  {/* Match rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {matches.map((m) => <MatchCard key={m.id} match={m} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="page-sidebar">
        {/* Token widget */}
        <div className="bet-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8B949E' }}>$WCB Token</span>
            <Link
              href="/lock"
              style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FFD36B', textDecoration: 'none', padding: '2px 8px', borderRadius: 3, background: 'rgba(242,181,68,0.1)', border: '1px solid rgba(242,181,68,0.24)' }}
            >
              Lock & Earn
            </Link>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#8B949E', lineHeight: 1.5, marginBottom: '10px' }}>
            Lock $WCB for {FIXED_LOCK_DAYS} days to earn platform credits. Before launch: {EARLY_TOKENS_PER_CREDIT}:1, after launch: {POST_LAUNCH_TOKENS_PER_CREDIT}:1.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
          >
            Buy $WCB
          </a>
        </div>

        {/* Ad slots */}
        {[
          'Live Ticket Zone 300 x 250',
          'Sharp Lock Desk 300 x 250',
        ].map((label) => (
          <div key={label} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #30363D' }}>
            <ImagePlaceholder
              width="100%"
              aspectRatio="6/5"
              label={label}
              rounded={0}
              style={{ border: 'none', borderRadius: 0 }}
            />
            <div style={{ padding: '5px 8px', background: '#161B22', borderTop: '1px solid #21262D' }}>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58', margin: 0 }}>Advertisement</p>
            </div>
          </div>
        ))}

        {/* Quick nav */}
        <div className="bet-card" style={{ padding: '10px' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58', marginBottom: '6px' }}>Navigate</p>
          {[
            { href: '/groups',      label: 'Group Stage' },
            { href: '/bracket',     label: 'Bracket' },
            { href: '/leaderboard', label: 'Leaderboard' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="sidebar-nav-link">
              {l.label}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
