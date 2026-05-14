interface PumpFunBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function PumpFunBadge({ className = '', size = 'md' }: PumpFunBadgeProps) {
  const paddingStyle = size === 'sm'
    ? { padding: '0.25rem 0.625rem', fontSize: '0.75rem' }
    : { padding: '0.375rem 0.75rem', fontSize: '0.875rem' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${className}`}
      style={{
        ...paddingStyle,
        background: '#DCFCE7',
        color: '#15803D',
        border: '1px solid rgba(21,128,61,0.2)',
      }}
    >
      🚀 Launched on Pump.fun
    </span>
  );
}
