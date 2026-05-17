'use client';

interface TickerBarProps {
  price?: string;
}

export function TickerBar({ price }: TickerBarProps) {
  const items = [
    '$WCB',
    'WORLDCUPBETS',
    'WORLD CUP 2026',
    '48 TEAMS / 12 GROUPS',
    'BUILT ON SOLANA',
    'KICKOFF JUNE 11, 2026',
    'LOCK & EARN CREDITS',
    '104 MATCHES TO PREDICT',
  ];
  if (price) items.unshift(`$WCB ${price}`);

  const text = items.join('   /   ') + '   /   ';
  const repeated = text + text;

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #070707 0%, #111111 50%, #070707 100%)',
        borderBottom: '1px solid rgba(242,181,68,0.18)',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      role="marquee"
      aria-label="Live ticker"
    >
      {/* Left fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          width: 48,
          height: 30,
          background: 'linear-gradient(to right, #070707, transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          whiteSpace: 'nowrap',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: '#FFD36B',
          animation: 'ticker-scroll 50s linear infinite',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
        }}
      >
        {repeated}
      </div>
      {/* Right fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          width: 48,
          height: 30,
          background: 'linear-gradient(to left, #070707, transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
