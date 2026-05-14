'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { computeCountdown } from '@/lib/utils/formatters';

interface CountdownTimerProps {
  targetDate?: Date;
  compact?: boolean;
}

const DEFAULT_TARGET = new Date('2026-06-11T00:00:00Z');
const pad = (n: number) => String(n).padStart(2, '0');

interface DigitProps {
  value: string;
  label: string;
  compact: boolean;
  reducedMotion: boolean;
}

function Digit({ value, label, compact, reducedMotion }: DigitProps) {
  return (
    <div className="flex flex-col items-center" style={{ gap: '0.375rem' }}>
      <div
        style={{
          width: compact ? 40 : 64,
          height: compact ? 48 : 72,
          background: '#DCFCE7',
          border: '1px solid rgba(21,128,61,0.2)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {reducedMotion ? (
          <span
            className="text-pitch-gradient font-black tabular-nums"
            style={{ fontSize: compact ? '1.4rem' : '2.25rem' }}
          >
            {value}
          </span>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              className="text-pitch-gradient font-black tabular-nums"
              style={{ fontSize: compact ? '1.4rem' : '2.25rem', position: 'absolute' }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span
        style={{
          fontSize: compact ? '0.6rem' : '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#64748B',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ targetDate = DEFAULT_TARGET, compact = false }: CountdownTimerProps) {
  const reducedMotion = useReducedMotion() ?? false;

  // SSR-safe: start with null, populate after mount to avoid hydration mismatch
  const [c, setC] = useState<ReturnType<typeof computeCountdown>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setC(computeCountdown(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Before mount: show placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? '0.25rem' : '0.5rem',
        }}
        aria-label="Loading countdown"
      >
        {['--', '--', '--', '--'].map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: compact ? '0.25rem' : '0.5rem' }}>
            <Digit value={v} label={['Days', 'Hrs', 'Min', 'Sec'][i]} compact={compact} reducedMotion={true} />
            {i < 3 && (
              <span style={{ color: '#15803D', fontWeight: 900, fontSize: compact ? '1.1rem' : '1.75rem', marginBottom: compact ? '1rem' : '1.5rem' }}>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!c) {
    return (
      <p
        className="text-pitch-gradient font-black text-center"
        style={{ fontSize: compact ? '1.1rem' : '1.75rem' }}
      >
        Predictions are live! 🎉
      </p>
    );
  }

  const units = [
    { value: pad(c.days),    label: 'Days' },
    { value: pad(c.hours),   label: 'Hrs' },
    { value: pad(c.minutes), label: 'Min' },
    { value: pad(c.seconds), label: 'Sec' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? '0.25rem' : '0.5rem',
      }}
      role="timer"
      aria-label={`${c.days} days ${c.hours} hours ${c.minutes} minutes ${c.seconds} seconds remaining`}
    >
      {units.map((u, i) => (
        <div key={u.label} style={{ display: 'flex', alignItems: 'center', gap: compact ? '0.25rem' : '0.5rem' }}>
          <Digit value={u.value} label={u.label} compact={compact} reducedMotion={reducedMotion} />
          {i < 3 && (
            <span
              style={{
                color: '#15803D',
                fontWeight: 900,
                fontSize: compact ? '1.1rem' : '1.75rem',
                marginBottom: compact ? '1rem' : '1.5rem',
              }}
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
