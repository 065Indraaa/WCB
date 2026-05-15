interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { svg: 28, titleSize: '1rem',   subtitleSize: '9px' },
  md: { svg: 34, titleSize: '1.15rem', subtitleSize: '9px' },
  lg: { svg: 44, titleSize: '1.4rem',  subtitleSize: '10px' },
};

/**
 * $WCB / WORLDCUPBET brand logo — dark sportsbook variant
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
          <linearGradient id="wcb-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#238636" />
            <stop offset="100%" stopColor="#2EA043" />
          </linearGradient>
          <linearGradient id="wcb-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D29922" />
            <stop offset="100%" stopColor="#E3B341" />
          </linearGradient>
        </defs>
        {/* Outer circle */}
        <circle cx="24" cy="24" r="22" fill="url(#wcb-grad-dark)" />
        {/* Inner field */}
        <circle cx="24" cy="24" r="18" fill="#161B22" />
        {/* Pentagon (football pattern) */}
        <path
          d="M24 12 L33 18.5 L29.5 28 L18.5 28 L15 18.5 Z"
          fill="#E6EDF3"
        />
        {/* Trophy accent */}
        <circle cx="24" cy="20" r="3" fill="url(#wcb-grad-gold)" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span style={{ fontWeight: 900, color: '#E6EDF3', fontSize: s.titleSize, letterSpacing: '-0.02em' }}>
            $WCB
          </span>
          <span style={{ fontSize: s.subtitleSize, fontWeight: 700, color: '#238636', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            WorldCupBet
          </span>
        </div>
      )}
    </div>
  );
}
