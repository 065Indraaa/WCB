'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EARLY_TOKENS_PER_CREDIT,
  FIXED_LOCK_DAYS,
  LOCK_LAUNCH_TIMESTAMP,
  MIN_LOCK_AMOUNT,
  POST_LAUNCH_TOKENS_PER_CREDIT,
  calculateCredits,
  currentUnixTimestamp,
  formatCredits,
  formatTokenAmount,
  getTokensPerCreditForTimestamp,
  isEarlyCreditWindow,
} from '@/lib/lock';

interface LockCalculatorProps {
  onLockIntent?: (amount: number, days: number, credits: number) => void;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(date: Date) {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function LockCalculator({ onLockIntent }: LockCalculatorProps) {
  const [amount, setAmount] = useState<string>('10000');
  const lockTimestamp = currentUnixTimestamp();
  const numAmount = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const creditRate = getTokensPerCreditForTimestamp(lockTimestamp);
  const earlyWindow = isEarlyCreditWindow(lockTimestamp);
  const minimumCreditAmount = Math.max(MIN_LOCK_AMOUNT, creditRate);

  const credits = useMemo(
    () => (numAmount >= minimumCreditAmount ? calculateCredits(numAmount, lockTimestamp) : 0),
    [numAmount, lockTimestamp, minimumCreditAmount],
  );

  const unlockDate = useMemo(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + FIXED_LOCK_DAYS);
    return formatDate(d);
  }, []);

  const launchDate = useMemo(() => formatDate(new Date(LOCK_LAUNCH_TIMESTAMP * 1000)), []);
  const isValid = numAmount >= minimumCreditAmount;

  const handleAmountChange = (val: string) => {
    setAmount(val.replace(/[^0-9]/g, ''));
  };

  const handlePreset = (preset: number) => {
    setAmount(preset.toString());
  };

  return (
    <div className="card overflow-hidden">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A2A2A', background: 'linear-gradient(135deg, #111111 0%, #171717 100%)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
          {earlyWindow ? 'Early Lock Rate' : 'Post-Launch Lock Rate'}
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
          Lock $WCB for Credits
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.375rem' }}>
          Fixed 60-day Streamflow lock. Credit redeem/withdraw is coming soon and not active yet.
        </p>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#B3B3B3', marginBottom: '0.5rem' }}>
            Amount to Lock
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={numAmount > 0 ? numAmount.toLocaleString() : ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount..."
              style={{
                width: '100%',
                padding: '0.75rem 4rem 0.75rem 1rem',
                borderRadius: 12,
                border: '1px solid #2A2A2A',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                background: '#111111',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 700, color: '#B3B3B3' }}>
              $WCB
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
            {[100, 1_000, 10_000, 100_000].map((preset) => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 8,
                  border: `1px solid ${numAmount === preset ? '#F2B544' : '#2A2A2A'}`,
                  background: numAmount === preset ? 'rgba(242,181,68,0.12)' : '#111111',
                  color: numAmount === preset ? '#FFD36B' : '#B3B3B3',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {formatTokenAmount(preset)}
              </button>
            ))}
          </div>

          {numAmount > 0 && numAmount < minimumCreditAmount && (
            <p style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.375rem', fontWeight: 600 }}>
              Minimum for 1 credit at the current rate: {minimumCreditAmount.toLocaleString()} $WCB
            </p>
          )}
        </div>

        <div
          style={{
            borderRadius: 14,
            border: '1px solid rgba(242,181,68,0.24)',
            background: '#111111',
            padding: '1rem',
          }}
        >
          <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F2B544', marginBottom: '0.75rem' }}>
            Fixed Lock Terms
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Duration', value: `${FIXED_LOCK_DAYS} days` },
              { label: 'Current Rate', value: `${creditRate} $WCB / credit` },
              { label: 'Unlock', value: unlockDate },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#B3B3B3', lineHeight: 1.55, margin: '0.85rem 0 0' }}>
            Locks before {launchDate} earn the early rate: {EARLY_TOKENS_PER_CREDIT} $WCB = 1 credit. After launch, the rate becomes {POST_LAUNCH_TOKENS_PER_CREDIT} $WCB = 1 credit.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isValid ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                borderRadius: 14,
                border: '1px solid rgba(242,181,68,0.28)',
                background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
                padding: '1.25rem',
              }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F2B544', marginBottom: '0.75rem' }}>
                You will receive
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFD36B', lineHeight: 1 }}>
                  {formatCredits(credits)}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#B3B3B3' }}>Credits</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                {[
                  { label: 'Locked', value: formatTokenAmount(numAmount) + ' $WCB' },
                  { label: 'Duration', value: `${FIXED_LOCK_DAYS} days` },
                  { label: 'Rate', value: `${creditRate}:1` },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.125rem' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', borderRadius: 8, background: '#0B0B0B', border: '1px solid #2A2A2A' }}>
                <p style={{ fontSize: '0.8rem', color: '#B3B3B3', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: '#FFFFFF' }}>Locked until {unlockDate}.</strong> Credits are platform credits. Redeem/withdraw is coming soon and is not active yet.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                borderRadius: 14,
                border: '1px dashed #3A3A3A',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: '#B3B3B3' }}>
                Enter at least {minimumCreditAmount.toLocaleString()} $WCB to preview credits.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          disabled={!isValid}
          onClick={() => isValid && onLockIntent?.(numAmount, FIXED_LOCK_DAYS, credits)}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: 12,
            border: 'none',
            background: isValid ? '#F2B544' : '#2A2A2A',
            color: isValid ? '#070707' : '#6E6E6E',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: isValid ? '0 8px 22px rgba(242,181,68,0.24)' : 'none',
          }}
        >
          {isValid ? `Lock ${formatTokenAmount(numAmount)} $WCB for ${FIXED_LOCK_DAYS} days` : 'Enter amount to continue'}
        </button>

        <p style={{ fontSize: '0.72rem', color: '#6E6E6E', textAlign: 'center', lineHeight: 1.5 }}>
          Powered by <strong style={{ color: '#B3B3B3' }}>Streamflow Finance</strong>. Tokens lock on-chain for 60 days. No early withdrawal.
        </p>
      </div>
    </div>
  );
}
