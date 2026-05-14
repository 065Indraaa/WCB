'use client';

interface TickerBarProps {
  price?: string;
}

export function TickerBar({ price }: TickerBarProps) {
  const items = [
    '$WCB',
    'WORLDCUPBET',
    'WORLD CUP 2026',
    '48 TEAMS',
    '12 GROUPS',
    'BUILT ON SOLANA',
    'LAUNCHED ON PUMP.FUN',
    'JUNE 11 KICKOFF',
  ];
  if (price) items.unshift(`$WCB ${price}`);

  const text = items.join('  ·  ') + '  ·  ';
  const repeated = text + text;

  return (
    <div
      className="bg-[#15803D] text-white overflow-hidden select-none"
      role="marquee"
      aria-label="Ticker"
      style={{ height: '32px', display: 'flex', alignItems: 'center' }}
    >
      <div
        className="whitespace-nowrap text-xs font-bold tracking-widest"
        style={{
          animation: 'ticker-scroll 40s linear infinite',
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
    </div>
  );
}
