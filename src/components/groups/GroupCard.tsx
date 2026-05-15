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
          background: 'rgba(220,252,231,0.4)',
          borderBottom: '1px solid #E2E8F0',
          cursor: !hideExpand ? 'pointer' : 'default',
        }}
      >
        {/* Letter + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: '#15803D',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            {group.letter}
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#15803D' }}>
              Group
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
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
            style={{ color: '#64748B', fontSize: '0.7rem', marginLeft: 'auto', flexShrink: 0 }}
            aria-hidden="true"
          >
            ▼
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
              style={{ overflow: 'hidden', borderTop: '1px solid #E2E8F0' }}
            >
              <div style={{ padding: '1rem 1.25rem', background: '#F1F5F0' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748B', marginBottom: '0.75rem' }}>
                  Match Schedule
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.matches.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', padding: '0.75rem 0' }}>
                      No matches scheduled yet.
                    </p>
                  ) : (
                    group.matches.slice(0, 6).map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: '0.5rem', background: '#fff', border: '1px solid #E2E8F0',
                          borderRadius: 10, padding: '0.5rem 0.75rem', fontSize: '0.8rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
                          <span style={{ fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.homeTeam.name}
                          </span>
                          <TeamFlag code={m.homeTeam.code} name={m.homeTeam.name} size="xs" />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, flexShrink: 0 }}>
                          {(() => {
                            const d = new Date(m.kickoff);
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
                          })()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, minWidth: 0 }}>
                          <TeamFlag code={m.awayTeam.code} name={m.awayTeam.name} size="xs" />
                          <span style={{ fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  href={`/groups/${group.letter.toLowerCase()}`}
                  style={{ display: 'block', marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#15803D', textDecoration: 'none' }}
                >
                  View full Group {group.letter} →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
