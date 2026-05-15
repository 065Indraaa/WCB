import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Docs | WORLDCUPBET Protocol',
  description:
    'Introducing WORLDCUPBET: a Solana-native World Cup 2026 protocol with holder ranking, lock credits, and prize pool credit funded by live creator fee.',
};

const GOLD = '#F2B544';
const GOLD_SOFT = '#FFD36B';
const TEXT = '#FFFFFF';
const TEXT_SOFT = '#B3B3B3';
const TEXT_MUTED = '#6E6E6E';
const SURFACE = '#111111';
const CARD = '#171717';

const HERO_STATS = [
  { label: 'Chain', value: 'Solana' },
  { label: 'Ranking', value: 'Holder + lock' },
  { label: 'Prize source', value: 'Live creator fee' },
  { label: 'Launch', value: 'June 11, 2026' },
];

const PROTOCOL_SURFACES = [
  {
    title: 'Match Center',
    body: 'Fixture board, live status, and market preview for every World Cup match.',
    href: '/matches',
  },
  {
    title: 'Group Explorer',
    body: 'Group cards, standings, and qualification context for all 12 groups.',
    href: '/groups',
  },
  {
    title: 'Token Utility',
    body: '$WCB metrics, utility copy, and the trading path for holders.',
    href: '/token',
  },
  {
    title: 'Lock & Earn',
    body: 'Streamflow locks, credit estimation, and early-stage redemption logic.',
    href: '/lock',
  },
  {
    title: 'Holder Leaderboard',
    body: 'Wallet rank, tiers, badges, and status layers tied to on-chain balance.',
    href: '/leaderboard',
  },
  {
    title: 'Protocol Docs',
    body: 'This guide, launch phases, and the reward model behind the app.',
    href: '/docs',
  },
];

const LEADERBOARD_LAYERS = [
  {
    eyebrow: 'Owner rank',
    title: 'Holder Leaderboard',
    accent: '#F2B544',
    tint: 'rgba(242,181,68,0.08)',
    border: 'rgba(242,181,68,0.24)',
    bullets: [
      'Ranks wallets by on-chain $WCB balance.',
      'Shows rank, truncated address, holdings, tier, and badges.',
      'Badge logic covers Diamond Hands, Early Bird, and Whale.',
      'Creates the social proof layer for long-term holders.',
    ],
  },
  {
    eyebrow: 'Utility rank',
    title: 'Lock Leaderboard',
    accent: '#9945FF',
    tint: 'rgba(153,69,255,0.08)',
    border: 'rgba(153,69,255,0.24)',
    bullets: [
      'Tracks Streamflow positions and credit depth.',
      'Turns locked tokens into launch-ready betting credits.',
      'Works as the early-stage incentive layer before markets go live.',
      'Keeps capital preparation separate from simple ownership.',
    ],
  },
];

const PHASES = [
  {
    window: 'Now - May 20, 2026',
    title: 'Pre-launch',
    body: 'Market previews are live, lock flow is open, and the product is framed as a docs-first Web3 surface.',
  },
  {
    window: 'May 20 - June 1, 2026',
    title: 'Whitelist',
    body: 'Early holders start to matter more, and the leaderboard begins to feel like a real social proof layer.',
  },
  {
    window: 'June 1 - June 11, 2026',
    title: 'NFT and Beta',
    body: 'The NFT pass window opens, beta access expands, and the reward model is pressure-tested before kickoff.',
  },
  {
    window: 'June 11, 2026+',
    title: 'Live',
    body: 'World Cup markets open, credits become active, and the reward reserve starts to matter in production.',
  },
];

const WEB3_APP_MODEL = [
  {
    title: 'Wallet identity',
    body: 'A connected Solana wallet becomes the user identity. The app can read balance, lock state, and reward eligibility without asking users to create an account.',
  },
  {
    title: 'Token access',
    body: '$WCB is the access signal for rank, status, utility, and future campaign participation across the platform.',
  },
  {
    title: 'On-chain commitment',
    body: 'Streamflow locks convert passive holding into a visible commitment layer and produce launch-ready credits.',
  },
  {
    title: 'Fee-backed rewards',
    body: 'Prize pool credit is designed to be backed by live creator fee, so rewards are connected to product usage.',
  },
];

const MECHANISM_STACK = [
  {
    layer: 'Ownership',
    source: '$WCB wallet balance',
    output: 'Holder rank, tier, badges, snapshot eligibility',
  },
  {
    layer: 'Commitment',
    source: 'Streamflow lock amount and duration',
    output: 'Lock rank, credit depth, early access weight',
  },
  {
    layer: 'Activity',
    source: 'Prediction participation and campaign windows',
    output: 'Market sentiment, missions, reward eligibility',
  },
  {
    layer: 'Reward reserve',
    source: 'Live creator fee',
    output: 'Prize pool credit for holders, lockers, and campaigns',
  },
];

const SNAPSHOT_RULES = [
  'Snapshots can use wallet balance, lock credit, and activity history as separate inputs.',
  'Holder rank is based on balance; lock rank is based on prepared credit position.',
  'Prize pool credit eligibility can be split by campaign type, not only by one global rank.',
  'Pre-launch pages may show preview logic while live distribution waits for configured market activity.',
];

const ROADMAP = [
  {
    quarter: 'Phase 1',
    title: 'Protocol surface',
    items: ['Docs, match board, groups, token page', 'Wallet connect and app navigation', 'Pre-launch sentiment preview'],
  },
  {
    quarter: 'Phase 2',
    title: 'Holder layer',
    items: ['Holder leaderboard', 'Tier and badge display', 'Snapshot-ready wallet ranking'],
  },
  {
    quarter: 'Phase 3',
    title: 'Credit layer',
    items: ['Streamflow lock flow', 'Credit calculator', 'Lock leaderboard and wallet dashboard'],
  },
  {
    quarter: 'Phase 4',
    title: 'Live reward layer',
    items: ['Creator-fee-backed prize pool credit', 'Campaign reward windows', 'Matchday and tournament incentives'],
  },
];

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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '0.9rem 1rem',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED }}>
        {label}
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: TEXT, marginTop: '0.35rem' }}>
        {value}
      </div>
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
          Protocol Docs
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
          Introducing WORLDCUPBET
        </h1>
        <p style={{ color: TEXT_SOFT, fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 820 }}>
          WORLDCUPBET is a Solana-native World Cup 2026 protocol. It combines match discovery,
          token utility, holder ranking, lock-based credits, and prize pool credit into one
          product surface that reads like a Web3 app from the first screen.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginTop: '1.5rem' }}>
          {HERO_STATS.map((stat) => (
            <StatTile key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <DocsButton href="/matches" primary>
            Open Market Board
          </DocsButton>
          <DocsButton href="/leaderboard">
            Holder Leaderboard
          </DocsButton>
          <DocsButton href="/lock">
            Lock & Earn
          </DocsButton>
          <DocsButton href="/token">
            Token Utility
          </DocsButton>
        </div>
      </section>

      <div
        className="docs-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SectionCard eyebrow="Introduction" title="What the protocol is doing">
            <p style={{ marginBottom: '0.8rem' }}>
              The app is built to feel like a real Web3 product, not a generic sports landing
              page. Wallet state is the identity layer, $WCB is the access layer, and the reward
              model is tied to on-chain activity instead of loose marketing copy.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              This guide explains the surfaces a user touches, how the holder and lock systems
              differ, and why prize pool credit is part of the protocol design.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
              <li>Wallet-aware UI with Solana-native access points.</li>
              <li>Separate holder and lock ranking layers.</li>
              <li>Fee-backed prize pool credit for future reward flows.</li>
              <li>Launch phases that expand the product in clear steps.</li>
            </ul>
          </SectionCard>

          <SectionCard eyebrow="Web3 App Model" title="The product model">
            <p style={{ marginBottom: '1rem' }}>
              WORLDCUPBET is structured around a simple Web3 loop: connect wallet, hold $WCB,
              prepare credits, participate in match activity, and qualify for fee-backed rewards.
              The app should feel understandable to regular football users while still giving
              crypto users clear on-chain primitives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WEB3_APP_MODEL.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    background: SURFACE,
                    border: '1px solid #2A2A2A',
                  }}
                >
                  <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Protocol Surfaces" title="Where users spend time">
            <p style={{ marginBottom: '1rem' }}>
              Every public page has a specific job. The structure is intentionally narrow so the
              product feels like a protocol dashboard, not a blog or a generic promo site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROTOCOL_SURFACES.map((surface) => (
                <Link
                  key={surface.title}
                  href={surface.href}
                  style={{
                    display: 'block',
                    padding: '1rem',
                    borderRadius: 12,
                    background: SURFACE,
                    border: '1px solid #2A2A2A',
                    textDecoration: 'none',
                  }}
                >
                  <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: GOLD, marginBottom: 6 }}>
                    Docs surface
                  </p>
                  <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 6 }}>
                    {surface.title}
                  </h3>
                  <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>
                    {surface.body}
                  </p>
                </Link>
              ))}
            </div>
          </SectionCard>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StepCard
              code="01"
              title="Acquire $WCB"
              body="Buy or swap the token, then keep the wallet connected so the app can treat ownership as a live identity signal."
            />
            <StepCard
              code="02"
              title="Hold for rank"
              body="The holder leaderboard tracks wallet balance, tier, and badges. It is the ownership and status layer."
            />
            <StepCard
              code="03"
              title="Lock for credits"
              body="Streamflow locks turn idle tokens into launch-ready credits and create the early-stage utility layer."
            />
            <StepCard
              code="04"
              title="Earn from activity"
              body="A share of live creator fee feeds prize pool credit, so rewards grow with product usage instead of fixed emissions."
            />
          </section>

          <SectionCard eyebrow="Core Mechanism" title="How the system connects">
            <p style={{ marginBottom: '1rem' }}>
              The mechanism is intentionally layered. A wallet can be a holder without locking,
              a locker without being a top holder, or both. This gives the platform more than one
              way to reward useful participation.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: SURFACE, borderBottom: '1px solid #2A2A2A' }}>
                    {['Layer', 'Source', 'Output'].map((head) => (
                      <th
                        key={head}
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: TEXT_MUTED,
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MECHANISM_STACK.map((row) => (
                    <tr key={row.layer} style={{ borderBottom: '1px solid #2A2A2A' }}>
                      <td style={{ padding: '0.85rem 1rem', color: TEXT, fontWeight: 900 }}>
                        {row.layer}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: TEXT_SOFT }}>
                        {row.source}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: TEXT_SOFT }}>
                        {row.output}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Leaderboard Model" title="Holder rank and lock credit are not the same thing">
            <p style={{ marginBottom: '1rem' }}>
              The docs keep the ownership board and the credit board separate on purpose. That
              separation makes the product easier to read and makes the reward logic feel more
              credible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEADERBOARD_LAYERS.map((layer) => (
                <div
                  key={layer.title}
                  style={{
                    padding: '1rem',
                    borderRadius: 14,
                    background: layer.tint,
                    border: `1px solid ${layer.border}`,
                  }}
                >
                  <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: layer.accent, marginBottom: 6 }}>
                    {layer.eyebrow}
                  </p>
                  <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: '0.75rem' }}>
                    {layer.title}
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.45rem' }}>
                    {layer.bullets.map((bullet) => (
                      <li key={bullet} style={{ color: TEXT_SOFT, lineHeight: 1.55 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Prize Pool Credit" title="Fee-backed reward reserve">
            <p style={{ marginBottom: '0.8rem' }}>
              Prize pool credit is the internal reward reserve. A share of live creator fee is
              routed into the pool, which keeps the reward engine connected to actual platform
              activity instead of a static marketing budget.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              That reserve can then be used for holder campaigns, seasonal rewards, leaderboard
              bonuses, and launch-phase incentives.
            </p>
            <div
              style={{
                border: '1px solid rgba(20,241,149,0.24)',
                background: 'rgba(20,241,149,0.07)',
                borderRadius: 12,
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ color: '#14F195', fontSize: '1rem', fontWeight: 900, marginBottom: 6 }}>
                Reward formula
              </h3>
              <p style={{ margin: 0 }}>
                Prize Pool Credit = Live Creator Fee x protocol prize allocation. The exact
                allocation can be configured per campaign, but the source remains the same:
                live fee generated by real platform activity.
              </p>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
              <li>Fee backed, so the pool scales with usage.</li>
              <li>Transparent, so the credit model is easy to explain.</li>
              <li>Aligned with holders, because reward growth follows platform activity.</li>
            </ul>
          </SectionCard>

          <SectionCard eyebrow="Snapshots" title="Eligibility and distribution logic">
            <p style={{ marginBottom: '1rem' }}>
              A credible Web3 app needs clear snapshot language. Users should know what can affect
              eligibility before they connect, hold, lock, or participate.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
              {SNAPSHOT_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard eyebrow="Token Utility" title="$WCB utility inside the protocol">
            <p style={{ marginBottom: '0.8rem' }}>
              $WCB is the access token for the app. It unlocks the wallet-aware surfaces, feeds
              the holder rank layer, and supports the credit and reward model that surrounds the
              World Cup 2026 launch window.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
              <li>Buy on Pump.fun or swap through Jupiter.</li>
              <li>Use the token as the ownership signal for rank and badges.</li>
              <li>Lock tokens to prepare launch credits before markets open.</li>
              <li>Participate in the prize pool credit model as the protocol grows.</li>
            </ul>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              <DocsButton href="/token" primary>
                View Token Page
              </DocsButton>
              <DocsButton href="/leaderboard">
                View Holder Board
              </DocsButton>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Roadmap" title="Product roadmap">
            <p style={{ marginBottom: '1rem' }}>
              The roadmap is organized by product layers. Each layer makes the app more useful
              without forcing every feature to be live before World Cup kickoff.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROADMAP.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    background: SURFACE,
                    border: '1px solid #2A2A2A',
                  }}
                >
                  <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: GOLD, marginBottom: 6 }}>
                    {item.quarter}
                  </p>
                  <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.4rem' }}>
                    {item.items.map((roadmapItem) => (
                      <li key={roadmapItem} style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.55 }}>
                        {roadmapItem}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Launch Phases" title="How the product opens up">
            <p style={{ marginBottom: '1rem' }}>
              The phase model gives the product room to feel alive before kickoff without
              pretending that live betting is already open.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PHASES.map((phase, index) => (
                <div
                  key={phase.title}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    background: SURFACE,
                    border: '1px solid #2A2A2A',
                  }}
                >
                  <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: index === 3 ? GOLD : TEXT_MUTED, marginBottom: 6 }}>
                    {phase.window}
                  </p>
                  <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 6 }}>
                    {phase.title}
                  </h3>
                  <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>
                    {phase.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Transparency" title="What is live now">
            <p style={{ marginBottom: '0.8rem' }}>
              Current pages can show previews, static tournament data, wallet connection, and
              lock preparation. Live betting, fee-backed prize pool credit, and final reward
              distribution activate only when the live market layer is configured.
            </p>
            <p style={{ margin: 0 }}>
              This framing is deliberate: the app can build attention before launch while keeping
              the reward and market language tied to clear activation states.
            </p>
          </SectionCard>
        </main>

        <aside className="docs-sidebar" style={{ position: 'sticky', top: '6rem' }}>
          <div className="card" style={{ padding: '1.25rem', background: SURFACE }}>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>
              Quick Facts
            </p>
            <InfoRow label="Platform" value="WORLDCUPBET" />
            <InfoRow label="Network" value="Solana" />
            <InfoRow label="Token" value="$WCB" />
            <InfoRow label="Launch" value="June 11, 2026" />
            <InfoRow label="Phase now" value="Pre-launch" />
            <InfoRow label="Leaderboard" value="Holder + Lock" />
            <InfoRow label="Reward source" value="Live creator fee" />
          </div>

          <div className="card" style={{ padding: '1.25rem', background: SURFACE, marginTop: '1rem' }}>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>
              Core Links
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <DocsButton href="/matches" primary>
                Market Board
              </DocsButton>
              <DocsButton href="/leaderboard">
                Holder Board
              </DocsButton>
              <DocsButton href="/lock">
                Lock & Earn
              </DocsButton>
              <DocsButton href="/token">
                Token
              </DocsButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
