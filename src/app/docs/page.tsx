import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { WCB_MINT } from '@/lib/wallet';

export const metadata = {
  title: 'Documentation & Whitepaper | WORLDCUPBET',
  description:
    'WORLDCUPBET documentation for the World Cup 2026 app, $WCB holder ranking, Streamflow lock credits, and prize pool credit calculation.',
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

const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag';

const NAV_ITEMS = [
  { href: '#start', label: 'Overview' },
  { href: '#how-it-works', label: 'Mechanism' },
  { href: '#lock-credits', label: 'Lock & Credits' },
  { href: '#betting', label: 'Betting Status' },
  { href: '#benefits', label: 'User Categories' },
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
    body: 'A wallet that holds $WCB can be included in the holder leaderboard based on its token balance.',
    action: 'View holder leaderboard',
    href: '/leaderboard',
  },
  {
    step: '02',
    title: 'Lock $WCB',
    body: 'A wallet can lock $WCB through Streamflow. The app records the locked amount and calculates credits separately from liquid holdings.',
    action: 'Open lock page',
    href: '/lock',
  },
  {
    step: '03',
    title: 'Participate during the tournament',
    body: 'When tournament features are active, holder balance, lock credits, and eligible activity can be used for reward or access rules.',
    action: 'View matches',
    href: '/matches',
  },
];

const SYSTEM_ROWS = [
  {
    layer: 'Holder Leaderboard',
    source: 'Live token accounts for the $WCB mint',
    means: 'Ranks wallets by current $WCB balance.',
    live: 'Live when the token address and RPC provider are configured',
  },
  {
    layer: 'Lock Leaderboard',
    source: 'Active Streamflow locks for the same $WCB mint',
    means: 'Ranks wallets by active locked amount and calculated credits.',
    live: 'Read from Streamflow lock accounts',
  },
  {
    layer: 'Prize Pool Credit',
    source: 'Estimated creator fee from token volume',
    means: 'Shows estimated reward capacity. It is not a guaranteed payout.',
    live: 'Estimated from market volume and configured fee settings',
  },
];

const LOCK_MECHANISM = [
  {
    title: 'Connect wallet',
    body: 'The app reads the connected Solana wallet to check $WCB balance and lock records.',
  },
  {
    title: 'Choose amount and duration',
    body: 'The lock page estimates credits from the selected token amount and lock duration before the transaction is submitted.',
  },
  {
    title: 'Lock through Streamflow',
    body: 'The lock transaction is created through Streamflow, allowing the lock record to be verified on an external platform.',
  },
  {
    title: 'Receive credit position',
    body: 'Credits are assigned to the wallet inside the app and used for ranking and eligibility calculations.',
  },
];

const CREDIT_RULES = [
  {
    label: 'Base rule',
    value: 'Credits are calculated from locked amount and lock duration.',
  },
  {
    label: 'Wallet-bound',
    value: 'Credits are associated with the wallet and are not transferable tokens.',
  },
  {
    label: 'Ranking use',
    value: 'Credits determine the wallet position on the lock leaderboard.',
  },
  {
    label: 'Future use',
    value: 'Credits may be referenced by future access, reward, or tournament rules.',
  },
];

const BETTING_FLOW = [
  {
    phase: 'Preview',
    title: 'Match information before launch',
    body: 'Users can review fixtures, groups, and match information before betting functionality is activated.',
  },
  {
    phase: 'Access',
    title: 'Wallet-based access rules',
    body: '$WCB balance, holder rank, and lock credits may be used for access or eligibility rules.',
  },
  {
    phase: 'Market',
    title: 'Betting layer coming soon',
    body: 'Betting functionality is planned for the World Cup period. Final availability depends on product configuration and applicable rules.',
  },
  {
    phase: 'Reward',
    title: 'Reward calculation',
    body: 'Reward rules may reference match activity, holder balance, lock credits, and prize pool credit.',
  },
];

const BENEFITS = [
  {
    title: 'Holders',
    accent: GOLD,
    items: [
      'Appear on the holder leaderboard by wallet balance.',
      'Be grouped into tiers based on balance thresholds.',
      'Be included in holder snapshots when applicable.',
      'Remain separate from the lock leaderboard.',
    ],
  },
  {
    title: 'Lock Participants',
    accent: PURPLE,
    items: [
      'Convert active $WCB locks into wallet-bound credits.',
      'Compete on the lock leaderboard using locked amount and duration.',
      'Keep locked balances separate from liquid holdings.',
      'Use Streamflow records as the lock data source.',
    ],
  },
  {
    title: 'Tournament Participants',
    accent: GREEN,
    items: [
      'Use match pages during tournament windows.',
      'Take part in eligible prediction or match activities when available.',
      'Have holder balance, lock credits, and activity evaluated separately.',
      'Receive rewards only under published product rules.',
    ],
  },
];

const LEADERBOARD_CARDS = [
  {
    title: 'Holder Board',
    accent: GOLD,
    body: 'Ranks wallets by $WCB balance.',
    bullets: ['Shows holder rank', 'Uses token account balances', 'Supports holder snapshots'],
  },
  {
    title: 'Lock Board',
    accent: PURPLE,
    body: 'Ranks wallets by active locked amount and calculated credits.',
    bullets: ['Uses Streamflow locks', 'Shows locked $WCB and credits', 'Keeps lock rank separate from holdings'],
  },
];

const PRIZE_POOL_STEPS = [
  {
    title: 'Volume is tracked',
    body: 'The app reads token volume from the configured market data provider.',
  },
  {
    title: 'Creator fee is estimated',
    body: 'The fee rate uses the configured creator-fee setting or the selected fee model.',
  },
  {
    title: 'Credit is displayed',
    body: 'The app displays estimated prize pool credit for transparency.',
  },
  {
    title: 'Rules can reference it',
    body: 'Future reward rules can reference holder rank, lock credits, and match activity.',
  },
];

const WHITEPAPER_SECTIONS = [
  {
    title: '1. The Problem',
    body: 'World Cup activity is concentrated around a limited event period. Many token-based sports pages do not provide clear pre-tournament functions beyond basic token promotion.',
  },
  {
    title: '2. The Product',
    body: 'WORLDCUPBET is a Solana-based World Cup application. Users can review matches, connect a wallet, hold $WCB, lock $WCB for credits, and view leaderboard positions.',
  },
  {
    title: '3. The Participation Model',
    body: 'The model has separate functions for holding, locking, and tournament activity. Each function has its own data source and display area.',
  },
  {
    title: '4. The Reward Model',
    body: 'Prize pool credit is estimated from market activity and fee assumptions. It is an informational metric and does not create a guaranteed payout.',
  },
  {
    title: '5. The Trust Model',
    body: 'Holder rank is based on token accounts. Lock rank is based on Streamflow lock records. Prize pool credit is based on market volume and configured fee assumptions.',
  },
];

const ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Pre-Launch Application',
    window: 'Now - May 2026',
    status: 'In progress',
    items: ['Documentation and whitepaper', 'Match and group pages', 'Token and wallet pages'],
  },
  {
    phase: 'Phase 2',
    title: 'Holder Layer',
    window: 'May - June 2026',
    status: 'Activation',
    items: ['Live holder leaderboard', 'Holder tiers', 'Wallet ranking for snapshots'],
  },
  {
    phase: 'Phase 3',
    title: 'Lock Credit Layer',
    window: 'Before kickoff',
    status: 'Implementation',
    items: ['Streamflow lock tracking', 'Credit leaderboard', 'Wallet lock dashboard'],
  },
  {
    phase: 'Phase 4',
    title: 'Tournament Layer',
    window: 'June 11, 2026+',
    status: 'Live event',
    items: ['Betting layer activation', 'Matchday reward windows', 'Prize pool credit tracking', 'Holder and lock participant rewards'],
  },
];

const FAQS = [
  {
    q: 'What is $WCB used for?',
    a: '$WCB is used by the app for holder ranking, lock credit calculation, and eligibility checks where applicable.',
  },
  {
    q: 'Why are there two leaderboards?',
    a: 'Holding and locking are different actions. The holder leaderboard ranks liquid token balances. The lock leaderboard ranks active Streamflow locks and calculated credits.',
  },
  {
    q: 'Is prize pool credit guaranteed payout?',
    a: 'No. Prize pool credit is an estimate. Actual rewards depend on published rules, eligibility criteria, and distribution windows.',
  },
  {
    q: 'What is live now?',
    a: 'The app can show tournament pages, token access, wallet connection, holder data, Streamflow lock data, and estimated prize pool credit when the required configuration is available.',
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
                  Documentation
                </span>
                <span style={{ padding: '0.28rem 0.72rem', borderRadius: 9999, background: 'rgba(242,181,68,0.1)', border: '1px solid rgba(242,181,68,0.25)', color: GOLD_SOFT, fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Whitepaper v1
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl" style={{ color: TEXT, lineHeight: 1, fontWeight: 900, marginBottom: '1rem', maxWidth: 900 }}>
                WORLDCUPBET Documentation
              </h1>
              <p style={{ color: TEXT_SOFT, fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 780, marginBottom: '1.35rem' }}>
                WORLDCUPBET is a World Cup 2026 application that uses $WCB for holder ranking, Streamflow lock credits, and eligibility calculations.
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
                Summary
              </p>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[
                  ['Hold', 'Holder ranking is based on wallet balance.'],
                  ['Lock', 'Lock credits are calculated from active Streamflow locks.'],
                  ['Betting', 'Betting functionality is marked as coming soon.'],
                  ['Rewards', 'Rewards depend on published eligibility rules.'],
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
              eyebrow="Overview"
              title="Application overview."
              intro="WORLDCUPBET is a Solana-based application for World Cup 2026. It connects match pages, wallet balances, token locks, and leaderboard data in one interface."
            >
              <div className="card" style={{ padding: '1.35rem', background: CARD }}>
                <p style={{ color: TEXT_SOFT, fontSize: '1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                  The application has three primary data areas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <StatusCard label="Ownership" value="Holder rank" />
                  <StatusCard label="Locking" value="Lock credits" accent={PURPLE} />
                  <StatusCard label="Rewards" value="Prize pool credit" accent={GREEN} />
                </div>
                <p style={{ color: TEXT_SOFT, fontSize: '0.92rem', lineHeight: 1.75, marginTop: '1rem', marginBottom: 0 }}>
                  These areas are displayed separately so users can distinguish liquid holdings, locked positions, and estimated reward capacity.
                </p>
              </div>
            </Section>

            <Section
              id="how-it-works"
              eyebrow="Mechanism"
              title="Primary user actions."
              intro="Each user action has a separate output and data source."
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
              intro="Locking is used to calculate wallet-bound credits from Streamflow lock records."
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
                  Credit rules
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
              eyebrow="Betting Status"
              title="Betting functionality status."
              intro="The current documentation treats betting as a planned feature. It should not be read as live wagering functionality."
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
                  Status note
                </h3>
                <p style={{ color: TEXT_SOFT, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  Betting is not presented as live in this documentation. The current product surfaces match pages, leaderboards, locks, and prize pool credit. Betting functionality should only be activated when the required product and compliance configuration is complete.
                </p>
              </div>
            </Section>

            <Section
              id="benefits"
              eyebrow="User Categories"
              title="User categories."
              intro="The app separates users by measurable actions: holding, locking, and tournament participation."
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
              title="Two leaderboard types."
              intro="Holding and locking are separate actions and are ranked separately."
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
              title="Prize pool credit."
              intro="Prize pool credit is an estimate of reward capacity based on token volume and fee assumptions. It is not a guaranteed payout."
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
                  Formula
                </h3>
                <p style={{ color: TEXT_SOFT, lineHeight: 1.7, margin: 0 }}>
                  Prize Pool Credit = Token Volume x Estimated Creator Fee Rate x Prize Allocation.
                </p>
              </div>
            </Section>

            <Section
              id="whitepaper"
              eyebrow="Whitepaper"
              title="Product rationale."
              intro="This section explains the product model in formal terms."
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
              intro="The roadmap is grouped by product area."
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
              title="Frequently asked questions."
              intro="Concise answers to common product questions."
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
                System Facts
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
                Actions
              </p>
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                <AppButton href="/leaderboard" primary>
                  Leaderboards
                </AppButton>
                <AppButton href="/lock">
                  Lock $WCB
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
