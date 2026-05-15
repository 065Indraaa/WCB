import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/hero/HeroSection';
import { MatchCard } from '@/components/matches/MatchCard';
import { GroupCard } from '@/components/groups/GroupCard';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WC_2026_GROUP_MATCHES } from '@/lib/constants/matches2026';
import { buildAllGroups } from '@/lib/groupHelpers';
import { WalletRedirectHandler } from '@/components/shared/WalletRedirectHandler';
import { TokenPriceWidget } from '@/components/token/TokenPriceWidget';

// Promo banner
function PromoBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #070707 0%, #111111 50%, #070707 100%)',
        borderBottom: '1px solid rgba(242,181,68,0.14)',
        padding: '7px 16px',
      }}
    >
      <div className="promo-banner-inner" style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {[
          'Pre-launch market previews are open',
          'Betting activates June 11, 2026',
          'Lock $WCB to reserve betting credits',
          'Leaderboard tiers track wallet activity',
        ].map((t) => (
          <span key={t} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B3B3B3', whiteSpace: 'nowrap' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// Sidebar ad slot
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

function SportsbookPreview() {
  const metrics = [
    { label: 'Markets', value: '104' },
    { label: 'Credit Rate', value: '1:100' },
    { label: 'Network', value: 'Solana' },
  ];

  return (
    <section style={{ background: '#070707', borderBottom: '1px solid #2A2A2A' }}>
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '32px 16px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 0.85fr)',
          gap: '24px',
          alignItems: 'center',
        }}
        className="sportsbook-preview-grid"
      >
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 8 }}>
            Market Preview
          </p>
          <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 2.2rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.12 }}>
            Market previews before the opening line.
          </h2>
          <p style={{ color: '#B3B3B3', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 560, marginBottom: 18 }}>
            WCB shows pre-launch sentiment, indicative prices, wallet-based credits, and on-chain token access in one clean matchday interface.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, maxWidth: 520 }}>
            {metrics.map((item) => (
              <div key={item.label} style={{ background: '#111111', border: '1px solid #2A2A2A', borderRadius: 12, padding: '14px 12px' }}>
                <div style={{ color: '#F2B544', fontSize: '1.15rem', fontWeight: 900, lineHeight: 1 }}>{item.value}</div>
                <div style={{ color: '#6E6E6E', fontSize: '0.64rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(242,181,68,0.2)', background: '#111111', boxShadow: '0 24px 70px rgba(0,0,0,0.42)' }}>
          <Image
            src="/sportsbook-board.svg"
            alt="WCB sportsbook market board preview"
            width={1200}
            height={520}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>
    </section>
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
      <SportsbookPreview />

      {/* Main content with sidebar */}
      <div className="page-layout">

        {/* Main column */}
        <div>

          {/* Featured matches */}
          <section style={{ marginBottom: '24px' }}>
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F0FDF4', margin: 0, flex: 1 }}>
                Pre-launch market board
              </h2>
              <Link href="/matches" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F2B544', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                All matches
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
              label="Leaderboard Banner 728 x 90"
              rounded={6}
            />
          </div>

          {/* Groups */}
          <section style={{ marginBottom: '24px' }}>
            <div className="section-header gold" style={{ marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F0FDF4', margin: 0, flex: 1 }}>
                12 groups. 48 nations. One champion.
              </h2>
              <Link href="/groups" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F59E0B', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                All groups
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
                borderRadius: 10,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
                border: '1px solid rgba(242,181,68,0.22)',
                boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
              }}
            >
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#F2B544', marginBottom: '6px' }}>
                  Early access window
                </p>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 900, color: '#F0FDF4', marginBottom: '10px', lineHeight: 1.2 }}>
                  Early holders get priority access.
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#B3B3B3', marginBottom: '16px', maxWidth: '32rem', lineHeight: 1.7 }}>
                  Betting opens on June 11, 2026. Lock $WCB now to reserve credits and prepare for the first market window.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Buy $WCB
                  </a>
                  <Link href="/lock" className="btn-secondary">
                    Lock &amp; Earn Credits
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="page-sidebar">

          {/* Token price widget */}
          <TokenPriceWidget />

          {/* Ad slot 1 */}
          <SidebarAdSlot label="Sponsor Ad 300 x 250" />

          {/* Quick links */}
          <div className="bet-card" style={{ padding: '10px' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', marginBottom: '6px' }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { href: '/matches',     label: 'All Matches',       badge: '72' },
                { href: '/groups',      label: 'Group Stage',       badge: '12' },
                { href: '/bracket',     label: 'Knockout Bracket',  badge: null },
                { href: '/docs',        label: 'Docs',              badge: null },
                { href: '/lock',        label: 'Lock & Earn',       badge: 'NEW' },
                { href: '/leaderboard', label: 'Leaderboard',       badge: null },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="sidebar-nav-link">
                  {l.label}
                  {l.badge && (
                    <span style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: l.badge === 'NEW' ? 'rgba(20,241,149,0.12)' : 'rgba(255,255,255,0.04)',
                      color: l.badge === 'NEW' ? '#14F195' : '#6E6E6E',
                      border: l.badge === 'NEW' ? '1px solid rgba(20,241,149,0.24)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {l.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Ad slot 2 */}
          <SidebarAdSlot label="Sponsor Ad 300 x 250" />

        </aside>
      </div>
    </>
  );
}
