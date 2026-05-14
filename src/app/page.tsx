import Link from 'next/link';
import { HeroSection } from '@/components/hero/HeroSection';
import { MatchCard } from '@/components/matches/MatchCard';
import { GroupCard } from '@/components/groups/GroupCard';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import { buildAllGroups } from '@/lib/groupHelpers';
import { WalletRedirectHandler } from '@/components/shared/WalletRedirectHandler';

// ── Promo Banner ──────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #15803D 0%, #16a34a 60%, #D97706 100%)',
      padding: '0.625rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
    }}>
      {[
        '🎁 Early lockers get 2× credit bonus',
        '⚽ 104 matches to predict',
        '🔒 Lock $WCB → Earn betting credits',
        '🏆 Leaderboard prizes for top predictors',
      ].map((t) => (
        <span key={t} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
          {t}
        </span>
      ))}
    </div>
  );
}

// ── Sidebar Ad Slot ───────────────────────────────────────────────────────────
function SidebarAdSlot({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      background: '#F8FAFC',
    }}>
      <ImagePlaceholder
        width="100%"
        aspectRatio="4/3"
        label={label}
        rounded={0}
        style={{ border: 'none', borderRadius: 0 }}
      />
      <div style={{ padding: '0.625rem 0.75rem', borderTop: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: 0 }}>
          Advertisement
        </p>
      </div>
    </div>
  );
}

// ── Quick Stats Bar ───────────────────────────────────────────────────────────
function QuickStats() {
  const stats = [
    { label: 'Teams', value: '48', icon: '🌍' },
    { label: 'Groups', value: '12', icon: '📊' },
    { label: 'Matches', value: '104', icon: '⚽' },
    { label: 'Host Cities', value: '16', icon: '🏟️' },
    { label: 'Days to Kickoff', value: '27', icon: '⏱' },
    { label: 'Prize Pool', value: '$TBA', icon: '🏆' },
  ];

  return (
    <div style={{
      background: '#0F172A',
      padding: '0.75rem 1.5rem',
      overflowX: 'auto',
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        minWidth: 'fit-content',
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1.25rem',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#22C55E', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const featured = WC_2026_GROUP_MATCHES.slice(0, 6);
  const groups = buildAllGroups().slice(0, 4);

  return (
    <>
      <WalletRedirectHandler />
      <PromoBanner />
      <HeroSection />
      <QuickStats />

      {/* Main content with sidebar */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Main column ── */}
          <div>
            {/* Featured matches */}
            <section style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '2px solid #15803D' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ display: 'inline-block', width: 4, height: 20, background: '#15803D', borderRadius: 2 }} aria-hidden="true" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Pick your winners before everyone else does.
                  </h2>
                </div>
                <Link href="/matches" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803D', textDecoration: 'none' }}>
                  All matches →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {featured.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>

            {/* Banner ad slot */}
            <div style={{ marginBottom: '2.5rem' }}>
              <ImagePlaceholder
                width="100%"
                height={120}
                label="Banner Ad — 728×90"
                rounded={10}
                style={{ border: '1px solid #E2E8F0' }}
              />
            </div>

            {/* Groups */}
            <section style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '2px solid #D97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ display: 'inline-block', width: 4, height: 20, background: '#D97706', borderRadius: 2 }} aria-hidden="true" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    12 groups. 48 countries. One winner takes it all.
                  </h2>
                </div>
                <Link href="/groups" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D97706', textDecoration: 'none' }}>
                  All groups →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {groups.map((g) => (
                  <GroupCard key={g.letter} group={g} />
                ))}
              </div>
            </section>

            {/* Early adopter CTA */}
            <section>
              <div style={{
                borderRadius: 16,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                border: '1px solid rgba(34,197,94,0.2)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0',
              }}>
                <div style={{ padding: '2rem 2.5rem' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#22C55E', marginBottom: '0.5rem' }}>
                    You&apos;re early
                  </p>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.15 }}>
                    You&apos;re early. That matters.
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', maxWidth: '32rem', lineHeight: 1.6 }}>
                    Betting goes live June 11, 2026. The people who hold $WCB now get priority access, lower fees, and leaderboard tier badges that latecomers can&apos;t earn.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 10, background: '#22C55E', color: '#0F172A', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                      🚀 Buy $WCB
                    </a>
                    <Link href="/lock" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                      🔒 Lock & Earn Credits
                    </Link>
                  </div>
                </div>
                <div style={{ width: 200, flexShrink: 0 }}>
                  <ImagePlaceholder
                    width={200}
                    height="100%"
                    label="Promo Image"
                    rounded={0}
                    style={{ border: 'none', borderRadius: 0, minHeight: 200, background: 'rgba(255,255,255,0.05)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '5.5rem' }}>

            {/* Token price widget */}
            <div className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>$WCB Token</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 9999, background: '#DCFCE7', color: '#15803D' }}>LIVE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { label: 'Price', value: '$0.000042' },
                  { label: '24h', value: '+4.2%', green: true },
                  { label: 'Holders', value: '1,250' },
                  { label: 'Mkt Cap', value: '$420K' },
                ].map((s) => (
                  <div key={s.label} style={{ padding: '0.5rem', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8' }}>{s.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: s.green ? '#15803D' : '#0F172A', marginTop: '0.125rem' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <a href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '0.875rem', fontSize: '0.82rem', padding: '0.6rem 1rem' }}>
                Buy $WCB on Pump.fun
              </a>
            </div>

            {/* Ad slot 1 */}
            <SidebarAdSlot label="Sponsor Ad 300×250" />

            {/* Quick links */}
            <div className="card" style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: '0.625rem' }}>Quick Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {[
                  { href: '/matches', label: '⚽ All Matches', badge: '72' },
                  { href: '/groups', label: '🌍 Group Stage', badge: '12' },
                  { href: '/bracket', label: '🏆 Knockout Bracket', badge: null },
                  { href: '/lock', label: '🔒 Lock & Earn', badge: 'NEW' },
                  { href: '/leaderboard', label: '📊 Leaderboard', badge: null },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="sidebar-nav-link">
                    {l.label}
                    {l.badge && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 9999, background: l.badge === 'NEW' ? '#DCFCE7' : '#F1F5F0', color: l.badge === 'NEW' ? '#15803D' : '#64748B' }}>
                        {l.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad slot 2 */}
            <SidebarAdSlot label="Sponsor Ad 300×250" />
          </aside>
        </div>
      </div>
    </>
  );
}
