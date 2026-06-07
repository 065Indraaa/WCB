'use client';

import { TierBadge, BadgeList } from './TierBadge';
import { formatWallet } from '@/lib/utils/formatters';
import { WCB_SOLSCAN_TOKEN_URL } from '@/lib/tokenConfig';
import type { Tier, Badge } from '@/types/leaderboard';

export interface LeaderboardEntryData {
  rank: number;
  address: string;
  displayAddress: string;
  holdings: number;
  tier: Tier;
  badges: Badge[];
  isLocker?: boolean;
}

interface LeaderboardEntryProps {
  entry: LeaderboardEntryData;
}

export function LeaderboardEntry({ entry }: LeaderboardEntryProps) {
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        borderBottom: '1px solid #1A1A1A',
        background: isTop3 ? 'rgba(242,181,68,0.04)' : undefined,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#0F0F0F';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isTop3 ? 'rgba(242,181,68,0.04)' : '';
      }}
    >
      {/* Rank */}
      <div
        className="flex-shrink-0 text-center"
        style={{ width: 32 }}
      >
        {entry.rank <= 3 ? (
          <span style={{ fontSize: '1rem' }}>
            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
          </span>
        ) : (
          <span
            className="font-black tabular-nums"
            style={{ color: '#6E6E6E', fontSize: '0.85rem' }}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Wallet */}
      <div className="flex-1 min-w-0">
        <a
          href={`${WCB_SOLSCAN_TOKEN_URL}?holder=${entry.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold font-mono truncate block"
          style={{ color: '#B3B3B3', textDecoration: 'none' }}
          title={entry.address}
        >
          {entry.displayAddress}
        </a>
        {entry.isLocker && (
          <span className="text-xs" style={{ color: '#F2B544' }} title="Also a locker">
            🔒
          </span>
        )}
      </div>

      {/* Holdings */}
      <div
        className="text-right flex-shrink-0"
        style={{ minWidth: 80 }}
      >
        <span
          className="font-black tabular-nums text-sm"
          style={{ color: '#FFFFFF' }}
        >
          {entry.holdings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Tier */}
      <div className="hidden sm:block flex-shrink-0">
        <TierBadge tier={entry.tier} />
      </div>

      {/* Badges */}
      <div className="hidden sm:block flex-shrink-0" style={{ width: 64 }}>
        <BadgeList badges={entry.badges} />
      </div>
    </div>
  );
}
