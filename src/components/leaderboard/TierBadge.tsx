import type { Tier, Badge } from '@/types/leaderboard';

const TIER_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
  Bronze:   { bg: 'rgba(205,127,50,0.12)', border: 'rgba(205,127,50,0.35)', color: '#CD7F32', label: 'Bronze' },
  Silver:   { bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.35)', color: '#C0C0C0', label: 'Silver' },
  Gold:     { bg: 'rgba(255,215,0,0.12)',   border: 'rgba(255,215,0,0.35)',   color: '#FFD700', label: 'Gold' },
  Platinum: { bg: 'rgba(153,69,255,0.12)',  border: 'rgba(153,69,255,0.35)',  color: '#9945FF', label: 'Platinum' },
};

const BADGE_ICONS: Record<string, string> = {
  'Diamond Hands': '💎',
  'Early Bird': '🐦',
  'Whale': '🐋',
};

interface TierBadgeProps {
  tier: string;
}

export function TierBadge({ tier }: TierBadgeProps) {
  const s = TIER_STYLES[tier] ?? TIER_STYLES.Bronze;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: '0.65rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

interface BadgeListProps {
  badges: string[];
}

export function BadgeList({ badges }: BadgeListProps) {
  if (!badges.length) return <span style={{ color: '#484F58', fontSize: '0.75rem' }}>—</span>;
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {badges.map((b) => (
        <span key={b} title={b} style={{ fontSize: '0.85rem', lineHeight: 1 }}>
          {BADGE_ICONS[b] ?? '•'}
        </span>
      ))}
    </span>
  );
}
