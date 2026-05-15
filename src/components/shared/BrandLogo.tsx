import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { img: 28, titleSize: '0.95rem',  subtitleSize: '8px' },
  md: { img: 36, titleSize: '1.1rem',   subtitleSize: '9px' },
  lg: { img: 48, titleSize: '1.35rem',  subtitleSize: '10px' },
};

/**
 * $WCB / WORLDCUPBET brand logo — uses real Logo.jpg from /public
 */
export function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const s = sizeMap[size];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} style={{ gap: '0.5rem' }}>
      <div
        style={{
          width: s.img,
          height: s.img,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1.5px solid rgba(34,197,94,0.35)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
        }}
      >
        <Image
          src="/Logo.jpg"
          alt="WORLDCUPBET logo"
          width={s.img}
          height={s.img}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          priority
        />
      </div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontWeight: 900, color: '#E6EDF3', fontSize: s.titleSize, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            $WCB
          </span>
          <span style={{ fontSize: s.subtitleSize, fontWeight: 700, color: '#22C55E', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
            WorldCupBet
          </span>
        </div>
      )}
    </div>
  );
}
