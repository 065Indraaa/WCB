interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { svg: 28, titleSize: '1rem', subtitleSize: '9px' },
  md: { svg: 36, titleSize: '1.25rem', subtitleSize: '10px' },
  lg: { svg: 48, titleSize: '1.5rem', subtitleSize: '11px' },
};

/**
 * $WCB / WORLDCUPBET official logo — football + trophy + Solana accent
 */
export function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const s = sizeMap[size];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={s.svg}
        height={s.svg}
        viewBox="0 0 48 48"
        fill="none"
        aria-label="WORLDCUPBET logo"
        role="img"
      >
        <defs>
          <linearGradient id="wcb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="wcb-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {/* Outer pitch circle */}
        <circle cx="24" cy="24" r="22" fill="url(#wcb-grad)" />
        {/* Inner field */}
        <circle cx="24" cy="24" r="18" fill="white" />
        {/* Pentagon (football pattern) */}
        <path
          d="M24 12 L33 18.5 L29.5 28 L18.5 28 L15 18.5 Z"
          fill="#0F172A"
        />
        {/* Trophy shine */}
        <circle cx="24" cy="20" r="3" fill="url(#wcb-grad-2)" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span style={{ fontWeight: 900, color: '#0F172A', fontSize: s.titleSize, letterSpacing: '-0.02em' }}>
            $WCB
          </span>
          <span style={{ fontSize: s.subtitleSize, fontWeight: 700, color: '#15803D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            World Cup Bet
          </span>
        </div>
      )}
    </div>
  );
}
