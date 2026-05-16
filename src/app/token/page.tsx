'use client';

import { formatPrice, formatMarketCap } from '@/lib/utils/formatters';
import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { WCB_MINT } from '@/lib/tokenConfig';
import { FIXED_LOCK_DAYS } from '@/lib/lock';

const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? `https://pump.fun/coin/${WCB_MINT}`;
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? `https://jup.ag/swap/SOL-${WCB_MINT}`;

export default function TokenPage() {
  const { data: metrics, isLoading, error, refetch } = useTokenMetrics();
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const stats = [
    { label: 'Price',     value: isLoading ? 'Syncing' : formatPrice(metrics?.price ?? 0),                change: metrics?.priceChange24h },
    { label: 'Market Cap',value: isLoading ? 'Syncing' : formatMarketCap(metrics?.marketCap ?? 0) },
    { label: 'Holders',   value: isLoading ? 'Syncing' : (metrics?.holders ?? 0).toLocaleString('en-US') },
    { label: '24h Volume',value: isLoading ? 'Syncing' : formatMarketCap(metrics?.volume24hUsd ?? 0) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">

      {/* Hero card */}
      <div className="card p-8 sm:p-10 mb-8 relative overflow-hidden">
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" showText={false} />
              <div>
                <p className="section-eyebrow mb-1">$WCB Token</p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#FFFFFF' }}>
                  World Cup Bet — Solana access token.
                </h1>
              </div>
            </div>
            <PumpFunBadge />
          </div>

          <p className="text-base max-w-2xl mb-6 leading-relaxed" style={{ color: '#B3B3B3' }}>
            $WCB is the access token for the WORLDCUPBET platform. Holders unlock leaderboard tiers, lock credits, and priority access to match markets when World Cup 2026 opens on June 11, 2026.
          </p>

          {/* Data source note */}
          {(errorMessage || metrics?.source) && (
            <div className="mb-4 text-xs font-semibold" style={{ color: '#6E6E6E' }}>
              {errorMessage
                ? <span style={{ color: '#EF4444' }}>Data unavailable: {errorMessage}</span>
                : <>Source: {metrics?.source ?? 'live'}{metrics?.lastUpdated ? ` · Updated ${new Date(metrics.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}</>
              }
            </div>
          )}

          {/* Live metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg px-4 py-4" style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-bold uppercase tracking-widest mb-1" style={{ fontSize: '10px', color: '#6E6E6E' }}>
                  {s.label}
                </p>
                <p className="text-xl font-black tabular-nums" style={{ color: '#FFFFFF' }}>
                  {s.value}
                </p>
                {s.change !== undefined && (
                  <p className="text-xs font-bold mt-1" style={{ color: s.change >= 0 ? '#14F195' : '#DC2626' }}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a href={PUMPFUN} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
              Buy $WCB on Pump.fun
            </a>
            <a href={JUPITER} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
              Swap on Jupiter
            </a>
            <button onClick={() => void refetch()} className="btn-secondary flex-1">
              Refresh Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Token specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Network',   value: 'Solana',          color: '#14F195', note: 'Mainnet' },
          { label: 'Lock Term', value: `${FIXED_LOCK_DAYS} Days`, color: '#9945FF', note: 'Via Streamflow' },
          { label: 'Launched',  value: 'Pump.fun',        color: '#F2B544', note: 'Community token' },
        ].map((item) => (
          <div key={item.label} className="card" style={{ padding: '1.25rem', background: '#111111' }}>
            <p style={{ color: '#6E6E6E', fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              {item.label}
            </p>
            <p style={{ color: item.color, fontSize: '1.1rem', fontWeight: 900, margin: '0 0 2px' }}>
              {item.value}
            </p>
            <p style={{ color: '#6E6E6E', fontSize: '0.72rem', margin: 0 }}>{item.note}</p>
          </div>
        ))}
      </div>

      {/* Token utility */}
      <section className="mb-8">
        <h2 className="text-2xl font-black mb-5" style={{ color: '#FFFFFF' }}>Token Utility</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Holder Leaderboard',   desc: 'Wallet balance determines holder tier: Bronze, Silver, Gold, Platinum.' },
            { title: 'Lock Credits',          desc: `Lock $WCB for ${FIXED_LOCK_DAYS} days via Streamflow to earn platform credits used for betting.` },
            { title: 'Betting Access',        desc: 'Credits become usable betting balance when match markets open on June 11, 2026.' },
            { title: 'Prize Pool Share',      desc: 'Creator fee from $WCB volume funds the prize pool distributed to holders and lockers.' },
            { title: 'Early Mover Advantage', desc: 'Lock before launch to receive a higher credit multiplier while the pre-market window is open.' },
            { title: 'Snapshot Eligibility', desc: 'Holder rank and lock credits are captured at each distribution snapshot window.' },
          ].map((u, i) => (
            <div key={u.title} className="card p-5">
              <div style={{ color: '#F2B544', fontSize: '0.72rem', fontWeight: 900, marginBottom: 8 }}>0{i + 1}</div>
              <h3 className="font-bold mb-2" style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{u.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#B3B3B3' }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#FFFFFF' }}>Current Phase</h2>
        <p className="text-sm mb-5" style={{ color: '#B3B3B3' }}>Two product phases with clear milestones.</p>
        <div className="space-y-3">
          {[
            {
              date: 'Now — May 2026',
              title: 'Pre-launch: lock credits and leaderboard preparation',
              desc: 'Lock $WCB to earn credits. Holder and lock leaderboards are live. Prize pool accumulates from creator fee.',
              status: 'active',
            },
            {
              date: 'June 11, 2026',
              title: 'World Cup markets open',
              desc: 'Match markets activate, credits become usable betting balance, and prize pool distribution windows open.',
              status: 'upcoming',
            },
          ].map((r, i) => (
            <div
              key={i}
              className="card p-5 flex items-start gap-4"
              style={r.status === 'active' ? { borderColor: 'rgba(242,181,68,0.38)', background: 'rgba(242,181,68,0.05)' } : {}}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={r.status === 'active' ? { background: '#F2B544', color: '#070707' } : { background: '#111111', color: '#B3B3B3', border: '1px solid #2A2A2A' }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold" style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{r.title}</h3>
                  {r.status === 'active' && (
                    <span className="badge badge-live">
                      <span className="live-dot" aria-hidden="true" /> Active
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#6E6E6E' }}>{r.date}</p>
                <p className="text-sm" style={{ color: '#B3B3B3' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
