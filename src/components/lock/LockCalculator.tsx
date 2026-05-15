'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LOCK_TIERS,
  MIN_LOCK_AMOUNT,
  calculateCredits,
  getMultiplierForDays,
  getTierForDays,
  formatCredits,
  formatTokenAmount,
} from '@/lib/lock';

interface LockCalculatorProps {
  onLockIntent?: (amount: number, days: number, credits: number) => void;
}

export function LockCalculator({ onLockIntent }: LockCalculatorProps) {
  const [amount, setAmount] = useState<string>('1000000');
  const [days, setDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>('');
  const [useCustom, setUseCustom] = useState(false);

  const effectiveDays = useCustom ? (parseInt(customDays) || 0) : days;
  const numAmount = parseInt(amount.replace(/,/g, '')) || 0;

  const credits = useMemo(
    () => (numAmount >= MIN_LOCK_AMOUNT && effectiveDays >= 7 ? calculateCredits(numAmount, effectiveDays) : 0),
    [numAmount, effectiveDays],
  );

  const multiplier = useMemo(() => getMultiplierForDays(effectiveDays), [effectiveDays]);
  const tier = useMemo(() => getTierForDays(effectiveDays), [effectiveDays]);

  const unlockDate = useMemo(() => {
    if (effectiveDays <= 0) return null;
    const d = new Date();
    d.setDate(d.getDate() + effectiveDays);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  }, [effectiveDays]);

  const isValid = numAmount >= MIN_LOCK_AMOUNT && effectiveDays >= 7;

  const handleAmountChange = (val: string) => {
    // Allow only numbers
    const clean = val.replace(/[^0-9]/g, '');
    setAmount(clean);
  };

  const handlePreset = (preset: number) => {
    setAmount(preset.toString());
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A2A2A', background: 'linear-gradient(135deg, #111111 0%, #171717 100%)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
          Early Stage / Lock & Earn
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
          Lock $WCB for Credits
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.375rem' }}>
          Lock your tokens via Streamflow. Earn credits to use when betting goes live.
        </p>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Amount input */}
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

          {/* Preset amounts */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
            {[100_000, 500_000, 1_000_000, 5_000_000].map((p) => (
              <button
                key={p}
                onClick={() => handlePreset(p)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 8,
                  border: `1px solid ${numAmount === p ? '#F2B544' : '#2A2A2A'}`,
                  background: numAmount === p ? 'rgba(242,181,68,0.12)' : '#111111',
                  color: numAmount === p ? '#FFD36B' : '#B3B3B3',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {formatTokenAmount(p)}
              </button>
            ))}
          </div>

          {numAmount > 0 && numAmount < MIN_LOCK_AMOUNT && (
            <p style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.375rem', fontWeight: 600 }}>
              Minimum lock: {MIN_LOCK_AMOUNT.toLocaleString()} $WCB
            </p>
          )}
        </div>

        {/* Duration selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#B3B3B3', marginBottom: '0.5rem' }}>
            Lock Duration
          </label>

          {/* Preset tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {LOCK_TIERS.map((t) => {
              const active = !useCustom && days === t.days;
              return (
                <button
                  key={t.days}
                  onClick={() => { setDays(t.days); setUseCustom(false); }}
                  style={{
                    padding: '0.625rem 0.5rem',
                    borderRadius: 10,
                    border: `1px solid ${active ? '#F2B544' : '#2A2A2A'}`,
                    background: active ? 'rgba(242,181,68,0.12)' : '#111111',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  {t.highlight && (
                    <span style={{
                      position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                      background: '#F2B544', color: '#070707', fontSize: '9px', fontWeight: 800,
                      padding: '1px 6px', borderRadius: 9999, whiteSpace: 'nowrap',
                    }}>
                      POPULAR
                    </span>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: active ? '#FFD36B' : '#FFFFFF' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: active ? '#FFD36B' : '#6E6E6E', marginTop: '0.125rem' }}>
                    {t.multiplier}x / {t.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setUseCustom(!useCustom)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                border: `1px solid ${useCustom ? '#F2B544' : '#2A2A2A'}`,
                background: useCustom ? 'rgba(242,181,68,0.12)' : '#111111',
                color: useCustom ? '#FFD36B' : '#B3B3B3',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Custom days
            </button>
            {useCustom && (
              <input
                type="number"
                min={7}
                max={365}
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="e.g. 45"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid #2A2A2A',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: '#111111',
                  outline: 'none',
                }}
              />
            )}
            {useCustom && customDays && (
              <span style={{ fontSize: '0.8rem', color: '#B3B3B3', whiteSpace: 'nowrap' }}>
                {multiplier.toFixed(2)}x multiplier
              </span>
            )}
          </div>
        </div>

        {/* Credit preview */}
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
                  { label: 'Duration', value: effectiveDays + ' days' },
                  { label: 'Multiplier', value: multiplier.toFixed(2) + 'x' },
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

              {unlockDate && (
                <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', borderRadius: 8, background: '#0B0B0B', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#B3B3B3', margin: 0 }}>
                    <strong style={{ color: '#FFFFFF' }}>Locked until {unlockDate}</strong> - no early withdrawal
                  </p>
                </div>
              )}

              {tier && (
                <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 9999,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: tier.color + '20',
                      color: tier.color,
                      border: `1px solid ${tier.color}40`,
                    }}
                  >
                    {tier.badge} Tier
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#B3B3B3' }}>
                    1 credit = 100 $WCB when redeemed
                  </span>
                </div>
              )}
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
                Enter at least {MIN_LOCK_AMOUNT.toLocaleString()} $WCB and select a duration to preview credits.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lock button */}
        <button
          disabled={!isValid}
          onClick={() => isValid && onLockIntent?.(numAmount, effectiveDays, credits)}
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
          {isValid ? `Lock ${formatTokenAmount(numAmount)} $WCB via Streamflow` : 'Enter amount and duration to continue'}
        </button>

        <p style={{ fontSize: '0.72rem', color: '#6E6E6E', textAlign: 'center', lineHeight: 1.5 }}>
          Powered by <strong style={{ color: '#B3B3B3' }}>Streamflow Finance</strong>. Tokens locked on-chain. No early withdrawal. Early stage only.
        </p>
      </div>
    </div>
  );
}
