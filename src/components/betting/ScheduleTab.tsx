'use client';

import { useMemo } from 'react';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { useMatches } from '@/lib/hooks/useMatches';
import { useOdds } from '@/lib/hooks/useOdds';
import type { Match } from '@/types/match';

function formatMatchDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMatchTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isPastMatch(m: Match): boolean {
  return m.displayStatus === 'FINISHED' || new Date(m.kickoff).getTime() < Date.now() - 105 * 60 * 1000;
}

function ScheduleMatchRow({ match }: { match: Match }) {
  const odds = useOdds(
    match.id,
    match.homeTeam.fifaRanking ?? 50,
    match.awayTeam.fifaRanking ?? 50,
    false,
    match.kickoff,
    match.displayStatus,
    match.elapsed
  );

  const isFinished = match.displayStatus === 'FINISHED';
  const isLive = match.displayStatus === 'LIVE' || match.displayStatus === 'HALFTIME';

  const outcomes = [
    { label: match.homeTeam.code ?? 'Home', value: odds.home, movement: odds.movement.home },
    { label: 'Draw', value: odds.draw, movement: odds.movement.draw },
    { label: match.awayTeam.code ?? 'Away', value: odds.away, movement: odds.movement.away },
  ];

  return (
    <div
      className="bet-card"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 12px',
        padding: '10px 14px',
      }}
    >
      {/* Time / Status */}
      <div style={{ minWidth: 60, flexShrink: 0 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          {formatMatchTime(match.kickoff)}
        </p>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6E6E6E', margin: '2px 0 0' }}>
          {isLive ? (
            <span style={{ color: '#EF4444' }}>LIVE {odds.elapsed ? `${odds.elapsed}'` : ''}</span>
          ) : isFinished ? (
            'FT'
          ) : (
            formatMatchTime(match.kickoff)
          )}
        </p>
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: '1 1 180px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <TeamFlag code={match.homeTeam.code} name={match.homeTeam.name} size="sm" />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {match.homeTeam.name}
          </span>
          {isFinished && match.score.home != null && (
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {match.score.home}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <TeamFlag code={match.awayTeam.code} name={match.awayTeam.name} size="sm" />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {match.awayTeam.name}
          </span>
          {isFinished && match.score.away != null && (
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFFFFF', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {match.score.away}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.6rem', color: '#6E6E6E', margin: '2px 0 0', fontWeight: 600 }}>
          {match.venue} · {match.group}
        </p>
      </div>

      {/* Odds */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 'auto' }}>
        {outcomes.map((o) => {
          const arrowColor = o.movement === 'up' ? '#14F195' : o.movement === 'down' ? '#EF4444' : '#6E6E6E';
          const arrow = o.movement === 'up' ? '▲' : o.movement === 'down' ? '▼' : '';
          return (
            <div
              key={o.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                padding: '5px 8px',
                borderRadius: 6,
                background: odds.suspended ? 'rgba(242,181,68,0.06)' : '#171717',
                border: `1px solid ${odds.suspended ? 'rgba(242,181,68,0.25)' : '#2A2A2A'}`,
              }}
            >
              <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#6E6E6E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {o.label}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: odds.suspended ? '#F2B544' : '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                {odds.suspended ? '—' : o.value}
              </span>
              {!odds.suspended && (
                <span style={{ fontSize: '0.5rem', fontWeight: 800, color: arrowColor, height: 8, lineHeight: 1 }}>
                  {arrow}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ScheduleTab() {
  const matchesQuery = useMatches({});
  const allMatches = matchesQuery.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of allMatches) {
      const dateKey = formatMatchDate(m.kickoff);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(m);
    }
    // Sort dates chronologically
    const entries = Array.from(map.entries());
    entries.sort((a, b) => {
      const da = new Date(a[1][0].kickoff).getTime();
      const db = new Date(b[1][0].kickoff).getTime();
      return da - db;
    });
    // Sort matches within each date by time
    for (const [, matches] of entries) {
      matches.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    }
    return entries;
  }, [allMatches]);

  if (matchesQuery.isLoading && allMatches.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bet-card" style={{ padding: 14, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 12 }}>
            <div style={{ width: 50, height: 12, borderRadius: 4, background: '#1A1A1A' }} />
            <div style={{ width: '80%', height: 12, borderRadius: 4, background: '#1A1A1A' }} />
            <div style={{ width: 60, height: 12, borderRadius: 4, background: '#1A1A1A' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {grouped.length === 0 && (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#B3B3B3', margin: 0 }}>No matches scheduled.</p>
        </div>
      )}

      {grouped.map(([dateLabel, matches]) => (
        <section key={dateLabel}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              padding: '0 2px',
            }}
          >
            <span
              style={{
                width: 3,
                height: 16,
                borderRadius: 2,
                background: '#F2B544',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#F2B544',
              }}
            >
              {dateLabel}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 700, color: '#6E6E6E' }}>
              {matches.length} match{matches.length === 1 ? '' : 'es'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matches.map((m) => (
              <ScheduleMatchRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
