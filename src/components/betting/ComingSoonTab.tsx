'use client';

interface ComingSoonTabProps {
  title: string;
  description: string;
}

/** Placeholder for dashboard tabs not yet implemented in this iteration. */
export function ComingSoonTab({ title, description }: ComingSoonTabProps) {
  return (
    <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          margin: '0 auto 14px',
          border: '1px solid rgba(242,181,68,0.38)',
          background: 'rgba(242,181,68,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2B544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px' }}>{title}</h2>
      <p style={{ fontSize: '0.85rem', color: '#B3B3B3', maxWidth: 360, margin: '0 auto' }}>{description}</p>
      <span
        style={{
          display: 'inline-block',
          marginTop: 16,
          padding: '4px 12px',
          borderRadius: 9999,
          fontSize: '0.65rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#F2B544',
          background: 'rgba(242,181,68,0.1)',
          border: '1px solid rgba(242,181,68,0.24)',
        }}
      >
        Coming Soon
      </span>
    </div>
  );
}
