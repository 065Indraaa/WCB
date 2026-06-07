'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TokenMetrics } from './TokenMetrics';
import { NFTPreview } from './NFTPreview';
import { PumpFunBadge } from '@/components/shared/PumpFunBadge';
import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';
import { useLaunchState } from '@/lib/hooks/useLaunchState';
import { WCB_MINT } from '@/lib/tokenConfig';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function TokenSection() {
  const { data: metrics, isLoading, error } = useTokenMetrics();
  const launchState = useLaunchState();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const loading = !mounted || isLoading;
  const errorMessage = error instanceof Error ? error.message : null;

  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? `https://pump.fun/coin/${WCB_MINT}`;
  const jupiter = process.env.NEXT_PUBLIC_JUPITER_URL ?? `https://jup.ag/swap/SOL-${WCB_MINT}`;

  return (
    <section id="token" className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
            border: '1px solid rgba(242,181,68,0.18)',
          }}
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="section-eyebrow" style={{ marginBottom: 0 }}>
                    $WCB Token
                  </p>
                  <PumpFunBadge size="sm" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ color: '#FFFFFF' }}
                >
                  Token Metrics
                </h2>
                <p className="text-sm mt-1 max-w-xl" style={{ color: '#B3B3B3' }}>
                  $WCB is the official token of WorldCupBetLive. Hold to unlock predictions, climb the leaderboard, and win exclusive rewards.
                </p>
              </div>

              {launchState === 'pre-launch' && (
                <span
                  className="badge badge-pitch"
                  style={{ fontSize: '0.62rem' }}
                >
                  Pre-launch
                </span>
              )}
            </div>

            {/* Data source note */}
            {(errorMessage || metrics?.source) && (
              <div className="mb-4 text-xs font-semibold" style={{ color: '#6E6E6E' }}>
                {errorMessage ? (
                  <span style={{ color: '#EF4444' }}>
                    Price data may be delayed: {errorMessage}
                  </span>
                ) : (
                  <span>
                    Source: {metrics?.source ?? 'live'}
                    {metrics?.lastUpdated && mounted
                      ? ` · Updated ${new Date(metrics.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                      : ''}
                  </span>
                )}
              </div>
            )}

            {/* Metrics */}
            <div className="mb-6">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-4 py-4"
                      style={{ background: '#111111', border: '1px solid #2A2A2A' }}
                    >
                      <div
                        className="mb-2"
                        style={{
                          height: 10,
                          width: 48,
                          borderRadius: 4,
                          background: '#2A2A2A',
                        }}
                      />
                      <div
                        style={{
                          height: 20,
                          width: 80,
                          borderRadius: 4,
                          background: '#2A2A2A',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <TokenMetrics
                  price={metrics?.price ?? 0}
                  priceChange24h={metrics?.priceChange24h ?? 0}
                  marketCap={metrics?.marketCap ?? 0}
                  holders={metrics?.holders ?? 0}
                  burned={metrics?.burned ?? 0}
                />
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={pumpfun}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
                style={{ justifyContent: 'center' }}
              >
                Buy $WCB on Pump.fun
              </a>
              <a
                href={jupiter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1"
                style={{ justifyContent: 'center' }}
              >
                Swap on Jupiter
              </a>
            </div>

            {/* Contract */}
            <div
              className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg"
              style={{ background: '#0B0B0B', border: '1px solid #2A2A2A' }}
            >
              <span className="text-xs" style={{ color: '#6E6E6E' }}>
                Contract:
              </span>
              <code className="text-xs font-mono" style={{ color: '#B3B3B3' }}>
                {WCB_MINT.slice(0, 6)}...{WCB_MINT.slice(-6)}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(WCB_MINT);
                }}
                className="text-xs font-bold ml-auto"
                style={{ color: '#F2B544', cursor: 'pointer' }}
                title="Copy contract address"
              >
                Copy
              </button>
            </div>

            {/* NFT Preview */}
            <NFTPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
