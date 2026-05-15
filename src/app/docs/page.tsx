import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Docs | WORLDCUPBET',
  description:
    'Learn how WORLDCUPBET works, including pre-launch predictions, $WCB credits, locking, leaderboards, and World Cup 2026 market access.',
};

const GOLD = '#F2B544';
const GOLD_SOFT = '#FFD36B';
const TEXT = '#FFFFFF';
const TEXT_SOFT = '#B3B3B3';
const TEXT_MUTED = '#6E6E6E';
const SURFACE = '#111111';
const CARD = '#171717';

function DocsButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={primary ? 'btn-primary' : 'btn-secondary'}
      style={{ minWidth: 150 }}
    >
      {children}
    </Link>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card" style={{ padding: '1.5rem', background: CARD }}>
      <p className="section-eyebrow" style={{ marginBottom: 8 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: TEXT, marginBottom: '0.85rem' }}>
        {title}
      </h2>
      <div style={{ color: TEXT_SOFT, lineHeight: 1.75, fontSize: '0.95rem' }}>
        {children}
      </div>
    </section>
  );
}

function StepCard({
  code,
  title,
  body,
}: {
  code: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card" style={{ padding: '1.15rem', background: SURFACE }}>
      <div style={{ color: GOLD, fontSize: '0.72rem', fontWeight: 900, marginBottom: 10 }}>
        {code}
      </div>
      <h3 style={{ color: TEXT, fontWeight: 900, fontSize: '1rem', marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ color: TEXT_SOFT, lineHeight: 1.65, fontSize: '0.88rem', margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid #2A2A2A',
      }}
    >
      <span style={{ color: TEXT_MUTED, fontSize: '0.82rem', fontWeight: 700 }}>{label}</span>
      <span style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 800, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <section
        style={{
          borderRadius: 18,
          border: '1px solid rgba(242,181,68,0.24)',
          background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: '2rem',
          boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
        }}
      >
        <p className="section-eyebrow" style={{ marginBottom: 10 }}>
          WCB Documentation
        </p>
        <h1
          style={{
            color: TEXT,
            fontSize: 'clamp(2.1rem, 5vw, 4rem)',
            lineHeight: 1.08,
            fontWeight: 900,
            marginBottom: '1rem',
            maxWidth: 820,
          }}
        >
          What WORLDCUPBET is, how it works, and what happens before launch.
        </h1>
        <p style={{ color: TEXT_SOFT, fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 760 }}>
          WORLDCUPBET is a Solana-native football prediction and betting platform built around
          World Cup 2026. Before real-money betting opens, users can review fixtures, follow
          pre-launch market sentiment, connect a wallet, lock $WCB, and prepare credits for the
          opening market window.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <DocsButton href="/matches" primary>
            View Markets
          </DocsButton>
          <DocsButton href="/lock">Lock $WCB</DocsButton>
          <DocsButton href="/token">Token Details</DocsButton>
        </div>
      </section>

      <div className="docs-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1rem', alignItems: 'start' }}>
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SectionCard eyebrow="Overview" title="The core idea">
            <p style={{ marginBottom: '0.8rem' }}>
              The platform is designed for one clear event: World Cup 2026. The product combines
              match previews, community prediction data, indicative market prices, wallet-based
              credit allocation, and $WCB token utility.
            </p>
            <p style={{ margin: 0 }}>
              The current experience is a pre-launch environment. It helps users understand the
              tournament board and prepare wallet access before betting markets open on June 11,
              2026.
            </p>
          </SectionCard>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StepCard
              code="01"
              title="Review the market board"
              body="Browse fixtures, groups, kickoff times, venue data, sentiment bars, and indicative pre-launch prices."
            />
            <StepCard
              code="02"
              title="Connect a wallet"
              body="Use a Solana wallet to access wallet-based features, future market access, credits, and lock history."
            />
            <StepCard
              code="03"
              title="Lock $WCB early"
              body="Early lockers reserve credits before launch and receive enhanced credit treatment during the opening window."
            />
          </section>

          <SectionCard eyebrow="Markets" title="Pre-launch predictions and indicative prices">
            <p style={{ marginBottom: '0.8rem' }}>
              Match cards show community sentiment before betting goes live. The percentages are
              based on prediction activity and seeded market interest, while the displayed prices
              are indicative previews only.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              This keeps the product useful before launch without presenting live betting as active.
              Once markets open, the match interface becomes the primary betting surface.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <DocsButton href="/matches" primary>
                Open Matches
              </DocsButton>
              <DocsButton href="/groups">View Groups</DocsButton>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Locking" title="Why early locking matters">
            <p style={{ marginBottom: '0.8rem' }}>
              Locking $WCB before launch is designed to reward early commitment. Credits are the
              platform-side balance prepared for the first betting window, and early locks receive
              preferential credit treatment before tournament markets open.
            </p>
            <div
              style={{
                border: '1px solid rgba(242,181,68,0.26)',
                background: 'rgba(242,181,68,0.08)',
                borderRadius: 12,
                padding: '1rem',
                margin: '1rem 0',
              }}
            >
              <h3 style={{ color: GOLD_SOFT, fontWeight: 900, fontSize: '1rem', marginBottom: 6 }}>
                Early lock benefit
              </h3>
              <p style={{ margin: 0 }}>
                Lock during the pre-launch window to receive a launch credit bonus. The early-lock
                path is built for users who want their credits ready before the first World Cup
                markets open.
              </p>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              The lock flow is non-custodial through Streamflow Finance. You choose an amount and
              duration, review the credit estimate, then complete the lock on-chain.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <DocsButton href="/lock" primary>
                Calculate Credits
              </DocsButton>
              <DocsButton href="/leaderboard">View Leaderboard</DocsButton>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Token" title="$WCB utility">
            <p style={{ marginBottom: '0.8rem' }}>
              $WCB is the access token for the platform. It is used across wallet gating, credit
              preparation, leaderboard tiers, holder status, and future market access.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              The token page provides current placeholder metrics, contract status, trading links,
              and the current product phase.
            </p>
            <DocsButton href="/token" primary>
              Read Token Page
            </DocsButton>
          </SectionCard>

          <SectionCard eyebrow="Leaderboard" title="How ranking works">
            <p style={{ marginBottom: '0.8rem' }}>
              The leaderboard highlights wallet activity around $WCB holdings, locks, and credits.
              It gives early participants a visible status layer before the full betting product
              opens.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Rankings and tier signals are intended to make early participation measurable and
              easy to follow.
            </p>
            <DocsButton href="/leaderboard" primary>
              Open Leaderboard
            </DocsButton>
          </SectionCard>

          <SectionCard eyebrow="Launch Status" title="What is live now and what opens later">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                  Live now
                </h3>
                <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                  <li>World Cup match board</li>
                  <li>Group and bracket browsing</li>
                  <li>Community prediction sentiment</li>
                  <li>Wallet connection</li>
                  <li>$WCB locking and credit preview</li>
                  <li>Leaderboard preparation</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                  Opens at launch
                </h3>
                <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                  <li>Real-money betting markets</li>
                  <li>Credit deployment across matches</li>
                  <li>Full sportsbook settlement flow</li>
                  <li>Tournament reward campaigns</li>
                  <li>Expanded wallet-based access tiers</li>
                </ul>
              </div>
            </div>
          </SectionCard>
        </main>

        <aside className="docs-sidebar" style={{ position: 'sticky', top: '6rem' }}>
          <div className="card" style={{ padding: '1.25rem', background: SURFACE }}>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>
              Quick Facts
            </p>
            <InfoRow label="Platform" value="WORLDCUPBET" />
            <InfoRow label="Focus" value="World Cup 2026" />
            <InfoRow label="Network" value="Solana" />
            <InfoRow label="Token" value="$WCB" />
            <InfoRow label="Launch" value="June 11, 2026" />
            <InfoRow label="Current phase" value="Pre-launch" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
              <DocsButton href="/matches" primary>
                Markets
              </DocsButton>
              <DocsButton href="/lock">Lock & Earn</DocsButton>
              <DocsButton href="/token">Token</DocsButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
