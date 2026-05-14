'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchFilter, type MatchFilterValue } from '@/components/matches/MatchFilter';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
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
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Main */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
              <span style={{ display: 'inline-block', width: 4, height: 22, background: '#15803D', borderRadius: 2 }} aria-hidden="true" />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Match Center
              </h1>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginLeft: '0.875rem' }}>
              {all.length} matches · Predict any match and see community sentiment
            </p>
          </div>

          {/* Filter + count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <MatchFilter value={filter} onChange={setFilter} liveCount={liveCount} />
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>{filtered.length}</span> of <span style={{ fontWeight: 700, color: '#0F172A' }}>{all.length}</span> matches
            </p>
          </div>

          {/* Banner ad */}
          <div style={{ marginBottom: '1.25rem' }}>
            <ImagePlaceholder width="100%" height={90} label="Banner Ad 728×90" rounded={8} style={{ border: '1px solid #E2E8F0' }} />
          </div>

          {/* Matches */}
          {dateKeys.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚽</p>
              <p style={{ fontWeight: 700, color: '#0F172A' }}>No matches found</p>
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Try a different filter.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {dateKeys.map((date) => {
                const matches = grouped.get(date)!;
                return (
                  <div key={date}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                      <h2 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', margin: 0 }}>
                        {date}
                      </h2>
                      <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                        {matches.length} match{matches.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
                      {matches.map((m) => <MatchCard key={m.id} match={m} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '5.5rem' }}>
          {/* Token widget */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>$WCB Token</span>
              <Link href="/lock" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803D', textDecoration: 'none', padding: '0.15rem 0.5rem', borderRadius: 9999, background: '#DCFCE7' }}>
                Lock & Earn →
              </Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Lock $WCB to earn betting credits. Early lockers get 2× bonus.
            </p>
            <a href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.82rem', padding: '0.6rem 1rem' }}>
              Buy $WCB
            </a>
          </div>

          {/* Ad slots */}
          {[1, 2].map((i) => (
            <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <ImagePlaceholder width="100%" aspectRatio="4/3" label={`Sponsor Ad ${i}`} rounded={0} style={{ border: 'none', borderRadius: 0 }} />
              <div style={{ padding: '0.5rem 0.75rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: 0 }}>Advertisement</p>
              </div>
            </div>
          ))}

          {/* Quick nav */}
          <div className="card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: '0.5rem' }}>Navigate</p>
            {[
              { href: '/groups', label: '🌍 Group Stage' },
              { href: '/bracket', label: '🏆 Bracket' },
              { href: '/leaderboard', label: '📊 Leaderboard' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="sidebar-nav-link">
                {l.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
