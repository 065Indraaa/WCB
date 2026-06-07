'use client';

import { useMemo } from 'react';
import type { RecentActivity } from '@/lib/hooks/useLiveBettingMenu';

const TYPE_COLORS: Record<RecentActivity['type'], string> = {
  bet_placed: '#B3B3B3',
  bet_won: '#14F195',
  bet_lost: '#EF4444',
  bet_cancelled: '#6E6E6E',
};

const TYPE_ICONS: Record<RecentActivity['type'], string> = {
  bet_placed: '•',
  bet_won: '↑',
  bet_lost: '↓',
  bet_cancelled: '×',
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

interface RecentActivityFeedProps {
  activity: RecentActivity[];
}

export function RecentActivityFeed({ activity }: RecentActivityFeedProps) {
  const items = useMemo(() => activity.slice(0, 4), [activity]);

  if (items.length === 0) return null;

  return (
    <div>
      <p
        style={{
          fontSize: '0.58rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#6E6E6E',
          margin: '0 0 8px 4px',
        }}
      >
        Recent Activity
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              padding: '5px 8px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: TYPE_COLORS[item.type],
                  flexShrink: 0,
                  width: 14,
                  textAlign: 'center',
                }}
              >
                {TYPE_ICONS[item.type]}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#B3B3B3',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: TYPE_COLORS[item.type],
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.amount.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  color: '#484F58',
                  minWidth: 28,
                  textAlign: 'right',
                }}
              >
                {timeAgo(item.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
