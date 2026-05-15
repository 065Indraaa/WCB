'use client';

interface TickerBarProps {
  price?: string;
}

export function TickerBar({ price }: TickerBarProps) {
  const items = [
    '⚽ $WCB',
    'WORLDCUPBET',
    '🌍 WORLD CUP 2026',
    '48 TEAMS · 12 GROUPS',
    '◎ BUILT ON SOLANA',
    '🚀 LAUNCHED ON PUMP.FUN',
    '📅 KICKOFF 11 JUNI 2026',
    '🔒 LOCK & EARN CREDITS',
    '🏆 104 MATCHES TO PREDICT',
  ];
  if (price) items.unshift(`$WCB ${price}`);

  const text = items.join('   ·   ') + '   ·   ';
  const repeated = text + text;

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #0A3D1A 0%, #0D4A20 50%, #0A3D1A 100%)',
        borderBottom: '1px solid rgba(34,197,94,0.2)',
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
          background: 'linear-gradient(to right, #0A3D1A, transparent)',
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
          color: '#86EFAC',
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
          background: 'linear-gradient(to left, #0A3D1A, transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
