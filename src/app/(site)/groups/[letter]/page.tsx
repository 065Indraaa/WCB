import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GroupStandingsTable } from '@/components/groups/GroupStandingsTable';
import { MatchCard } from '@/components/matches/MatchCard';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { getGroupByLetter, buildAllGroups } from '@/lib/groupHelpers';

interface PageProps {
  params: { letter: string };
}

export function generateStaticParams() {
  return buildAllGroups().map((g) => ({ letter: g.letter.toLowerCase() }));
}

export function generateMetadata({ params }: PageProps) {
  const letter = params.letter.toUpperCase();
  return {
    title: `Group ${letter} | World Cup 2026`,
    description: `All teams, standings, and matches for Group ${letter} of the 2026 FIFA World Cup.`,
  };
}

export default function GroupDetailPage({ params }: PageProps) {
  const group = getGroupByLetter(params.letter);
  if (!group) notFound();

  const venue = group.matches[0]?.venue;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: '#64748B' }}
        aria-label="Breadcrumb"
      >
        <Link
          href="/groups"
          className="font-semibold transition-colors"
          style={{ color: '#64748B', textDecoration: 'none' }}
        >
          Groups
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold" style={{ color: '#FFFFFF' }}>
          Group {group.letter}
        </span>
      </nav>

      {/* Header card */}
      <div
        className="rounded-2xl p-8 mb-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
          border: '1px solid rgba(242,181,68,0.26)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
        }}
      >
        <div className="flex items-center gap-5 flex-wrap">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black"
            style={{
              background: '#F2B544',
              color: '#070707',
              fontSize: '3rem',
              boxShadow: '0 20px 40px -8px rgba(242,181,68,0.28)',
            }}
          >
            {group.letter}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-bold uppercase tracking-widest mb-1"
              style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}
            >
              Group Stage
            </p>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: '#ffffff' }}
            >
              Group {group.letter}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.25rem' }}>
              {group.teams.length} teams | {group.matches.length} matches
              {venue ? ` | ${venue.split(',')[0]}` : ''}
            </p>
          </div>
        </div>

        {/* Team flags row */}
        <div
          className="flex flex-wrap items-center gap-4 mt-6 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          {group.teams.map((row) => (
            <div
              key={row.team.id}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <TeamFlag code={row.team.code} name={row.team.name} size="sm" />
              <span className="text-sm font-bold" style={{ color: '#ffffff' }}>
                {row.team.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Standings */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4" style={{ color: '#FFFFFF' }}>
          Standings
        </h2>
        <div className="card overflow-hidden">
          <GroupStandingsTable rows={group.teams} showQualified />
        </div>
        <p className="text-xs mt-3" style={{ color: '#B3B3B3' }}>
          Top 2 teams qualify automatically. Best third-placed teams may also advance.
        </p>
      </section>

      {/* Matches */}
      <section>
        <h2 className="text-2xl font-black mb-4" style={{ color: '#FFFFFF' }}>
          All Matches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {group.matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
