/**
 * ImagePlaceholder — dark sportsbook style placeholder.
 * Replace with real images when available.
 *
 * Standard sizes:
 *   Hero banner:       1920×600
 *   Match banner:      1200×300
 *   Sidebar ad:        300×250
 *   Leaderboard banner:728×90
 *   Token hero:        1200×400
 *   Lock page banner:  1200×300
 *   Team photo:        200×200
 *   Sponsor logo:      200×80
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
        background: '#1C2128',
        border: '1px dashed #30363D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#484F58',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      aria-label={`Image placeholder: ${label}`}
      role="img"
    >
      {/* Camera icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.5, color: '#8B949E' }}>{label}</span>
    </div>
  );
}
