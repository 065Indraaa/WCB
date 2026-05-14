/* eslint-disable @next/next/no-img-element */
interface TeamFlagProps {
  code: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { width: 16, height: 12, cdnWidth: 20 },
  sm: { width: 24, height: 18, cdnWidth: 40 },
  md: { width: 36, height: 27, cdnWidth: 80 },
  lg: { width: 48, height: 36, cdnWidth: 80 },
  xl: { width: 72, height: 54, cdnWidth: 160 },
};

export function TeamFlag({ code, name, size = 'md', className = '' }: TeamFlagProps) {
  const { width, height, cdnWidth } = sizeMap[size];
  const safeCode = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w${cdnWidth}/${safeCode}.png`}
      alt={`${name} flag`}
      width={width}
      height={height}
      className={`object-cover rounded shadow-sm ring-1 ring-line ${className}`}
      loading="lazy"
    />
  );
}
