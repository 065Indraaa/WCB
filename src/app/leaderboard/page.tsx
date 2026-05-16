import Link from 'next/link';

const PANELS = [
  { label: 'Tracked Holders', value: 'Coming Soon', sub: 'Holder sync paused' },
  { label: 'Platform Credits', value: 'Coming Soon', sub: 'Credit sync paused' },
  { label: 'Prize Pool', value: 'Coming Soon', sub: 'Creator-fee sync paused' },
];

export default function LeaderboardPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="premium-panel" style={{ padding: '1.45rem', borderRadius: 16, marginBottom: '1.5rem' }}>
        <p className="section-eyebrow mb-2">Ranking Center</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ color: '#FFFFFF' }}>
          $WCB Leaderboards
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
          Holder leaderboard, lock leaderboard, and creator-fee prize pool data are temporarily hidden while the final token configuration is prepared.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 14 }}>
          <span className="data-pill">Holder source: Coming Soon</span>
          <span className="data-pill">Lock source: Coming Soon</span>
          <span className="data-pill">Mint: Coming Soon</span>
        </div>
      </div>

      <div className="stats-grid-3" style={{ marginBottom: '1.5rem' }}>
        {PANELS.map((panel) => (
          <div key={panel.label} className="card" style={{ padding: '1.25rem', textAlign: 'center', minHeight: 108 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F2B544' }}>{panel.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', marginTop: '0.25rem' }}>{panel.label}</div>
            <div style={{ fontSize: '0.72rem', color: '#8A8A8A', marginTop: 4 }}>{panel.sub}</div>
          </div>
        ))}
      </div>

      <div className="card p-10 text-center" style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.35rem' }}>
          Live ranking data is coming soon
        </p>
        <p style={{ fontSize: '0.85rem', color: '#B3B3B3', maxWidth: 620, margin: '0 auto' }}>
          This page no longer reads holder accounts, Streamflow locks, or creator-fee metrics until the new CA is ready.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/token" className="btn-primary">
          Token Status
        </Link>
        <Link href="/matches" className="btn-secondary">
          View Matches
        </Link>
      </div>
    </section>
  );
}
