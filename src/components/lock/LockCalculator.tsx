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
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
          Early Stage · Lock & Earn
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
          Lock $WCB → Get Credits
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.375rem' }}>
          Lock your tokens via Streamflow. Earn credits to use when betting goes live.
        </p>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Amount input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
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
                border: '1.5px solid #E2E8F0',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0F172A',
                background: '#FAFBF8',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
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
                  border: `1.5px solid ${numAmount === p ? '#15803D' : '#E2E8F0'}`,
                  background: numAmount === p ? '#DCFCE7' : '#ffffff',
                  color: numAmount === p ? '#15803D' : '#64748B',
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
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
                    border: `2px solid ${active ? t.color : '#E2E8F0'}`,
                    background: active ? `${t.color}15` : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  {t.highlight && (
                    <span style={{
                      position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                      background: t.color, color: '#fff', fontSize: '9px', fontWeight: 800,
                      padding: '1px 6px', borderRadius: 9999, whiteSpace: 'nowrap',
                    }}>
                      POPULAR
                    </span>
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: active ? t.color : '#0F172A' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: active ? t.color : '#94A3B8', marginTop: '0.125rem' }}>
                    {t.multiplier}x · {t.badge}
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
                border: `1.5px solid ${useCustom ? '#15803D' : '#E2E8F0'}`,
                background: useCustom ? '#DCFCE7' : '#ffffff',
                color: useCustom ? '#15803D' : '#64748B',
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
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  background: '#FAFBF8',
                  outline: 'none',
                }}
              />
            )}
            {useCustom && customDays && (
              <span style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap' }}>
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
                border: '2px solid #DCFCE7',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                padding: '1.25rem',
              }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#15803D', marginBottom: '0.75rem' }}>
                You will receive
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#15803D', lineHeight: 1 }}>
                  {formatCredits(credits)}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#22C55E' }}>Credits</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                {[
                  { label: 'Locked', value: formatTokenAmount(numAmount) + ' $WCB' },
                  { label: 'Duration', value: effectiveDays + ' days' },
                  { label: 'Multiplier', value: multiplier.toFixed(2) + 'x' },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginTop: '0.125rem' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {unlockDate && (
                <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', borderRadius: 8, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>🔒</span>
                  <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
                    <strong>Locked until {unlockDate}</strong> — no early withdrawal
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
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
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
                border: '1.5px dashed #E2E8F0',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Enter an amount ≥ {MIN_LOCK_AMOUNT.toLocaleString()} $WCB and select a duration to see your credits
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
            background: isValid ? 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)' : '#E2E8F0',
            color: isValid ? '#ffffff' : '#94A3B8',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: isValid ? '0 4px 14px -2px rgba(21,128,61,0.3)' : 'none',
          }}
        >
          {isValid ? `🔒 Lock ${formatTokenAmount(numAmount)} $WCB via Streamflow` : 'Enter amount & duration to continue'}
        </button>

        <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
          Powered by <strong style={{ color: '#64748B' }}>Streamflow Finance</strong> · Tokens locked on-chain · No early withdrawal · Early stage only
        </p>
      </div>
    </div>
  );
}
