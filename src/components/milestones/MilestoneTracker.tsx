'use client';

import { motion } from 'framer-motion';
import { MilestoneBar } from './MilestoneBar';
import { MILESTONES } from '@/lib/constants/milestones';
import { useTokenMetrics } from '@/lib/hooks/useTokenMetrics';
import { useLaunchState } from '@/lib/hooks/useLaunchState';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function MilestoneTracker() {
  const { data: metrics } = useTokenMetrics();
  const launchState = useLaunchState();
  const reducedMotion = useReducedMotion();

  const holders = metrics?.holders ?? 0;
  const marketCap = metrics?.marketCap ?? 0;
  const discordMembers = 0; // Placeholder until Discord API is wired
  const isLive = launchState === 'live';

  const values: Record<string, number> = {
    holders,
    marketCap,
    discord: discordMembers,
    launch: isLive ? 1 : 0,
  };

  return (
    <section id="milestones" className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-6">
            <p className="section-eyebrow mb-2">Milestones</p>
            <h2
              className="text-3xl sm:text-4xl font-black tracking-tight mb-3"
              style={{ color: '#FFFFFF' }}
            >
              Community Tracker
            </h2>
            <p className="text-base max-w-2xl" style={{ color: '#B3B3B3' }}>
              Watch the $WCBLIVE community grow. Every milestone unlocked brings us closer to the full prediction platform.
            </p>
          </div>

          <div
            className="card p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
              border: '1px solid rgba(242,181,68,0.18)',
            }}
          >
            {MILESTONES.map((m) => (
              <MilestoneBar
                key={m.id}
                label={m.label}
                current={values[m.id] ?? 0}
                target={m.target}
                unit={m.unit}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
