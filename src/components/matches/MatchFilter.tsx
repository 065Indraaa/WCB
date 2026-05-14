'use client';

export type MatchFilterValue = 'all' | 'live' | 'upcoming' | 'finished';

interface MatchFilterProps {
  value: MatchFilterValue;
  onChange: (v: MatchFilterValue) => void;
  liveCount?: number;
}

const FILTERS: { id: MatchFilterValue; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'finished', label: 'Finished' },
];

export function MatchFilter({ value, onChange, liveCount = 0 }: MatchFilterProps) {
  return (
    <div
      className="inline-flex p-1 rounded-xl"
      style={{ background: '#F1F5F0', border: '1px solid #E2E8F0' }}
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
            className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={
              active
                ? { background: '#ffffff', color: '#0F172A', boxShadow: '0 1px 3px rgba(15,23,42,0.08)' }
                : { background: 'transparent', color: '#64748B' }
            }
          >
            {f.id === 'live' && <span className="live-dot" aria-hidden="true" />}
            {f.label}
            {f.id === 'live' && liveCount > 0 && (
              <span
                className="ml-0.5 text-white font-black leading-none"
                style={{
                  background: '#DC2626',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '9999px',
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
