'use client';

import { TeamFlag } from '@/components/shared/TeamFlag';
import type { StandingsRow } from '@/types/standings';

interface GroupStandingsTableProps {
  rows: StandingsRow[];
  showQualified?: boolean;
  compact?: boolean;
}

export function GroupStandingsTable({ rows, showQualified = true, compact = false }: GroupStandingsTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }} aria-label="Group standings">
        <thead>
          <tr style={{ borderBottom: '1px solid #2A2A2A', background: '#111111' }}>
            <th style={thStyle}>#</th>
            <th style={{ ...thStyle, textAlign: 'left', paddingLeft: '0.5rem' }}>Team</th>
            <th style={thStyle} title="Played">P</th>
            {!compact && <th style={thStyle} title="Wins">W</th>}
            {!compact && <th style={thStyle} title="Draws">D</th>}
            {!compact && <th style={thStyle} title="Losses">L</th>}
            {!compact && <th style={thStyle} title="Goals For">GF</th>}
            {!compact && <th style={thStyle} title="Goals Against">GA</th>}
            <th style={thStyle} title="Goal Difference">GD</th>
            <th style={{ ...thStyle, fontWeight: 900, color: '#FFFFFF' }} title="Points">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const qualified = showQualified && row.position <= 2;
            return (
              <tr
                key={row.team.id}
                style={{
                  borderBottom: '1px solid rgba(226,232,240,0.5)',
                  background: qualified ? 'rgba(242,181,68,0.07)' : undefined,
                  transition: 'background 0.15s',
                }}
              >
                <td style={{ ...tdStyle, fontWeight: 700, color: qualified ? '#F2B544' : '#6E6E6E' }}>
                  {row.position}
                </td>
                <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    <TeamFlag code={row.team.code} name={row.team.name} size="sm" />
                    <span style={{ fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.team.name}
                    </span>
                    {qualified && (
                      <span
                        style={{
                          flexShrink: 0, padding: '1px 5px', borderRadius: 4,
                          fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
                          background: '#F2B544', color: '#070707', letterSpacing: '0.05em',
                        }}
                      >
                        Q
                      </span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>{row.played}</td>
                {!compact && <td style={tdStyle}>{row.wins}</td>}
                {!compact && <td style={tdStyle}>{row.draws}</td>}
                {!compact && <td style={tdStyle}>{row.losses}</td>}
                {!compact && <td style={tdStyle}>{row.goalsFor}</td>}
                {!compact && <td style={tdStyle}>{row.goalsAgainst}</td>}
                <td style={{
                  ...tdStyle,
                  fontWeight: 600,
                  color: row.goalDifference > 0 ? '#14F195' : row.goalDifference < 0 ? '#EF4444' : '#6E6E6E',
                }}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td style={{ ...tdStyle, fontWeight: 900, color: '#FFFFFF' }}>
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.375rem',
  textAlign: 'center',
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6E6E6E',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 0.375rem',
  textAlign: 'center',
  color: '#B3B3B3',
  fontVariantNumeric: 'tabular-nums',
};
