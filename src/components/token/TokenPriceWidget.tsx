'use client';

import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';

function formatPrice(value: number) {
  return `$${value.toFixed(value < 0.01 ? 6 : 4)}`;
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function TokenPriceWidget() {
  const { data: metrics, isLoading } = useTokenMetrics();
  const change = metrics?.priceChange24h ?? 0;

  const rows = [
    { label: 'Price', value: isLoading ? 'Syncing' : formatPrice(metrics?.price ?? 0), green: false },
    { label: '24h', value: isLoading ? 'Syncing' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`, green: change >= 0 },
    { label: 'Holders', value: isLoading ? 'Syncing' : (metrics?.holders ?? 0).toLocaleString('en-US'), green: false },
    { label: 'Mkt Cap', value: isLoading ? 'Syncing' : formatMarketCap(metrics?.marketCap ?? 0), green: false },
  ];

  return (
    <div className="bet-card" style={{ padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B7280' }}>$WCB Token</span>
        <span className="live-badge" style={{ fontSize: '0.58rem' }}>LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        {rows.map((s) => (
          <div key={s.label} style={{ padding: '8px', background: '#111111', borderRadius: 6, border: '1px solid #2A2A2A' }}>
            <div style={{ fontSize: '0.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E6E' }}>{s.label}</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: s.label === '24h' ? (s.green ? '#14F195' : '#EF4444') : '#FFFFFF', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
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
