import Link from 'next/link';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { buildAllGroups } from '@/lib/groupHelpers';

export const metadata = { title: 'Groups | World Cup 2026' };

export default function GroupsPage() {
  const groups = buildAllGroups();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">Group Stage</p>
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{ color: '#FFFFFF' }}
        >
          12 groups. 48 nations.
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
          The road to the knockout stage. The top two teams from each group and the eight best third-placed teams advance to the Round of 32.
        </p>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {groups.map((g) => (
          <Link
            key={g.letter}
            href={`/groups/${g.letter.toLowerCase()}`}
            className="card card-hover overflow-hidden"
            style={{ textDecoration: 'none' }}
          >
            {/* Letter header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: '#111111',
                borderBottom: '1px solid #2A2A2A',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                  style={{ background: '#F2B544', color: '#070707' }}
                >
                  {g.letter}
                </div>
                <div>
                  <p
                    className="font-bold uppercase tracking-widest"
                    style={{ fontSize: '10px', color: '#F2B544' }}
                  >
                    Group
                  </p>
                  <p className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                    {g.teams.length} Teams
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#F2B544' }}>
                View
              </span>
            </div>

            {/* Teams list */}
            <div className="p-5 space-y-3">
              {g.teams.map((row) => (
                <div key={row.team.id} className="flex items-center gap-3">
                  <TeamFlag code={row.team.code} name={row.team.name} size="sm" />
                  <span
                    className="text-sm font-semibold truncate flex-1"
                    style={{ color: '#FFFFFF' }}
                  >
                    {row.team.name}
                  </span>
                  <span className="text-xs" style={{ color: '#6E6E6E' }}>
                    #{row.team.fifaRanking}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3"
              style={{ background: '#111111', borderTop: '1px solid #2A2A2A' }}
            >
              <p className="text-xs text-center" style={{ color: '#B3B3B3' }}>
                {g.matches.length} matches | {g.matches[0]?.venue?.split(',')[0] ?? 'TBA'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
