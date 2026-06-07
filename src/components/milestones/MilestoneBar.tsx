'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MilestoneBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  achieved?: boolean;
}

export function MilestoneBar({ label, current, target, unit = '', achieved = false }: MilestoneBarProps) {
  const rm = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const pct = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 100;
  const isComplete = achieved || pct >= 100;

  useEffect(() => {
    if (!barRef.current || rm) {
      setHasAnimated(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [rm]);

  return (
    <div ref={barRef} className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color: isComplete ? '#14F195' : '#B3B3B3' }}>
          {isComplete ? 'Achieved' : `${Math.round(pct)}%`}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 10, background: '#2A2A2A' }}
      >
        <motion.div
          initial={rm ? false : { width: 0 }}
          animate={{ width: `${hasAnimated ? pct : 0}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: isComplete
              ? 'linear-gradient(90deg, #14F195 0%, #00FF88 100%)'
              : 'linear-gradient(90deg, #C8922E 0%, #F2B544 100%)',
            boxShadow: isComplete ? '0 0 12px rgba(20,241,149,0.5)' : 'none',
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs" style={{ color: '#6E6E6E' }}>
          {current.toLocaleString()} {unit}
        </span>
        <span className="text-xs" style={{ color: '#6E6E6E' }}>
          {target.toLocaleString()} {unit}
        </span>
      </div>
    </div>
  );
}
