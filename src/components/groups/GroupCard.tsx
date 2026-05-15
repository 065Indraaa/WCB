'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { GroupStandingsTable } from './GroupStandingsTable';
import type { Group } from '@/types/standings';

interface GroupCardProps {
  group: Group;
  defaultExpanded?: boolean;
  hideExpand?: boolean;
}

export function GroupCard({ group, defaultExpanded = false, hideExpand = false }: GroupCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => { if (!hideExpand) setExpanded((e) => !e); };

  return (
    <div className="card card-hover overflow-hidden">
      {/* Header */}
      <div
        onClick={toggle}
        role={!hideExpand ? 'button' : undefined}
        aria-expanded={!hideExpand ? expanded : undefined}
        tabIndex={!hideExpand ? 0 : undefined}
        onKeyDown={(e) => {
          if (!hideExpand && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggle();
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          background: '#111111',
          borderBottom: '1px solid #2A2A2A',
          cursor: !hideExpand ? 'pointer' : 'default',
        }}
      >
        {/* Letter + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: '#F2B544',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#070707', fontWeight: 900, fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            {group.letter}
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#F2B544' }}>
              Group
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
              {group.teams.length} Teams
            </p>
          </div>
        </div>

        {/* Flags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          {group.teams.map((row) => (
            <TeamFlag key={row.team.id} code={row.team.code} name={row.team.name} size="sm" />
          ))}
        </div>

        {/* Chevron */}
        {!hideExpand && (
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: '#F2B544', fontSize: '0.7rem', marginLeft: 'auto', flexShrink: 0 }}
            aria-hidden="true"
          >
            V
          </motion.span>
        )}
      </div>

      {/* Standings table */}
      <GroupStandingsTable rows={group.teams} showQualified compact={!expanded && !defaultExpanded} />

      {/* Expanded: match schedule */}
      {!hideExpand && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="matches"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              style={{ overflow: 'hidden', borderTop: '1px solid #2A2A2A' }}
            >
              <div style={{ padding: '1rem 1.25rem', background: '#111111' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6E6E6E', marginBottom: '0.75rem' }}>
                  Match Schedule
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.matches.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#B3B3B3', textAlign: 'center', padding: '0.75rem 0' }}>
                      No matches scheduled yet.
                    </p>
                  ) : (
                    group.matches.slice(0, 6).map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: '0.5rem', background: '#171717', border: '1px solid #2A2A2A',
                          borderRadius: 10, padding: '0.5rem 0.75rem', fontSize: '0.8rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
                          <span style={{ fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.homeTeam.name}
                          </span>
                          <TeamFlag code={m.homeTeam.code} name={m.homeTeam.name} size="xs" />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#6E6E6E', fontWeight: 600, flexShrink: 0 }}>
                          {(() => {
                            const d = new Date(m.kickoff);
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
                          })()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, minWidth: 0 }}>
                          <TeamFlag code={m.awayTeam.code} name={m.awayTeam.name} size="xs" />
                          <span style={{ fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href={`/groups/${group.letter.toLowerCase()}`}
                  style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#F2B544', textDecoration: 'none' }}
                >
                  View full Group {group.letter}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
