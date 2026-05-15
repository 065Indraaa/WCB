'use client';

import { useState } from 'react';
import { formatPrice, formatMarketCap } from '@/lib/utils/formatters';
import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WCB_MINT } from '@/lib/tokenConfig';

const PUMPFUN = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';
const JUPITER = process.env.NEXT_PUBLIC_JUPITER_URL ?? 'https://jup.ag';
const CONTRACT = WCB_MINT;

export default function TokenPage() {
  const { data: metrics, isLoading, error, refetch } = useTokenMetrics();
  const [copied, setCopied] = useState(false);
  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  const handleCopy = async () => {
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
    { label: 'Price', value: isLoading ? 'Syncing' : formatPrice(metrics?.price ?? 0), change: metrics?.priceChange24h },
    { label: 'Market Cap', value: isLoading ? 'Syncing' : formatMarketCap(metrics?.marketCap ?? 0) },
    { label: 'Holders', value: isLoading ? 'Syncing' : (metrics?.holders ?? 0).toLocaleString('en-US') },
    { label: '24h Volume', value: isLoading ? 'Syncing' : formatMarketCap(metrics?.volume24hUsd ?? 0) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Hero card */}
      <div className="card p-8 sm:p-12 mb-10 relative overflow-hidden">
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" showText={false} />
              <div>
                <p className="section-eyebrow mb-1">$WCB Token</p>
                <h1
                  className="text-3xl sm:text-4xl font-black tracking-tight"
                  style={{ color: '#FFFFFF' }}
                >
                  Token access for the WCB betting platform.
                </h1>
              </div>
            </div>
            <PumpFunBadge />
          </div>

          <p
            className="text-lg max-w-2xl mb-8 leading-relaxed"
            style={{ color: '#B3B3B3' }}
          >
            $WCB is the access token for World Cup Bet. Holders unlock priority market access, leaderboard tiers, and credit-based betting features when World Cup markets open on June 11, 2026.
          </p>

          {(errorMessage || metrics?.source || metrics?.lastUpdated) && (
            <div className="mb-4 text-xs font-semibold" style={{ color: '#6E6E6E' }}>
              {errorMessage ? (
                <span style={{ color: '#EF4444' }}>{errorMessage}</span>
              ) : (
                <>
                  Source: {metrics?.source ?? 'live'}
                  {metrics?.lastUpdated ? ` / Updated ${new Date(metrics.lastUpdated).toLocaleString('en-US')}` : ''}
                </>
              )}
            </div>
          )}

          {/* Live metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-4 py-4"
                style={{ background: '#111111', border: '1px solid #2A2A2A' }}
              >
                <p
                  className="font-bold uppercase tracking-widest mb-1"
                  style={{ fontSize: '10px', color: '#6E6E6E' }}
                >
                  {s.label}
                </p>
                <p
                  className="text-xl font-black tabular-nums"
                  style={{ color: '#FFFFFF' }}
                >
                  {s.value}
                </p>
                {s.change !== undefined && (
                  <p
                    className="text-xs font-bold mt-1"
                    style={{ color: s.change >= 0 ? '#14F195' : '#DC2626' }}
                  >
                    {s.change >= 0 ? '+' : '-'}{Math.abs(s.change).toFixed(2)}%
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
              Buy $WCB
            </a>
            <a
              href={JUPITER}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1"
            >
              Swap on Jupiter
            </a>
            <button onClick={() => void refetch()} className="btn-secondary flex-1">
              Refresh Metrics
            </button>
          </div>

          {/* Contract address */}
          <div
            className="flex flex-wrap items-center gap-3 mt-6 pt-6"
            style={{ borderTop: '1px solid #2A2A2A' }}
          >
            <span className="text-xs font-semibold" style={{ color: '#B3B3B3' }}>
              Contract Address:
            </span>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 min-w-0"
              style={{ background: '#111111', border: '1px solid #2A2A2A' }}
            >
              <code
                className="font-mono text-xs truncate"
                style={{ color: '#FFFFFF' }}
                title={CONTRACT}
              >
                {display}
              </code>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold flex-shrink-0 transition-colors"
                style={{ color: '#B3B3B3' }}
                aria-label={copied ? 'Copied' : 'Copy contract address'}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token banner image */}
      <div style={{ marginBottom: '2.5rem' }}>
        <ImagePlaceholder
          width="100%"
          height={200}
          label="Token Banner 1200 x 400"
          rounded={16}
          style={{ border: '1px solid #2A2A2A' }}
        />
      </div>

      {/* Utility cards */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-6" style={{ color: '#FFFFFF' }}>
          Token Utility
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Priority Predictions',
              desc: 'When real betting opens, $WCB holders get first access and lower fees.',
            },
            {
              title: 'Exclusive Rewards',
              desc: 'Tournament prize pools, community allocations, and holder-only campaigns.',
            },
            {
              title: 'Leaderboard Tiers',
              desc: 'Bronze, Silver, Gold, Platinum tiers based on your $WCB holdings.',
            },
            {
              title: 'Holder Status',
              desc: 'Holding duration and balance can qualify wallets for status badges.',
            },
            {
              title: 'Early Mover Advantage',
              desc: 'Lock before launch for a 2x credit multiplier. The bonus ends when markets open.',
            },
            {
              title: 'Token Burns',
              desc: 'Portion of platform revenue used to buy back and burn $WCB.',
            },
          ].map((u, i) => (
            <div key={u.title} className="card p-6">
              <div style={{ color: '#F2B544', fontSize: '0.75rem', fontWeight: 900, marginBottom: 10 }}>0{i + 1}</div>
              <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>
                {u.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#B3B3B3' }}>
                {u.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#FFFFFF' }}>
          Current Phase
        </h2>
        <p className="text-sm mb-6" style={{ color: '#B3B3B3' }}>
          WCB is moving through two clear product phases.
        </p>
        <div className="space-y-3">
          {[
            {
              date: 'Right now',
              title: 'Prediction markets and token access',
              desc: 'The platform supports fixture predictions, leaderboard preparation, token access, and early credit allocation.',
              status: 'active',
            },
            {
              date: 'June 11, 2026',
              title: 'World Cup markets open',
              desc: 'Match markets open, credits become usable betting balance, and leaderboard competition begins.',
              status: 'upcoming',
            },
          ].map((r, i) => (
            <div
              key={i}
              className="card p-5 flex items-start gap-4"
              style={
                r.status === 'active'
                  ? { borderColor: 'rgba(242,181,68,0.38)', background: 'rgba(242,181,68,0.08)' }
                  : {}
              }
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold"
                style={
                  r.status === 'active'
                    ? { background: '#F2B544', color: '#070707' }
                    : { background: '#111111', color: '#B3B3B3', border: '1px solid #2A2A2A' }
                }
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold" style={{ color: '#FFFFFF' }}>
                    {r.title}
                  </h3>
                  {r.status === 'active' && (
                    <span className="badge badge-live">
                      <span className="live-dot" aria-hidden="true" /> Now
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#6E6E6E' }}>
                  {r.date}
                </p>
                <p className="text-sm" style={{ color: '#B3B3B3' }}>
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
