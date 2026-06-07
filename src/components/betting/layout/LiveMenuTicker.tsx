'use client';

import { useEffect, useState } from 'react';
import type { Match } from '@/types/match';
import { TeamFlag } from '@/components/shared/TeamFlag';

interface LiveMenuTickerProps {
  matches: Match[];
}

function formatElapsed(m?: Match): string {
  if (!m || (m.displayStatus !== 'LIVE' && m.displayStatus !== 'HALFTIME')) return '';
  if (m.displayStatus === 'HALFTIME') return 'HT';
  if (m.elapsed != null) return `${m.elapsed}'`;
  return 'LIVE';
}

export function LiveMenuTicker({ matches }: LiveMenuTickerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (matches.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: 10,
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.18)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          borderBottom: '1px solid rgba(239,68,68,0.12)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#EF4444',
            boxShadow: '0 0 6px rgba(239,68,68,0.6)',
            display: 'inline-block',
            animation: 'live-pulse 1.4s ease-in-out infinite',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: '0.58rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#EF4444',
          }}
        >
          Live Now
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {matches.map((m) => (
          <a
            key={m.id}
            href={`/live-bets?match=${m.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              padding: '7px 10px',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(239,68,68,0.08)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <TeamFlag code={m.homeTeam.code} name={m.homeTeam.name} size="xs" />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {m.homeTeam.name}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: '#FFD36B',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: 16,
                  textAlign: 'center',
                }}
              >
                {m.score.home ?? 0}
              </span>
              <span
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  color: '#EF4444',
                  minWidth: 22,
                  textAlign: 'center',
                }}
              >
                {formatElapsed(m)}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  color: '#FFD36B',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: 16,
                  textAlign: 'center',
                }}
              >
                {m.score.away ?? 0}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                minWidth: 0,
                justifyContent: 'flex-end',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {m.awayTeam.name}
              </span>
              <TeamFlag code={m.awayTeam.code} name={m.awayTeam.name} size="xs" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
