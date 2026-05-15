/**
 * ImagePlaceholder - dark sportsbook style placeholder.
 * Replace with real images when available.
 *
 * Standard sizes:
 *   Hero banner:       1920 x 600
 *   Match banner:      1200 x 300
 *   Sidebar ad:        300 x 250
 *   Leaderboard banner:728 x 90
 *   Token hero:        1200 x 400
 *   Lock page banner:  1200 x 300
 *   Team photo:        200 x 200
 *   Sponsor logo:      200 x 80
 */

interface ImagePlaceholderProps {
  width?: string | number;
  height?: string | number;
  label?: string;
  aspectRatio?: string;
  rounded?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ImagePlaceholder({
  width = '100%',
  height,
  label = 'Photo',
  aspectRatio,
  rounded = 6,
  className = '',
  style = {},
}: ImagePlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height: height ?? (aspectRatio ? undefined : 200),
        aspectRatio: aspectRatio,
        borderRadius: rounded,
        background: '#111111',
        border: '1px dashed #2A2A2A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#6E6E6E',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      aria-label={`Image placeholder: ${label}`}
      role="img"
    >
      <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', color: '#F2B544' }}>
        WCB
      </span>
      <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.72, color: '#B3B3B3' }}>{label}</span>
    </div>
  );
}
