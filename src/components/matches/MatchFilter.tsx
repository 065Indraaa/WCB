'use client';

export type MatchFilterValue = 'all' | 'live' | 'upcoming' | 'finished';

interface MatchFilterProps {
  value: MatchFilterValue;
  onChange: (v: MatchFilterValue) => void;
  liveCount?: number;
}

const FILTERS: { id: MatchFilterValue; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'live',     label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'finished', label: 'Finished' },
];

export function MatchFilter({ value, onChange, liveCount = 0 }: MatchFilterProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '3px',
        borderRadius: 6,
        background: '#161B22',
        border: '1px solid #30363D',
        gap: 2,
      }}
      role="tablist"
    >
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 4,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.1s ease',
              background: active ? '#238636' : 'transparent',
              color: active ? '#ffffff' : '#8B949E',
              whiteSpace: 'nowrap',
            }}
          >
            {f.id === 'live' && (
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: active ? '#ffffff' : '#DA3633',
                  animation: 'live-pulse 1.4s ease-in-out infinite',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
            )}
            {f.label}
            {f.id === 'live' && liveCount > 0 && (
              <span
                style={{
                  background: active ? 'rgba(255,255,255,0.25)' : '#DA3633',
                  color: '#ffffff',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 3,
                  lineHeight: 1.4,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {liveCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
