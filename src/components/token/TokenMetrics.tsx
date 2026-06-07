'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatMarketCap } from '@/lib/utils/formatters';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface TokenMetricsProps {
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  burned?: number;
}

export function TokenMetrics({ price, priceChange24h, marketCap, holders, burned = 0 }: TokenMetricsProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [prevPrice, setPrevPrice] = useState(price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || price === prevPrice) return;
    setFlash(price > prevPrice ? 'up' : 'down');
    const t = setTimeout(() => setFlash(null), 1500);
    setPrevPrice(price);
    return () => clearTimeout(t);
  }, [price, prevPrice, mounted]);

  const metrics = [
    {
      label: 'Price',
      value: formatPrice(price),
      sub: priceChange24h !== 0 ? `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%` : undefined,
      subColor: priceChange24h >= 0 ? '#14F195' : '#EF4444',
    },
    { label: 'Market Cap', value: formatMarketCap(marketCap) },
    { label: 'Holders', value: holders.toLocaleString('en-US') },
    { label: 'Burned', value: burned > 0 ? formatMarketCap(burned) : '—' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="rounded-xl px-4 py-4"
          style={{ background: '#111111', border: '1px solid #2A2A2A' }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-1"
            style={{ fontSize: '10px', color: '#6E6E6E' }}
          >
            {m.label}
          </p>
          <p
            className="text-lg sm:text-xl font-black tabular-nums"
            style={{
              color: m.label === 'Price' && flash ? (flash === 'up' ? '#14F195' : '#EF4444') : '#FFFFFF',
              transition: 'color 0.3s',
            }}
          >
            {m.value}
          </p>
          {m.sub && (
            <p className="text-xs font-bold mt-1" style={{ color: m.subColor }}>
              {m.sub}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
