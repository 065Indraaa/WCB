'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice } from '@/lib/utils/formatters';
import type { PriceDirection } from '@/types/token';

interface PriceDisplayProps {
  price: number;
  priceChange24h?: number;
  className?: string;
}

export function PriceDisplay({ price, priceChange24h = 0, className = '' }: PriceDisplayProps) {
  const rm = useReducedMotion();
  const [direction, setDirection] = useState<PriceDirection>('neutral');
  const prevPrice = useRef(price);

  useEffect(() => {
    if (price > prevPrice.current) setDirection('up');
    else if (price < prevPrice.current) setDirection('down');
    prevPrice.current = price;

    const t = setTimeout(() => setDirection('neutral'), 1500);
    return () => clearTimeout(t);
  }, [price]);

  const color = direction === 'up' ? '#14F195' : direction === 'down' ? '#EF4444' : '#FFFFFF';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.span
        animate={rm ? {} : { scale: direction === 'neutral' ? 1 : 1.05, color }}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '1.5rem', fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}
      >
        {formatPrice(price)}
      </motion.span>
      {priceChange24h !== 0 && (
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: priceChange24h >= 0 ? '#14F195' : '#EF4444',
          }}
        >
          {priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(priceChange24h).toFixed(2)}%
        </span>
      )}
    </div>
  );
}
