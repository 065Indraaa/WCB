'use client';

import { useState } from 'react';
import { formatPrice, formatMarketCap } from '@/lib/utils/formatters';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';
import { BrandLogo } from '@/components/shared/BrandLogo';

const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag';
const CONTRACT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'Coming soon';

// Static mock data — replace with real API when token is live
const MOCK_METRICS = {
  price: 0.000042,
  priceChange24h: 4.2,
  marketCap: 420000,
  holders: 1250,
  burned: 2100000000,
};

export default function TokenPage() {
  const metrics = MOCK_METRICS;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (CONTRACT === 'Coming soon') return;
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const display =
    CONTRACT.length > 20 ? `${CONTRACT.slice(0, 8)}...${CONTRACT.slice(-8)}` : CONTRACT;

  const stats = [
    { label: 'Price', value: formatPrice(metrics.price), change: metrics.priceChange24h },
    { label: 'Market Cap', value: formatMarketCap(metrics.marketCap) },
    { label: 'Holders', value: metrics.holders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
    { label: 'Burned', value: formatMarketCap(metrics.burned).replace('$', '') },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Hero card */}
      <div className="card p-8 sm:p-12 mb-10 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #DCFCE7 0%, transparent 70%)',
            opacity: 0.4,
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" showText={false} />
              <div>
                <p className="section-eyebrow mb-1">$WCB Token</p>
                <h1
                  className="text-3xl sm:text-4xl font-black tracking-tight"
                  style={{ color: '#0F172A' }}
                >
                  WORLDCUPBET
                </h1>
              </div>
            </div>
            <PumpFunBadge />
          </div>

          <p
            className="text-lg max-w-2xl mb-8 leading-relaxed"
            style={{ color: '#334155' }}
          >
            $WCB is the official community token for the 2026 FIFA World Cup prediction platform.
            Hold to unlock priority access to predictions, NFT whitelist, leaderboard tiers, and
            exclusive rewards when betting goes live.
          </p>

          {/* Live metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-4 py-4"
                style={{ background: '#F1F5F0', border: '1px solid #E2E8F0' }}
              >
                <p
                  className="font-bold uppercase tracking-widest mb-1"
                  style={{ fontSize: '10px', color: '#64748B' }}
                >
                  {s.label}
                </p>
                <p
                  className="text-xl font-black tabular-nums"
                  style={{ color: '#0F172A' }}
                >
                  {s.value}
                </p>
                {s.change !== undefined && (
                  <p
                    className="text-xs font-bold mt-1"
                    style={{ color: s.change >= 0 ? '#15803D' : '#DC2626' }}
                  >
                    {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PUMPFUN}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1"
            >
              🚀 Buy $WCB on Pump.fun
            </a>
            <a
              href={JUPITER}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1"
            >
              ⚡ Swap on Jupiter
            </a>
          </div>

          {/* Contract address */}
          <div
            className="flex flex-wrap items-center gap-3 mt-6 pt-6"
            style={{ borderTop: '1px solid #E2E8F0' }}
          >
            <span className="text-xs font-semibold" style={{ color: '#64748B' }}>
              Contract Address:
            </span>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 min-w-0"
              style={{ background: '#F1F5F0', border: '1px solid #E2E8F0' }}
            >
              <code
                className="font-mono text-xs truncate"
                style={{ color: '#0F172A' }}
                title={CONTRACT}
              >
                {display}
              </code>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold flex-shrink-0 transition-colors"
                style={{ color: '#64748B' }}
                aria-label={copied ? 'Copied' : 'Copy contract address'}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Utility cards */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-6" style={{ color: '#0F172A' }}>
          What $WCB unlocks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: '🎯',
              title: 'Priority Predictions',
              desc: 'When real betting opens, $WCB holders get first access and lower fees.',
            },
            {
              icon: '🏆',
              title: 'NFT Whitelist',
              desc: 'World Cup Prediction Pass NFT drops June 1, 2026. Holders get the whitelist.',
            },
            {
              icon: '🥇',
              title: 'Leaderboard Tiers',
              desc: 'Bronze, Silver, Gold, Platinum tiers based on your $WCB holdings.',
            },
            {
              icon: '💎',
              title: 'Diamond Hands Badge',
              desc: 'Hold continuously for 30+ days to earn an exclusive badge.',
            },
            {
              icon: '🎁',
              title: 'Exclusive Rewards',
              desc: 'Tournament prize pools, NFT airdrops, and community giveaways.',
            },
            {
              icon: '🔥',
              title: 'Token Burns',
              desc: 'Portion of platform revenue used to buy back and burn $WCB.',
            },
          ].map((u) => (
            <div key={u.title} className="card p-6">
              <div className="text-3xl mb-3">{u.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: '#0F172A' }}>
                {u.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                {u.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-2xl font-black mb-6" style={{ color: '#0F172A' }}>
          Roadmap
        </h2>
        <div className="space-y-3">
          {[
            {
              date: 'Now',
              title: 'Pre-launch',
              desc: 'Website live, predictions open as community polls, $WCB available on Pump.fun.',
              status: 'active',
            },
            {
              date: 'May 20, 2026',
              title: 'Whitelist Phase',
              desc: 'NFT whitelist opens, early adopter leaderboard activates.',
              status: 'upcoming',
            },
            {
              date: 'June 1, 2026',
              title: 'NFT & Beta',
              desc: 'World Cup Prediction Pass drops, beta access for top holders.',
              status: 'upcoming',
            },
            {
              date: 'June 11, 2026',
              title: 'Live Launch',
              desc: 'World Cup kickoff. Real predictions open. Full platform live.',
              status: 'upcoming',
            },
          ].map((r, i) => (
            <div
              key={i}
              className="card p-5 flex items-start gap-4"
              style={
                r.status === 'active'
                  ? { borderColor: '#15803D', background: 'rgba(220,252,231,0.2)' }
                  : {}
              }
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold"
                style={
                  r.status === 'active'
                    ? { background: '#15803D', color: '#ffffff' }
                    : { background: '#F1F5F0', color: '#64748B' }
                }
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold" style={{ color: '#0F172A' }}>
                    {r.title}
                  </h3>
                  {r.status === 'active' && (
                    <span className="badge badge-live">
                      <span className="live-dot" aria-hidden="true" /> Now
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>
                  {r.date}
                </p>
                <p className="text-sm" style={{ color: '#334155' }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
