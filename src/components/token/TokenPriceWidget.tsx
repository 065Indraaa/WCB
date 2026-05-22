'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatMarketCap } from '@/lib/utils/formatters';
import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';

export function TokenPriceWidget() {
  const { data: metrics, isLoading } = useTokenMetrics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Use loading state until mounted to prevent SSR/hydration mismatch
  const loading = !mounted || isLoading;

  const rows = [
    { label: 'Price', value: loading ? '…' : formatPrice(metrics?.price ?? 0) },
    {
      label: '24h',
      value: loading
        ? '…'
        : metrics?.priceChange24h != null
          ? `${metrics.priceChange24h >= 0 ? '+' : ''}${metrics.priceChange24h.toFixed(2)}%`
          : '—',
      color:
        loading || metrics?.priceChange24h == null
          ? undefined
          : metrics.priceChange24h >= 0
            ? '#14F195'
            : '#DC2626',
    },
    { label: 'Holders', value: loading ? '…' : (metrics?.holders ?? 0).toLocaleString('en-US') },
    { label: 'Mkt Cap', value: loading ? '…' : formatMarketCap(metrics?.marketCap ?? 0) },
  ];

  return (
    <div className="bet-card" style={{ padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B7280' }}>$WCB Token</span>
        <span className="badge badge-live" style={{ fontSize: '0.58rem' }}>
          <span className="live-dot" aria-hidden="true" /> LIVE
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        {rows.map((s) => (
          <div key={s.label} style={{ padding: '8px', background: '#111111', borderRadius: 6, border: '1px solid #2A2A2A' }}>
            <div style={{ fontSize: '0.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E6E' }}>{s.label}</div>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 900,
                color: (s as { color?: string }).color ?? '#FFFFFF',
                marginTop: '2px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <a
        href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
      >
        Buy $WCB
      </a>
    </div>
  );
}
