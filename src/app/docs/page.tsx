import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/shared/BrandLogo';

export const metadata = {
  title: 'Docs & Whitepaper | WORLDCUPBET Protocol',
  description:
    'WORLDCUPBET protocol docs and whitepaper for the Solana-native World Cup 2026 app, holder leaderboard, Streamflow lock credits, and creator-fee-backed prize pool credit.',
};

const GOLD = '#F2B544';
const GOLD_SOFT = '#FFD36B';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const RED = '#EF4444';
const TEXT = '#FFFFFF';
const TEXT_SOFT = '#B3B3B3';
const TEXT_MUTED = '#6E6E6E';
const SURFACE = '#111111';
const CARD = '#171717';
const BORDER = '#2A2A2A';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag';

const DOC_NAV = [
  { href: '#intro', label: 'Introduction' },
  { href: '#whitepaper', label: 'Whitepaper' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#mechanism', label: 'Mechanism' },
  { href: '#leaderboards', label: 'Leaderboards' },
  { href: '#prizepool', label: 'Prize Pool' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#faq', label: 'FAQ' },
];

const HERO_STATS = [
  { label: 'Network', value: 'Solana' },
  { label: 'Identity', value: 'Wallet-native' },
  { label: 'Utility', value: 'Hold + lock' },
  { label: 'Launch', value: 'June 11, 2026' },
];

const WHITEPAPER_BLOCKS = [
  {
    title: 'Problem',
    body: 'Sports crypto pages often stop at hype: a token, a schedule, and a promise. Users still need a reason to connect a wallet, hold, lock, and return during live match windows.',
  },
  {
    title: 'Solution',
    body: 'WORLDCUPBET turns the World Cup into a wallet-aware app surface: token ownership creates status, Streamflow locks create credit depth, and match activity creates reward context.',
  },
  {
    title: 'Protocol Loop',
    body: 'Acquire $WCB, connect wallet, build holder rank, lock for credits, join matchday activity, and qualify for reward windows backed by live creator-fee credit.',
  },
  {
    title: 'Value Flow',
    body: 'The reward model is designed around measurable activity. Creator-fee estimates feed prize pool credit so campaign rewards can scale with actual market participation.',
  },
];

const APP_SURFACES = [
  {
    code: 'MATCH',
    title: 'Match Center',
    body: 'Fixture discovery, live match status, market preview, and the main path into tournament activity.',
    href: '/matches',
  },
  {
    code: 'GROUP',
    title: 'Group Explorer',
    body: 'Group cards and standings context for users who want football structure before making predictions.',
    href: '/groups',
  },
  {
    code: 'TOKEN',
    title: '$WCB Utility',
    body: 'Token page, trading routes, contract visibility, and the ownership layer behind holder status.',
    href: '/token',
  },
  {
    code: 'LOCK',
    title: 'Streamflow Locks',
    body: 'Non-custodial token locks that turn commitment into wallet-bound credits before launch.',
    href: '/lock',
  },
  {
    code: 'BOARD',
    title: 'Leaderboards',
    body: 'Separate holder and lock rankings so ownership and prepared credit are never mixed.',
    href: '/leaderboard',
  },
  {
    code: 'DOCS',
    title: 'Protocol Docs',
    body: 'The whitepaper layer that explains mechanics, rewards, roadmap, and launch states.',
    href: '/docs',
  },
];

const FLOW_STEPS = [
  {
    code: '01',
    title: 'Connect',
    body: 'A Solana wallet becomes the user identity. No account layer is needed to read ownership, lock state, or eligibility.',
  },
  {
    code: '02',
    title: 'Hold',
    body: '$WCB balance creates holder rank, tier status, social proof, and future snapshot eligibility.',
  },
  {
    code: '03',
    title: 'Lock',
    body: 'Streamflow positions turn idle tokens into credit depth and a visible commitment score.',
  },
  {
    code: '04',
    title: 'Compete',
    body: 'Match windows, leaderboard status, and prize-pool credit create repeatable tournament loops.',
  },
];

const MECHANISM_ROWS = [
  {
    layer: 'Holder rank',
    source: 'Live token accounts for the configured $WCB mint',
    output: 'Balance rank, tier, badges, and holder snapshot context',
  },
  {
    layer: 'Lock rank',
    source: 'Active Streamflow accounts for the same $WCB mint',
    output: 'Locked amount, credit score, active lock count, and Streamflow proof link',
  },
  {
    layer: 'Credit score',
    source: 'Locked amount multiplied by lock-duration tier',
    output: 'Prepared betting credit position before live markets open',
  },
  {
    layer: 'Prize pool credit',
    source: 'Estimated creator fee from live token volume and configured allocation',
    output: 'Reward capacity for holder, locker, and campaign windows',
  },
];

const LEADERBOARD_LAYERS = [
  {
    eyebrow: 'Ownership Layer',
    title: 'Holder Leaderboard',
    accent: GOLD,
    body: 'Ranks wallets by live $WCB holdings. This is the visibility layer for long-term owners and the first signal users understand when they open the app.',
    points: ['Token-account based ranking', 'Tier and badge display', 'Snapshot-ready holder status'],
  },
  {
    eyebrow: 'Commitment Layer',
    title: 'Lock Leaderboard',
    accent: PURPLE,
    body: 'Ranks active Streamflow locks by credit position. It proves who has prepared capital for launch instead of simply holding tokens in a wallet.',
    points: ['Streamflow-sourced positions', 'Locked amount and credits', 'Direct lock proof link'],
  },
];

const PRIZE_POOL_FACTS = [
  { label: 'Primary source', value: 'Live creator fee' },
  { label: 'Live estimator', value: 'Jupiter token volume' },
  { label: 'Fee model', value: 'Pump.fun creator tiers' },
  { label: 'Allocation', value: 'Configurable per campaign' },
];

const ROADMAP = [
  {
    phase: 'Phase 01',
    status: 'Live foundation',
    title: 'Protocol Surface',
    window: 'Now - May 20, 2026',
    progress: 72,
    items: ['Docs and whitepaper system', 'Match, group, token, lock pages', 'Wallet-aware navigation'],
  },
  {
    phase: 'Phase 02',
    status: 'Activation',
    title: 'Holder Layer',
    window: 'May 20 - June 1, 2026',
    progress: 54,
    items: ['Live holder leaderboard', 'Tier and badge logic', 'Snapshot preparation'],
  },
  {
    phase: 'Phase 03',
    status: 'Utility',
    title: 'Credit Layer',
    window: 'June 1 - June 11, 2026',
    progress: 38,
    items: ['Streamflow lock leaderboard', 'Wallet credit dashboard', 'Pre-launch credit campaign'],
  },
  {
    phase: 'Phase 04',
    status: 'Tournament',
    title: 'Live Reward Layer',
    window: 'June 11, 2026+',
    progress: 18,
    items: ['Matchday market windows', 'Creator-fee prize pool credit', 'Holder and locker reward cycles'],
  },
];

const FAQS = [
  {
    question: 'Is the holder leaderboard the same as the lock leaderboard?',
    answer:
      'No. Holder rank is based on live token balances for the $WCB mint. Lock rank is based on active Streamflow lock accounts and the credits generated by those locks.',
  },
  {
    question: 'What is prize pool credit?',
    answer:
      'Prize pool credit is the reward reserve accounting layer. It estimates how much reward capacity can be funded from creator-fee activity before a campaign or matchday distribution window.',
  },
  {
    question: 'Why use Streamflow?',
    answer:
      'Streamflow provides a clear on-chain lock primitive. It lets the app show real lock proof instead of relying on a private database for commitment scoring.',
  },
  {
    question: 'When do live markets activate?',
    answer:
      'The app is structured around the World Cup opening window on June 11, 2026. Availability and exact market behavior still depend on final configuration and jurisdictional requirements.',
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
    <Link href={href} className={primary ? 'btn-primary' : 'btn-secondary'} style={{ minWidth: 148 }}>
      {children}
    </Link>
  );
}

function ExternalButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ minWidth: 148 }}>
      {children}
    </a>
  );
}

function AnchorButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.55rem 0.8rem',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: TEXT_SOFT,
        textDecoration: 'none',
        fontSize: '0.78rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </a>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ padding: '2.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 260px) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }} className="docs-section-grid">
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 10 }}>
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-4xl" style={{ lineHeight: 1.1, fontWeight: 900, color: TEXT, marginBottom: '0.75rem' }}>
            {title}
          </h2>
          {intro && (
            <p style={{ color: TEXT_SOFT, fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
              {intro}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '0.95rem 1rem', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: TEXT_MUTED, marginBottom: 5 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.98rem', fontWeight: 900, color: TEXT, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function FeaturePanel({
  title,
  body,
  eyebrow,
  accent = GOLD,
  children,
}: {
  title: string;
  body?: string;
  eyebrow?: string;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="card card-hover" style={{ padding: '1.2rem', minHeight: '100%', background: CARD }}>
      {eyebrow && (
        <p style={{ color: accent, fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          {eyebrow}
        </p>
      )}
      <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
        {title}
      </h3>
      {body && (
        <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>
          {body}
        </p>
      )}
      {children}
    </div>
  );
}

function FlowStep({ code, title, body }: { code: string; title: string; body: string }) {
  return (
    <div style={{ position: 'relative', padding: '1.1rem', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, minHeight: 178 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ color: GREEN, fontSize: '0.72rem', fontWeight: 900 }}>{code}</span>
        <span style={{ width: 34, height: 6, borderRadius: 9999, background: `linear-gradient(90deg, ${GOLD}, ${GREEN})` }} />
      </div>
      <h3 style={{ color: TEXT, fontSize: '1.05rem', fontWeight: 900, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.65, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.78rem 0', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ color: TEXT_MUTED, fontSize: '0.82rem', fontWeight: 800 }}>{label}</span>
      <span style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 800, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function RoadmapCard({
  phase,
  status,
  title,
  window,
  progress,
  items,
}: {
  phase: string;
  status: string;
  title: string;
  window: string;
  progress: number;
  items: string[];
}) {
  return (
    <div className="card" style={{ padding: '1.15rem', background: CARD }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <p style={{ color: GOLD, fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
          {phase}
        </p>
        <span style={{ padding: '0.18rem 0.55rem', borderRadius: 9999, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)', color: GREEN, fontSize: '0.62rem', fontWeight: 900 }}>
          {status}
        </span>
      </div>
      <h3 style={{ color: TEXT, fontSize: '1.05rem', fontWeight: 900, marginBottom: 5 }}>
        {title}
      </h3>
      <p style={{ color: TEXT_MUTED, fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.9rem' }}>
        {window}
      </p>
      <div style={{ height: 8, borderRadius: 9999, background: '#0B0B0B', border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${GREEN})` }} />
      </div>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.4rem' }}>
        {items.map((item) => (
          <li key={item} style={{ color: TEXT_SOFT, fontSize: '0.85rem', lineHeight: 1.55 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProtocolConsole() {
  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid rgba(242,181,68,0.24)',
        background: '#0D0D0D',
        overflow: 'hidden',
        boxShadow: '0 28px 80px rgba(0,0,0,0.38)',
      }}
    >
      <div style={{ padding: '0.8rem 1rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
        </div>
        <span style={{ color: TEXT_MUTED, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em' }}>
          WCB PROTOCOL CONSOLE
        </span>
      </div>
      <div style={{ padding: '1.1rem' }}>
        <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '1rem' }}>
          {[
            { label: 'Holder feed', value: 'Token accounts' },
            { label: 'Lock feed', value: 'Streamflow' },
            { label: 'Prize pool', value: 'Creator fee' },
            { label: 'Status', value: 'Pre-launch' },
          ].map((item) => (
            <div key={item.label} style={{ padding: '0.85rem', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}` }}>
              <p style={{ color: TEXT_MUTED, fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                {item.label}
              </p>
              <p style={{ color: item.label === 'Prize pool' ? GREEN : TEXT, fontSize: '0.86rem', fontWeight: 900, margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 8, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          {['Connect wallet', 'Read $WCB balance', 'Check active locks', 'Estimate fee-backed rewards'].map((item, index) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.78rem 0.9rem', borderBottom: index < 3 ? `1px solid ${BORDER}` : 'none', background: index % 2 ? '#101010' : '#0C0C0C' }}>
              <span style={{ color: TEXT_SOFT, fontSize: '0.82rem', fontWeight: 700 }}>{item}</span>
              <span style={{ color: index < 3 ? GREEN : GOLD, fontSize: '0.72rem', fontWeight: 900 }}>
                {index < 3 ? 'READY' : 'ESTIMATE'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const mintDisplay = WCB_MINT ? `${WCB_MINT.slice(0, 8)}...${WCB_MINT.slice(-6)}` : 'Configured at launch';

  return (
    <div style={{ background: '#070707' }}>
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)', gap: '2rem', alignItems: 'center' }} className="docs-hero-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <BrandLogo size="lg" showText={false} />
                <span style={{ padding: '0.28rem 0.72rem', borderRadius: 9999, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)', color: GREEN, fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Protocol Docs
                </span>
                <span style={{ padding: '0.28rem 0.72rem', borderRadius: 9999, background: 'rgba(242,181,68,0.1)', border: '1px solid rgba(242,181,68,0.25)', color: GOLD_SOFT, fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Whitepaper v1
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl" style={{ color: TEXT, lineHeight: 1, fontWeight: 900, marginBottom: '1rem', maxWidth: 920 }}>
                Introducing WORLDCUPBET Protocol.
              </h1>
              <p style={{ color: TEXT_SOFT, fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 820, marginBottom: '1.4rem' }}>
                A Solana-native World Cup 2026 app where wallet ownership, Streamflow lock commitment, matchday activity, and creator-fee-backed prize pool credit work together inside one product loop.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: '1.4rem' }}>
                {HERO_STATS.map((stat) => (
                  <StatTile key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                <DocsButton href="/leaderboard" primary>
                  Open Leaderboards
                </DocsButton>
                <DocsButton href="/lock">
                  Lock & Earn
                </DocsButton>
                <ExternalButton href={PUMPFUN}>
                  Buy $WCB
                </ExternalButton>
                <ExternalButton href={JUPITER}>
                  Swap
                </ExternalButton>
              </div>

              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                {DOC_NAV.map((item) => (
                  <AnchorButton key={item.href} href={item.href}>
                    {item.label}
                  </AnchorButton>
                ))}
              </div>
            </div>

            <ProtocolConsole />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.25rem', alignItems: 'start' }} className="docs-layout">
          <main>
            <SectionShell
              id="intro"
              eyebrow="Introduction"
              title="A World Cup app with on-chain participation."
              intro="The product is designed as an app first: users connect, inspect matches, hold the token, lock for credit, and track their rank. The docs exist to make every layer readable before the live tournament window opens."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WHITEPAPER_BLOCKS.map((item) => (
                  <FeaturePanel key={item.title} title={item.title} body={item.body} eyebrow="Whitepaper note" />
                ))}
              </div>
            </SectionShell>

            <SectionShell
              id="whitepaper"
              eyebrow="Whitepaper"
              title="The protocol thesis."
              intro="WORLDCUPBET combines familiar football behavior with Web3-native proof. The user should not have to understand every contract detail before seeing why their wallet state matters."
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(260px, 0.75fr)', gap: '1rem' }} className="docs-two-col">
                <div className="card" style={{ padding: '1.35rem', background: CARD }}>
                  <h3 style={{ color: TEXT, fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.85rem' }}>
                    Core thesis
                  </h3>
                  <p style={{ color: TEXT_SOFT, lineHeight: 1.75, marginBottom: '1rem' }}>
                    The World Cup creates a short, intense attention cycle. A Web3 betting and prediction app needs more than fixtures: it needs a persistent wallet identity layer, a visible commitment layer, and a reward reserve that can be explained in one sentence.
                  </p>
                  <p style={{ color: TEXT_SOFT, lineHeight: 1.75, marginBottom: '1rem' }}>
                    $WCB provides the access signal. Holder rank shows ownership. Streamflow locks show commitment. Prize pool credit connects future rewards to creator-fee activity instead of arbitrary emissions.
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <AnchorButton href="#mechanism">View Mechanism</AnchorButton>
                    <AnchorButton href="#prizepool">Prize Pool Model</AnchorButton>
                    <AnchorButton href="#roadmap">Roadmap</AnchorButton>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.2rem', background: SURFACE }}>
                  <p className="section-eyebrow" style={{ marginBottom: 8 }}>
                    Protocol Spec
                  </p>
                  <SpecRow label="Token" value="$WCB" />
                  <SpecRow label="Mint" value={mintDisplay} />
                  <SpecRow label="Network" value="Solana mainnet" />
                  <SpecRow label="Lock source" value="Streamflow" />
                  <SpecRow label="Volume source" value="Jupiter Token API" />
                  <SpecRow label="Reward model" value="Creator-fee credit" />
                </div>
              </div>
            </SectionShell>

            <SectionShell
              id="architecture"
              eyebrow="Architecture"
              title="The app surfaces are deliberately separated."
              intro="Each page has a single job. This keeps the app usable for football users while still giving crypto users enough proof and mechanics to evaluate the protocol."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {APP_SURFACES.map((surface) => (
                  <Link key={surface.title} href={surface.href} style={{ textDecoration: 'none' }}>
                    <FeaturePanel title={surface.title} body={surface.body} eyebrow={surface.code} accent={surface.code === 'LOCK' ? PURPLE : GOLD} />
                  </Link>
                ))}
              </div>
            </SectionShell>

            <SectionShell
              id="mechanism"
              eyebrow="Mechanism"
              title="How wallet state becomes product utility."
              intro="The mechanism is split into readable layers so ownership, lock commitment, and reward credit do not blur into one confusing score."
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: '1rem' }}>
                {FLOW_STEPS.map((step) => (
                  <FlowStep key={step.code} {...step} />
                ))}
              </div>

              <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                  <thead>
                    <tr style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                      {['Layer', 'Source', 'Output'].map((head) => (
                        <th key={head} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: TEXT_MUTED, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MECHANISM_ROWS.map((row) => (
                      <tr key={row.layer} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT, fontWeight: 900 }}>{row.layer}</td>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT_SOFT }}>{row.source}</td>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT_SOFT }}>{row.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionShell>

            <SectionShell
              id="leaderboards"
              eyebrow="Leaderboards"
              title="Holder rank and lock rank are different products."
              intro="This separation makes the app more credible. A wallet can own a lot of $WCB without locking. Another wallet can lock aggressively and build credit depth. Both behaviors are useful, but they should not be shown as the same metric."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEADERBOARD_LAYERS.map((layer) => (
                  <FeaturePanel key={layer.title} title={layer.title} body={layer.body} eyebrow={layer.eyebrow} accent={layer.accent}>
                    <ul style={{ margin: '1rem 0 0', paddingLeft: '1.1rem', display: 'grid', gap: '0.45rem' }}>
                      {layer.points.map((point) => (
                        <li key={point} style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.55 }}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </FeaturePanel>
                ))}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <DocsButton href="/leaderboard" primary>
                  View Live Boards
                </DocsButton>
                <DocsButton href="/lock">
                  Create Lock
                </DocsButton>
              </div>
            </SectionShell>

            <SectionShell
              id="prizepool"
              eyebrow="Prize Pool Credit"
              title="A fee-backed reward reserve, not empty emissions."
              intro="Prize pool credit estimates the reward capacity that can be funded from live creator fee. The current counter uses Jupiter token volume with the Pump.fun creator-fee tier model and configurable allocation settings."
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: '1rem' }}>
                {PRIZE_POOL_FACTS.map((fact) => (
                  <StatTile key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>

              <div className="card" style={{ padding: '1.25rem', background: 'rgba(20,241,149,0.07)', border: '1px solid rgba(20,241,149,0.24)' }}>
                <h3 style={{ color: GREEN, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                  Reward formula
                </h3>
                <p style={{ color: TEXT_SOFT, lineHeight: 1.7, marginBottom: '1rem' }}>
                  Prize Pool Credit = 24h Token Volume x Estimated Creator Fee Rate x Protocol Prize Allocation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Holder campaign windows', 'Lock leaderboard rewards', 'Matchday tournament incentives'].map((item) => (
                    <div key={item} style={{ padding: '0.9rem', borderRadius: 8, background: '#0B0F0D', border: '1px solid rgba(20,241,149,0.18)', color: TEXT, fontSize: '0.86rem', fontWeight: 800 }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SectionShell>

            <SectionShell
              id="roadmap"
              eyebrow="Roadmap"
              title="A launch path built around the World Cup window."
              intro="The roadmap is staged by product layer, not by vague announcements. Every phase adds a clearer reason for users to connect, hold, lock, and return."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROADMAP.map((item) => (
                  <RoadmapCard key={item.phase} {...item} />
                ))}
              </div>
            </SectionShell>

            <SectionShell
              id="faq"
              eyebrow="FAQ"
              title="Important mechanics and launch notes."
              intro="These notes keep the docs honest about what is live now, what is estimated, and what depends on final market activation."
            >
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {FAQS.map((faq) => (
                  <details key={faq.question} className="card" style={{ padding: '1rem 1.1rem', background: CARD }}>
                    <summary style={{ color: TEXT, fontWeight: 900, cursor: 'pointer' }}>
                      {faq.question}
                    </summary>
                    <p style={{ color: TEXT_SOFT, lineHeight: 1.7, margin: '0.8rem 0 0' }}>
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.06)' }}>
                <p style={{ color: TEXT_SOFT, fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>
                  $WCB is a crypto asset and may be volatile. Betting and prediction features are subject to final product configuration, launch timing, and user jurisdiction. This page explains product mechanics and should not be treated as financial advice.
                </p>
              </div>
            </SectionShell>
          </main>

          <aside className="docs-sidebar" style={{ position: 'sticky', top: '6rem', paddingTop: '2.5rem' }}>
            <div className="card" style={{ padding: '1.15rem', background: SURFACE, marginBottom: '1rem' }}>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>
                Docs Index
              </p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {DOC_NAV.map((item) => (
                  <a key={item.href} href={item.href} className="sidebar-nav-link">
                    {item.label}
                    <span style={{ color: TEXT_MUTED }}>#</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.15rem', background: SURFACE, marginBottom: '1rem' }}>
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>
                Quick Facts
              </p>
              <SpecRow label="Platform" value="WORLDCUPBET" />
              <SpecRow label="Token" value="$WCB" />
              <SpecRow label="Chain" value="Solana" />
              <SpecRow label="Launch" value="June 11, 2026" />
              <SpecRow label="Holder source" value="Token accounts" />
              <SpecRow label="Lock source" value="Streamflow" />
              <SpecRow label="Prize source" value="Creator fee" />
            </div>

            <div className="card" style={{ padding: '1.15rem', background: SURFACE }}>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>
                App Actions
              </p>
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                <DocsButton href="/leaderboard" primary>
                  Leaderboards
                </DocsButton>
                <DocsButton href="/lock">
                  Lock & Earn
                </DocsButton>
                <DocsButton href="/matches">
                  Match Center
                </DocsButton>
                <DocsButton href="/token">
                  Token Utility
                </DocsButton>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .docs-hero-grid,
          .docs-two-col,
          .docs-section-grid {
            grid-template-columns: 1fr !important;
          }
          .docs-sidebar {
            position: static !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
