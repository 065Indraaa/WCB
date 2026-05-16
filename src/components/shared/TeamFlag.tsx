/* eslint-disable @next/next/no-img-element */
interface TeamFlagProps {
  code: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { width: 18, height: 14, cdnWidth: 40, radius: 3 },
  sm: { width: 26, height: 20, cdnWidth: 40, radius: 4 },
  md: { width: 38, height: 28, cdnWidth: 80, radius: 5 },
  lg: { width: 52, height: 38, cdnWidth: 80, radius: 6 },
  xl: { width: 74, height: 54, cdnWidth: 160, radius: 8 },
};

export function TeamFlag({ code, name, size = 'md', className = '' }: TeamFlagProps) {
  const { width, height, cdnWidth, radius } = sizeMap[size];
  const safeCode = code.toLowerCase();
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        minWidth: width,
        minHeight: height,
        maxWidth: width,
        maxHeight: height,
        flex: `0 0 ${width}px`,
        overflow: 'hidden',
        borderRadius: radius,
        background: '#0B0B0B',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
      }}
    >
      <img
        src={`https://flagcdn.com/w${cdnWidth}/${safeCode}.png`}
        alt={`${name} flag`}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
        loading="lazy"
      />
    </span>
  );
}
