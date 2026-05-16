import Link from 'next/link';
import { FIXED_LOCK_DAYS } from '@/lib/lock';

export default function TokenPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div
        className="premium-panel"
        style={{
          borderRadius: 16,
          padding: '1.5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 16% 18%, rgba(242,181,68,0.16), transparent 30%), radial-gradient(circle at 84% 24%, rgba(20,241,149,0.11), transparent 28%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-eyebrow" style={{ marginBottom: 10 }}>
            $WCB Token
          </p>
          <h1
            className="text-4xl sm:text-5xl"
            style={{ color: '#FFFFFF', fontWeight: 950, lineHeight: 1, marginBottom: '0.85rem' }}
          >
            Token details coming soon.
          </h1>
          <p style={{ color: '#B3B3B3', fontSize: '1rem', lineHeight: 1.75, maxWidth: 720, marginBottom: '1.25rem' }}>
            The public contract address and live chart are temporarily hidden while the token page is prepared for the final launch configuration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '1.25rem' }}>
            {[
              { label: 'Contract', value: 'Coming Soon', color: '#FFD36B' },
              { label: 'Network', value: 'Solana', color: '#14F195' },
              { label: 'Lock Term', value: `${FIXED_LOCK_DAYS} Days`, color: '#9945FF' },
            ].map((item) => (
              <div
                key={item.label}
                className="card"
                style={{
                  padding: '1rem',
                  background: '#111111',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <p style={{ color: '#6E6E6E', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  {item.label}
                </p>
                <p style={{ color: item.color, fontSize: '1rem', fontWeight: 900, margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/lock" className="btn-primary">
              Lock &amp; Earn Credits
            </Link>
            <Link href="/matches" className="btn-secondary">
              View Match Markets
            </Link>
            <Link href="/leaderboard" className="btn-secondary">
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
