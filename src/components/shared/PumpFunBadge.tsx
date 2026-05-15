interface PumpFunBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function PumpFunBadge({ className = '', size = 'md' }: PumpFunBadgeProps) {
  const pumpfun = process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun';

  const style = size === 'sm'
    ? { padding: '0.25rem 0.6rem', fontSize: '0.72rem' }
    : { padding: '0.35rem 0.75rem', fontSize: '0.82rem' };

  return (
    <a
      href={pumpfun}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${className}`}
      style={{
        ...style,
        background: 'rgba(242,181,68,0.12)',
        color: '#FFD36B',
        border: '1px solid rgba(242,181,68,0.28)',
        textDecoration: 'none',
        transition: 'background 0.15s, border-color 0.15s',
        backdropFilter: 'blur(8px)',
      }}
    >
      Buy $WCB
    </a>
  );
}
