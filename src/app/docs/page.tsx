import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/shared/BrandLogo';

export const metadata = {
  title: 'Docs & Whitepaper | WORLDCUPBET Protocol',
  description:
    'Clear WORLDCUPBET docs and whitepaper for the Solana World Cup 2026 app, holder ranking, Streamflow lock credits, and prize pool credit.',
};

const GOLD = '#F2B544';
const GOLD_SOFT = '#FFD36B';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const TEXT = '#FFFFFF';
const TEXT_SOFT = '#B3B3B3';
const TEXT_MUTED = '#6E6E6E';
const SURFACE = '#111111';
const CARD = '#171717';
const BORDER = '#2A2A2A';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag';

const NAV_ITEMS = [
  { href: '#start', label: 'Start Here' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#lock-credits', label: 'Lock & Credits' },
  { href: '#betting', label: 'Betting Soon' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#leaderboards', label: 'Leaderboards' },
  { href: '#prize-pool', label: 'Prize Pool' },
  { href: '#whitepaper', label: 'Whitepaper' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#faq', label: 'FAQ' },
];

const USER_ACTIONS = [
  {
    step: '01',
    title: 'Hold $WCB',
    body: 'Your wallet balance gives you a holder rank. This is the simplest status layer in the app.',
    action: 'View holder board',
    href: '/leaderboard',
  },
  {
    step: '02',
    title: 'Lock $WCB',
    body: 'Locking through Streamflow turns commitment into credits. Credits are shown separately from normal holdings.',
    action: 'Open lock page',
    href: '/lock',
  },
  {
    step: '03',
    title: 'Use the app during the tournament',
    body: 'When match windows go live, holder rank, lock credits, and activity can be used for campaign eligibility.',
    action: 'View matches',
    href: '/matches',
  },
];

const SYSTEM_ROWS = [
  {
    layer: 'Holder Leaderboard',
    source: 'Live token accounts for the $WCB mint',
    means: 'Who owns the most $WCB right now.',
    live: 'Live when token address and RPC are configured',
  },
  {
    layer: 'Lock Leaderboard',
    source: 'Active Streamflow locks for the same $WCB mint',
    means: 'Who has locked tokens and built the strongest credit position.',
    live: 'Live from Streamflow lock accounts',
  },
  {
    layer: 'Prize Pool Credit',
    source: 'Estimated creator fee from token volume',
    means: 'A transparent reward-capacity counter, not a fixed payout promise.',
    live: 'Estimated from Jupiter volume and fee settings',
  },
];

const LOCK_MECHANISM = [
  {
    title: 'Connect wallet',
    body: 'The app reads your Solana wallet so it can verify $WCB balance and future lock status.',
  },
  {
    title: 'Choose amount and duration',
    body: 'The lock page estimates credits before the user commits. More tokens and longer duration can create a stronger credit position.',
  },
  {
    title: 'Lock through Streamflow',
    body: 'The lock action uses Streamflow as the on-chain lock layer, so the commitment can be verified from an external source.',
  },
  {
    title: 'Receive credit position',
    body: 'Credits are wallet-bound app credits used for ranking, launch preparation, and future campaign eligibility.',
  },
];

const CREDIT_RULES = [
  {
    label: 'Base logic',
    value: 'Credits are calculated from locked amount and lock duration.',
  },
  {
    label: 'Wallet-bound',
    value: 'Credits belong to the connected wallet and are not shown as transferable tokens.',
  },
  {
    label: 'Ranking use',
    value: 'Credits decide lock leaderboard position and prepared launch status.',
  },
  {
    label: 'Future use',
    value: 'Credits can be used by betting access, campaigns, and tournament reward rules once activated.',
  },
];

const BETTING_FLOW = [
  {
    phase: 'Preview',
    title: 'Match board before launch',
    body: 'Users can explore fixtures, groups, and pre-launch market context before betting opens.',
  },
  {
    phase: 'Access',
    title: 'Wallet-gated product layer',
    body: '$WCB balance, holder rank, and lock credits can be used to shape access and campaign eligibility.',
  },
  {
    phase: 'Market',
    title: 'Betting layer coming soon',
    body: 'The betting product is planned for the World Cup window. Final behavior depends on launch configuration and jurisdiction rules.',
  },
  {
    phase: 'Reward',
    title: 'Campaign settlement',
    body: 'Campaigns can use match activity, holder status, lock credits, and prize pool credit when reward windows close.',
  },
];

const BENEFITS = [
  {
    title: 'For Holders',
    accent: GOLD,
    items: [
      'Appear on the holder leaderboard by wallet balance.',
      'Build visible status through tiers and badges.',
      'Qualify for holder snapshots and campaign access.',
      'Stay eligible without needing to lock, depending on campaign rules.',
    ],
  },
  {
    title: 'For Lockers',
    accent: PURPLE,
    items: [
      'Turn $WCB commitment into wallet-bound credits.',
      'Compete on the lock leaderboard using locked amount and duration.',
      'Prepare betting-credit capacity before live markets open.',
      'Show stronger long-term commitment than holding alone.',
    ],
  },
  {
    title: 'For Active Players',
    accent: GREEN,
    items: [
      'Use the match app during tournament windows.',
      'Join campaigns tied to fixtures, predictions, or market activity.',
      'Combine holder rank, lock credits, and activity for eligibility.',
      'Compete for rewards funded by transparent prize pool credit.',
    ],
  },
];

const LEADERBOARD_CARDS = [
  {
    title: 'Holder Board',
    accent: GOLD,
    body: 'Ranks wallets by $WCB balance. This is the ownership layer.',
    bullets: ['Shows holder rank', 'Uses token account balances', 'Good for holder snapshots'],
  },
  {
    title: 'Lock Board',
    accent: PURPLE,
    body: 'Ranks wallets by active locked amount and credits. This is the commitment layer.',
    bullets: ['Uses Streamflow locks', 'Shows locked $WCB and credits', 'Keeps lock rank separate from holdings'],
  },
];

const PRIZE_POOL_STEPS = [
  {
    title: 'Volume is tracked',
    body: 'The app reads token volume from the configured market data source.',
  },
  {
    title: 'Creator fee is estimated',
    body: 'The fee rate follows the configured creator-fee setting or the Pump.fun tier model.',
  },
  {
    title: 'Credit is displayed',
    body: 'The app displays estimated prize pool credit so users can understand reward capacity.',
  },
  {
    title: 'Campaigns can allocate it',
    body: 'Future campaigns can use holder rank, lock credits, and match activity for eligibility.',
  },
];

const WHITEPAPER_SECTIONS = [
  {
    title: '1. The Problem',
    body: 'World Cup attention is huge but short. Most crypto sports pages do not give users a clear reason to keep returning before matches start. They show a token and a promise, but not a real product loop.',
  },
  {
    title: '2. The Product',
    body: 'WORLDCUPBET is a Solana-native World Cup app. Users can explore matches, connect a wallet, hold $WCB, lock $WCB for credits, and track their rank before and during the tournament.',
  },
  {
    title: '3. The Utility Loop',
    body: 'The loop is simple: hold for status, lock for credits, prepare for betting access, use the app during match windows, and qualify for campaigns based on visible wallet behavior.',
  },
  {
    title: '4. The Reward Model',
    body: 'Prize pool credit is designed to be backed by creator-fee activity. It is shown as a live estimate so future campaign rewards can be connected to real usage instead of arbitrary emissions.',
  },
  {
    title: '5. The Trust Model',
    body: 'Holder rank comes from token accounts. Lock rank comes from Streamflow. Prize pool credit comes from market volume and transparent fee assumptions. Each layer has a separate source.',
  },
];

const ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Pre-launch App',
    window: 'Now - May 2026',
    status: 'In progress',
    items: ['Docs and whitepaper', 'Match and group pages', 'Token and wallet surfaces'],
  },
  {
    phase: 'Phase 2',
    title: 'Holder Layer',
    window: 'May - June 2026',
    status: 'Activation',
    items: ['Live holder leaderboard', 'Holder tiers and badges', 'Snapshot-ready wallet ranking'],
  },
  {
    phase: 'Phase 3',
    title: 'Lock Credit Layer',
    window: 'Before kickoff',
    status: 'Utility',
    items: ['Streamflow lock tracking', 'Credit leaderboard', 'Wallet lock dashboard'],
  },
  {
    phase: 'Phase 4',
    title: 'Tournament Layer',
    window: 'June 11, 2026+',
    status: 'Live event',
    items: ['Betting layer activation', 'Matchday campaign windows', 'Prize pool credit tracking', 'Holder and locker rewards'],
  },
];

const FAQS = [
  {
    q: 'Is $WCB only a meme token?',
    a: '$WCB is positioned as the access and status token for the WORLDCUPBET app. The app gives it visible utility through holder rank, lock credits, and campaign eligibility.',
  },
  {
    q: 'Why are there two leaderboards?',
    a: 'Because holding and locking are different behaviors. Holder board shows ownership. Lock board shows commitment and prepared credits.',
  },
  {
    q: 'Is prize pool credit guaranteed payout?',
    a: 'No. It is a transparent credit estimate for reward capacity. Actual campaign rules, eligibility, and distribution windows should be announced per campaign.',
  },
  {
    q: 'What is live now?',
    a: 'The app can show tournament pages, token access, wallet connection, holder data, Streamflow lock data, and estimated prize pool credit when the required API keys and token address are configured.',
  },
];

function AppButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link href={href} className={primary ? 'btn-primary' : 'btn-secondary'} style={{ minWidth: 150 }}>
      {children}
    </Link>
  );
}

function ExternalButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ minWidth: 150 }}>
      {children}
    </a>
  );
}

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.55rem 0.78rem',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: TEXT_SOFT,
        fontSize: '0.78rem',
        fontWeight: 800,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </a>
  );
}

function Section({
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
      <div className="docs-section-grid" style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 10 }}>
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-4xl" style={{ color: TEXT, fontWeight: 900, lineHeight: 1.1, marginBottom: '0.75rem' }}>
            {title}
          </h2>
          {intro && (
            <p style={{ color: TEXT_SOFT, lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              {intro}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function StatusCard({
  label,
  value,
  accent = GOLD,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div style={{ padding: '0.95rem', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p style={{ color: TEXT_MUTED, fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>
        {label}
      </p>
      <p style={{ color: accent, fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  step,
  title,
  body,
  action,
  href,
}: {
  step: string;
  title: string;
  body: string;
  action: string;
  href: string;
}) {
  return (
    <div className="card card-hover" style={{ padding: '1.25rem', background: CARD, minHeight: '100%' }}>
      <p style={{ color: GOLD, fontSize: '0.72rem', fontWeight: 900, marginBottom: 10 }}>
        {step}
      </p>
      <h3 style={{ color: TEXT, fontSize: '1.05rem', fontWeight: 900, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem' }}>
        {body}
      </p>
      <Link href={href} style={{ color: GOLD_SOFT, fontSize: '0.82rem', fontWeight: 900, textDecoration: 'none' }}>
        {action}
      </Link>
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

export default function DocsPage() {
  const mintDisplay = WCB_MINT ? `${WCB_MINT.slice(0, 8)}...${WCB_MINT.slice(-6)}` : 'Set by token config';

  return (
    <div style={{ background: '#070707' }}>
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="docs-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                <BrandLogo size="lg" showText={false} />
                <span style={{ padding: '0.28rem 0.72rem', borderRadius: 9999, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)', color: GREEN, fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Simple Docs
                </span>
                <span style={{ padding: '0.28rem 0.72rem', borderRadius: 9999, background: 'rgba(242,181,68,0.1)', border: '1px solid rgba(242,181,68,0.25)', color: GOLD_SOFT, fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Whitepaper v1
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl" style={{ color: TEXT, lineHeight: 1, fontWeight: 900, marginBottom: '1rem', maxWidth: 900 }}>
                WORLDCUPBET is a World Cup app powered by $WCB.
              </h1>
              <p style={{ color: TEXT_SOFT, fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 780, marginBottom: '1.35rem' }}>
                The idea is simple: hold $WCB for status, lock $WCB for credits, and use those visible wallet signals inside World Cup 2026 match campaigns.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: '1.35rem' }}>
                <StatusCard label="Chain" value="Solana" />
                <StatusCard label="Token" value="$WCB" />
                <StatusCard label="Lock source" value="Streamflow" accent={PURPLE} />
                <StatusCard label="Kickoff" value="June 11, 2026" accent={GREEN} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <AppButton href="/leaderboard" primary>
                  Open Leaderboards
                </AppButton>
                <AppButton href="/lock">
                  Lock $WCB
                </AppButton>
                <ExternalButton href={PUMPFUN}>
                  Buy $WCB
                </ExternalButton>
                <ExternalButton href={JUPITER}>
                  Swap
                </ExternalButton>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {NAV_ITEMS.map((item) => (
                  <NavPill key={item.href} href={item.href}>
                    {item.label}
                  </NavPill>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.2rem', background: SURFACE, boxShadow: '0 28px 80px rgba(0,0,0,0.36)' }}>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>
                One-Minute Summary
              </p>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[
                  ['Hold', 'Build holder rank from wallet balance.'],
                  ['Lock', 'Turn locked $WCB into wallet-bound credits.'],
                  ['Betting', 'Coming soon for World Cup match windows.'],
                  ['Benefits', 'Use holder, locker, and activity status for campaigns.'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '0.9rem', borderRadius: 8, background: CARD, border: `1px solid ${BORDER}` }}>
                    <p style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 900, marginBottom: 4 }}>{label}</p>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="docs-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.25rem', alignItems: 'start' }}>
          <main>
            <Section
              id="start"
              eyebrow="Start Here"
              title="What is WORLDCUPBET?"
              intro="WORLDCUPBET is a Solana-native app built around the 2026 World Cup. It gives $WCB holders a visible role inside the product instead of leaving the token as a standalone chart."
            >
              <div className="card" style={{ padding: '1.35rem', background: CARD }}>
                <p style={{ color: TEXT_SOFT, fontSize: '1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                  The app has three clear layers:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <StatusCard label="Ownership" value="Holder rank" />
                  <StatusCard label="Commitment" value="Lock credits" accent={PURPLE} />
                  <StatusCard label="Rewards" value="Prize pool credit" accent={GREEN} />
                </div>
                <p style={{ color: TEXT_SOFT, fontSize: '0.92rem', lineHeight: 1.75, marginTop: '1rem', marginBottom: 0 }}>
                  A user should understand the app without reading a complex whitepaper: buy or hold $WCB, lock if they want credits, then participate when tournament campaigns open.
                </p>
              </div>
            </Section>

            <Section
              id="how-it-works"
              eyebrow="How It Works"
              title="Three user actions."
              intro="The product loop is intentionally simple. Every important action has a visible output in the app."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {USER_ACTIONS.map((item) => (
                  <ActionCard key={item.step} {...item} />
                ))}
              </div>

              <div style={{ overflowX: 'auto', marginTop: '1rem', borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                  <thead>
                    <tr style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                      {['Layer', 'Data Source', 'What It Means', 'Status'].map((head) => (
                        <th key={head} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: TEXT_MUTED, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SYSTEM_ROWS.map((row) => (
                      <tr key={row.layer} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT, fontWeight: 900 }}>{row.layer}</td>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT_SOFT }}>{row.source}</td>
                        <td style={{ padding: '0.95rem 1rem', color: TEXT_SOFT }}>{row.means}</td>
                        <td style={{ padding: '0.95rem 1rem', color: GREEN, fontWeight: 800 }}>{row.live}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section
              id="lock-credits"
              eyebrow="Lock & Credits"
              title="How locking works."
              intro="Locking is the commitment layer of WORLDCUPBET. It is designed for users who want to prepare a stronger launch position before the betting layer opens."
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={{ marginBottom: '1rem' }}>
                {LOCK_MECHANISM.map((item, index) => (
                  <div key={item.title} style={{ padding: '1rem', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, minHeight: 176 }}>
                    <p style={{ color: PURPLE, fontSize: '0.72rem', fontWeight: 900, marginBottom: 8 }}>
                      0{index + 1}
                    </p>
                    <h3 style={{ color: TEXT, fontSize: '0.95rem', fontWeight: 900, marginBottom: 7 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: '1.2rem', background: CARD }}>
                <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: '0.85rem' }}>
                  What credits mean inside the app
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CREDIT_RULES.map((rule) => (
                    <div key={rule.label} style={{ padding: '0.9rem', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}` }}>
                      <p style={{ color: GOLD, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                        {rule.label}
                      </p>
                      <p style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
                        {rule.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <AppButton href="/lock" primary>
                  Open Lock Page
                </AppButton>
                <AppButton href="/leaderboard">
                  View Lock Board
                </AppButton>
              </div>
            </Section>

            <Section
              id="betting"
              eyebrow="Betting Coming Soon"
              title="How the betting layer is intended to work."
              intro="The current app prepares users before World Cup betting opens. The betting layer is presented as coming soon, so users understand what is planned without confusing previews with live wagering."
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {BETTING_FLOW.map((item) => (
                  <div key={item.phase} className="card" style={{ padding: '1rem', background: CARD, minHeight: 186 }}>
                    <p style={{ color: GREEN, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>
                      {item.phase}
                    </p>
                    <h3 style={{ color: TEXT, fontSize: '0.95rem', fontWeight: 900, marginBottom: 7 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 10, background: 'rgba(242,181,68,0.07)', border: '1px solid rgba(242,181,68,0.22)' }}>
                <h3 style={{ color: GOLD_SOFT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                  Important status note
                </h3>
                <p style={{ color: TEXT_SOFT, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  Betting is not presented as live in the docs. The app currently uses match pages, leaderboards, locks, and prize pool credit to prepare the launch experience. Live betting functionality should be activated only when the final market layer is configured.
                </p>
              </div>
            </Section>

            <Section
              id="benefits"
              eyebrow="Benefits"
              title="What users get from each role."
              intro="The app should make the value of holding, locking, and participating easy to understand before users connect a wallet."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="card card-hover" style={{ padding: '1.2rem', background: CARD }}>
                    <p style={{ color: benefit.accent, fontSize: '0.72rem', fontWeight: 900, marginBottom: 8 }}>
                      {benefit.title}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
                      {benefit.items.map((item) => (
                        <li key={item} style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.55 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              id="leaderboards"
              eyebrow="Leaderboards"
              title="Two boards, two meanings."
              intro="This is the most important distinction in the app: holding and locking are not the same action."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEADERBOARD_CARDS.map((card) => (
                  <div key={card.title} className="card card-hover" style={{ padding: '1.25rem', background: CARD }}>
                    <p style={{ color: card.accent, fontSize: '0.7rem', fontWeight: 900, marginBottom: 8 }}>
                      {card.title}
                    </p>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                      {card.body}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.45rem' }}>
                      {card.bullets.map((bullet) => (
                        <li key={bullet} style={{ color: TEXT_SOFT, fontSize: '0.86rem', lineHeight: 1.55 }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <AppButton href="/leaderboard" primary>
                  View Leaderboards
                </AppButton>
                <AppButton href="/lock">
                  Create Lock
                </AppButton>
              </div>
            </Section>

            <Section
              id="prize-pool"
              eyebrow="Prize Pool"
              title="Prize pool credit, explained clearly."
              intro="Prize pool credit is not shown as a guaranteed payout. It is a live estimate of reward capacity based on creator-fee assumptions and market volume."
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {PRIZE_POOL_STEPS.map((step, index) => (
                  <div key={step.title} style={{ padding: '1rem', borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}`, minHeight: 168 }}>
                    <p style={{ color: GREEN, fontSize: '0.72rem', fontWeight: 900, marginBottom: 8 }}>
                      0{index + 1}
                    </p>
                    <h3 style={{ color: TEXT, fontSize: '0.95rem', fontWeight: 900, marginBottom: 7 }}>
                      {step.title}
                    </h3>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: '1.15rem', background: 'rgba(20,241,149,0.07)', border: '1px solid rgba(20,241,149,0.24)', marginTop: '1rem' }}>
                <h3 style={{ color: GREEN, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                  Simple formula
                </h3>
                <p style={{ color: TEXT_SOFT, lineHeight: 1.7, margin: 0 }}>
                  Prize Pool Credit = Token Volume x Estimated Creator Fee Rate x Prize Allocation.
                </p>
              </div>
            </Section>

            <Section
              id="whitepaper"
              eyebrow="Whitepaper"
              title="The full thesis, without unnecessary jargon."
              intro="This section gives the longer explanation for users, partners, and community members who want to understand the product model."
            >
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {WHITEPAPER_SECTIONS.map((item) => (
                  <div key={item.title} className="card" style={{ padding: '1.15rem', background: CARD }}>
                    <h3 style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: TEXT_SOFT, fontSize: '0.92rem', lineHeight: 1.75, margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              id="roadmap"
              eyebrow="Roadmap"
              title="Roadmap to the tournament."
              intro="The roadmap is grouped by product layer so users can see what each stage adds to the app."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROADMAP.map((item) => (
                  <div key={item.phase} className="card" style={{ padding: '1.15rem', background: CARD }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <p style={{ color: GOLD, fontSize: '0.66rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                        {item.phase}
                      </p>
                      <span style={{ padding: '0.18rem 0.55rem', borderRadius: 9999, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)', color: GREEN, fontSize: '0.62rem', fontWeight: 900 }}>
                        {item.status}
                      </span>
                    </div>
                    <h3 style={{ color: TEXT, fontSize: '1.05rem', fontWeight: 900, marginBottom: 4 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: TEXT_MUTED, fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.9rem' }}>
                      {item.window}
                    </p>
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
            </Section>

            <Section
              id="faq"
              eyebrow="FAQ"
              title="Clear answers."
              intro="Short answers for the parts users are most likely to question."
            >
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {FAQS.map((faq) => (
                  <details key={faq.q} className="card" style={{ padding: '1rem 1.1rem', background: CARD }}>
                    <summary style={{ color: TEXT, fontWeight: 900, cursor: 'pointer' }}>
                      {faq.q}
                    </summary>
                    <p style={{ color: TEXT_SOFT, lineHeight: 1.7, margin: '0.8rem 0 0' }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </Section>
          </main>

          <aside className="docs-sidebar" style={{ position: 'sticky', top: '6rem', paddingTop: '2.5rem' }}>
            <div className="card" style={{ padding: '1.15rem', background: SURFACE, marginBottom: '1rem' }}>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>
                Docs Menu
              </p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {NAV_ITEMS.map((item) => (
                  <a key={item.href} href={item.href} className="sidebar-nav-link">
                    {item.label}
                    <span style={{ color: TEXT_MUTED }}>#</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.15rem', background: SURFACE, marginBottom: '1rem' }}>
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>
                Protocol Facts
              </p>
              <SpecRow label="Token" value="$WCB" />
              <SpecRow label="Mint" value={mintDisplay} />
              <SpecRow label="Network" value="Solana" />
              <SpecRow label="Holder data" value="Token accounts" />
              <SpecRow label="Lock data" value="Streamflow" />
              <SpecRow label="Prize data" value="Estimated fee credit" />
            </div>

            <div className="card" style={{ padding: '1.15rem', background: SURFACE }}>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>
                Quick Actions
              </p>
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                <AppButton href="/leaderboard" primary>
                  Leaderboards
                </AppButton>
                <AppButton href="/lock">
                  Lock & Earn
                </AppButton>
                <AppButton href="/matches">
                  Matches
                </AppButton>
                <AppButton href="/token">
                  Token Page
                </AppButton>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .docs-hero-grid,
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
