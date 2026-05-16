'use client';

import { useEffect, useMemo, useState } from 'react';

type DexPair = {
  chainId?: string;
  pairAddress?: string;
  url?: string;
  dexId?: string;
  liquidity?: {
    usd?: number;
  } | null;
};

type LoadState = 'loading' | 'resolved' | 'fallback';

const CHAIN_ID = 'solana';
const BASE_EMBED_PARAMS = {
  embed: '1',
  loadChartSettings: '0',
  chartLeftToolbar: '0',
  chartTheme: 'dark',
  theme: 'dark',
  chartStyle: '1',
  chartType: 'usd',
  interval: '15',
};

function withEmbedParams(url: string) {
  const parsed = new URL(url);
  Object.entries(BASE_EMBED_PARAMS).forEach(([key, value]) => {
    parsed.searchParams.set(key, value);
  });
  return parsed.toString();
}

function buildDexscreenerUrl(chainId: string, address: string) {
  return `https://dexscreener.com/${chainId}/${address}`;
}

function pickPrimaryPair(pairs: DexPair[]) {
  return [...pairs]
    .filter((pair) => pair.chainId && pair.pairAddress)
    .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
}

export function TokenDexscreenerChart({ tokenAddress }: { tokenAddress: string }) {
  const configuredUrl = process.env.NEXT_PUBLIC_DEXSCREENER_URL;
  const fallbackUrl = useMemo(
    () => configuredUrl ?? buildDexscreenerUrl(CHAIN_ID, tokenAddress),
    [configuredUrl, tokenAddress],
  );
  const [pair, setPair] = useState<DexPair | null>(null);
  const [loadState, setLoadState] = useState<LoadState>(configuredUrl ? 'resolved' : 'loading');

  useEffect(() => {
    if (configuredUrl) return;

    let cancelled = false;

    async function resolvePair() {
      try {
        const response = await fetch(
          `https://api.dexscreener.com/token-pairs/v1/${CHAIN_ID}/${tokenAddress}`,
          { cache: 'no-store' },
        );
        if (!response.ok) throw new Error('Dexscreener pair lookup failed');

        const pairs = (await response.json()) as DexPair[];
        const primaryPair = Array.isArray(pairs) ? pickPrimaryPair(pairs) : undefined;

        if (!cancelled) {
          if (primaryPair) {
            setPair(primaryPair);
            setLoadState('resolved');
          } else {
            setLoadState('fallback');
          }
        }
      } catch {
        if (!cancelled) setLoadState('fallback');
      }
    }

    void resolvePair();

    return () => {
      cancelled = true;
    };
  }, [configuredUrl, tokenAddress]);

  const chartUrl = pair?.pairAddress
    ? buildDexscreenerUrl(pair.chainId ?? CHAIN_ID, pair.pairAddress)
    : fallbackUrl;
  const embedUrl = withEmbedParams(chartUrl);
  const directUrl = pair?.url ?? chartUrl;

  return (
    <section className="dexscreener-page" aria-label="Dexscreener token chart">
      <div className="dexscreener-toolbar">
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 4 }}>
            $WCB Live Chart
          </p>
          <h1 className="dexscreener-title">Dexscreener</h1>
        </div>
        <div className="dexscreener-actions">
          <span className="data-pill">
            {loadState === 'loading' ? 'Resolving pair' : pair?.dexId ?? 'Solana'}
          </span>
          <a href={directUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Open Fullscreen
          </a>
        </div>
      </div>

      <div className="dexscreener-frame-wrap">
        <iframe
          key={embedUrl}
          src={embedUrl}
          title="$WCB Dexscreener chart"
          className="dexscreener-frame"
          allow="clipboard-write; fullscreen"
          allowFullScreen
        />
      </div>
    </section>
  );
}
