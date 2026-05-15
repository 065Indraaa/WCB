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
    <div
      style={{
        background: 'linear-gradient(90deg, #0D2818 0%, #1A3A20 50%, #1A2A0D 100%)',
        borderBottom: '1px solid #238636',
        padding: '8px 16px',
      }}
    >
      <div className="promo-banner-inner" style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {[
          '🎁 Early lockers get 2× credit bonus',
          '⚽ 104 matches to predict',
          '🔒 Lock $WCB → Earn betting credits',
          '🏆 Leaderboard prizes for top predictors',
        ].map((t) => (
          <span key={t} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E6EDF3', whiteSpace: 'nowrap' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Quick Stats Bar ───────────────────────────────────────────────────────────
function QuickStats() {
  const stats = [
    { label: 'Teams',       value: '48',   icon: '🌍' },
    { label: 'Groups',      value: '12',   icon: '📊' },
    { label: 'Matches',     value: '104',  icon: '⚽' },
    { label: 'Host Cities', value: '16',   icon: '🏟️' },
    { label: 'Days Left',   value: '27',   icon: '⏱' },
    { label: 'Prize Pool',  value: '$TBA', icon: '🏆' },
  ];

  return (
    <div
      style={{
        background: '#161B22',
        borderBottom: '1px solid #21262D',
        padding: '0',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'stretch',
          minWidth: 'fit-content',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRight: i < stats.length - 1 ? '1px solid #21262D' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#238636', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar Ad Slot ───────────────────────────────────────────────────────────
function SidebarAdSlot({ label }: { label: string }) {
  return (
    <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #30363D' }}>
      <ImagePlaceholder
        width="100%"
        aspectRatio="6/5"
        label={label}
        rounded={0}
        style={{ border: 'none', borderRadius: 0 }}
      />
      <div style={{ padding: '5px 8px', background: '#161B22', borderTop: '1px solid #21262D' }}>
        <p style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58', margin: 0 }}>
          Advertisement
        </p>
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
      <div className="page-layout">

        {/* ── Main column ── */}
        <div>

          {/* Featured matches */}
          <section style={{ marginBottom: '24px' }}>
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E6EDF3', margin: 0, flex: 1 }}>
                Pick your winners before everyone else does
              </h2>
              <Link href="/matches" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#238636', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                All matches →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {featured.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>

          {/* Banner ad */}
          <div style={{ marginBottom: '24px' }}>
            <ImagePlaceholder
              width="100%"
              height={90}
              label="Leaderboard Banner 728×90"
              rounded={6}
            />
          </div>

          {/* Groups */}
          <section style={{ marginBottom: '24px' }}>
            <div className="section-header gold" style={{ marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E6EDF3', margin: 0, flex: 1 }}>
                12 groups · 48 countries · One winner
              </h2>
              <Link href="/groups" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D29922', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                All groups →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
              }}
            >
              {groups.map((g) => (
                <GroupCard key={g.letter} group={g} />
              ))}
            </div>
          </section>

          {/* Early adopter CTA */}
          <section style={{ marginBottom: '24px' }}>
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
                border: '1px solid rgba(35,134,54,0.3)',
              }}
            >
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#238636', marginBottom: '6px' }}>
                  You&apos;re early
                </p>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 900, color: '#E6EDF3', marginBottom: '10px', lineHeight: 1.2 }}>
                  Early holders get priority access.
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#8B949E', marginBottom: '16px', maxWidth: '32rem', lineHeight: 1.6 }}>
                  Betting goes live June 11, 2026. Hold $WCB now for priority access, lower fees, and leaderboard tier badges that latecomers can&apos;t earn.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    🚀 Buy $WCB
                  </a>
                  <Link href="/lock" className="btn-secondary">
                    🔒 Lock &amp; Earn Credits
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* ── Sidebar ── */}
        <aside className="page-sidebar">

          {/* Token price widget */}
          <div className="bet-card" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8B949E' }}>$WCB Token</span>
              <span className="live-badge" style={{ fontSize: '0.6rem' }}>LIVE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              {[
                { label: 'Price',   value: '$0.000042' },
                { label: '24h',     value: '+4.2%',  green: true },
                { label: 'Holders', value: '1,250' },
                { label: 'Mkt Cap', value: '$420K' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '7px 8px', background: '#161B22', borderRadius: 4, border: '1px solid #21262D' }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#484F58' }}>{s.label}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: s.green ? '#238636' : '#E6EDF3', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <a
              href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
            >
              Buy $WCB on Pump.fun
            </a>
          </div>

          {/* Ad slot 1 */}
          <SidebarAdSlot label="Sponsor Ad 300×250" />

          {/* Quick links */}
          <div className="bet-card" style={{ padding: '10px' }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#484F58', marginBottom: '6px' }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { href: '/matches',     label: '⚽ All Matches',      badge: '72' },
                { href: '/groups',      label: '🌍 Group Stage',       badge: '12' },
                { href: '/bracket',     label: '🏆 Knockout Bracket',  badge: null },
                { href: '/lock',        label: '🔒 Lock & Earn',       badge: 'NEW' },
                { href: '/leaderboard', label: '📊 Leaderboard',       badge: null },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="sidebar-nav-link">
                  {l.label}
                  {l.badge && (
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 3,
                      background: l.badge === 'NEW' ? 'rgba(35,134,54,0.15)' : '#21262D',
                      color: l.badge === 'NEW' ? '#238636' : '#484F58',
                      border: l.badge === 'NEW' ? '1px solid rgba(35,134,54,0.2)' : '1px solid #30363D',
                    }}>
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
    </>
  );
}
