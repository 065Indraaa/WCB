/**
 * ImagePlaceholder — kotak placeholder untuk foto yang belum ada.
 * Ganti src prop dengan path foto asli nanti.
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
  rounded = 12,
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
        background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
        border: '2px dashed #94A3B8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#64748B',
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
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.5 }}
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.6 }}>{label}</span>
    </div>
  );
}
