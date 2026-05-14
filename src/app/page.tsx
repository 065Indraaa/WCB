import Link from 'next/link';
import { HeroSection } from '@/components/hero/HeroSection';
import { MatchCard } from '@/components/matches/MatchCard';
import { GroupCard } from '@/components/groups/GroupCard';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import { buildAllGroups } from '@/lib/groupHelpers';

export default function Home() {
  const featured = WC_2026_GROUP_MATCHES.slice(0, 6);
  const groups = buildAllGroups().slice(0, 4);

  return (
    <>
      <HeroSection />

      {/* Trust strip */}
      <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem 2.5rem' }}>
          {[
            '⚽ Official 48-team format',
            '◎ Built on Solana',
            '🚀 Launched on Pump.fun',
            '🇺🇸🇨🇦🇲🇽 USA · Canada · Mexico',
            '📡 Live match data',
          ].map((s) => (
            <span key={s} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Featured matches */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>⚽ Featured Matches</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Predict the opening fixtures
              </h2>
              <p style={{ color: '#64748B', marginTop: '0.375rem', fontSize: '0.95rem' }}>
                Cast your community vote on the matches everyone&apos;s talking about.
              </p>
            </div>
            <Link href="/matches" className="btn-secondary" style={{ flexShrink: 0 }}>
              View all matches →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {featured.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Groups preview */}
      <section style={{ padding: '5rem 1.5rem', background: '#F1F5F0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>🌍 Group Stage</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                12 groups. 48 nations. 1 trophy.
              </h2>
              <p style={{ color: '#64748B', marginTop: '0.375rem', fontSize: '0.95rem' }}>
                Track standings, qualified teams, and every match in your group.
              </p>
            </div>
            <Link href="/groups" className="btn-secondary" style={{ flexShrink: 0 }}>
              All 12 groups →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {groups.map((g) => (
              <GroupCard key={g.letter} group={g} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div
          className="card"
          style={{
            maxWidth: '56rem', margin: '0 auto',
            background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
            border: 'none', overflow: 'hidden',
          }}
        >
          <div style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem' }}>
              Get In Early
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
              Hold $WCB. Unlock everything.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.88)', marginBottom: '2rem', maxWidth: '36rem', margin: '0 auto 2rem' }}>
              Early holders get priority access when real betting goes live, exclusive NFT whitelist, and leaderboard tier badges.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: 12,
                  background: '#fff', color: '#15803D',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                🚀 Buy $WCB on Pump.fun
              </a>
              <Link
                href="/token"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: 12,
                  background: 'rgba(255,255,255,0.12)', color: '#fff',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                }}
              >
                Learn about $WCB
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
