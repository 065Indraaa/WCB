export const metadata = { title: 'Bracket | World Cup 2026' };

const ROUNDS = [
  { id: 'R32', label: 'Round of 32', count: 32 },
  { id: 'R16', label: 'Round of 16', count: 16 },
  { id: 'QF', label: 'Quarter-Finals', count: 8 },
  { id: 'SF', label: 'Semi-Finals', count: 4 },
  { id: 'F', label: 'Final', count: 2 },
];

function MatchSlot({ position }: { position: number }) {
  return (
    <div
      className="card overflow-hidden mb-3 transition-colors"
      style={{ minWidth: 180, padding: '0.75rem', background: '#111111' }}
    >
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded"
          style={{ background: '#171717', border: '1px solid #2A2A2A' }}
        >
          <span
            className="flex items-center justify-center font-bold rounded"
            style={{
              width: 20,
              height: 20,
              background: 'rgba(242,181,68,0.12)',
              color: '#FFD36B',
              fontSize: '10px',
            }}
          >
            ?
          </span>
          <span className="text-sm font-semibold" style={{ color: '#B3B3B3' }}>
            TBD
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded"
          style={{ background: '#171717', border: '1px solid #2A2A2A' }}
        >
          <span
            className="flex items-center justify-center font-bold rounded"
            style={{
              width: 20,
              height: 20,
              background: 'rgba(242,181,68,0.12)',
              color: '#FFD36B',
              fontSize: '10px',
            }}
          >
            ?
          </span>
          <span className="text-sm font-semibold" style={{ color: '#B3B3B3' }}>
            TBD
          </span>
        </div>
      </div>
      <p
        className="font-bold uppercase tracking-wider mt-2 text-center"
        style={{ fontSize: '10px', color: '#6E6E6E' }}
      >
        Match {position}
      </p>
    </div>
  );
}

export default function BracketPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">Knockout Bracket</p>
        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{ color: '#FFFFFF' }}
        >
          Road to the Final
        </h1>
        <p className="text-lg max-w-2xl" style={{ color: '#B3B3B3' }}>
          MetLife Stadium, July 19, 2026. Slots fill in as group stage results come in.
        </p>
      </div>

      {/* Bracket, horizontally scrollable */}
      <div className="card p-6 overflow-x-auto" style={{ background: '#111111' }}>
        <div className="flex gap-6" style={{ minWidth: 'fit-content' }}>
          {ROUNDS.map((round) => {
            const matchCount = round.count / 2;
            return (
              <div key={round.id} className="flex flex-col">
                {/* Round header */}
                <div className="text-center mb-4">
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: '#F2B544' }}
                  >
                    {round.label}
                  </p>
                  <p className="text-xs" style={{ color: '#6E6E6E' }}>
                    {matchCount} match{matchCount !== 1 ? 'es' : ''}
                  </p>
                </div>
                {/* Slots */}
                <div
                  className="flex flex-col justify-around"
                  style={{ minHeight: matchCount * 120 }}
                >
                  {Array.from({ length: matchCount }).map((_, i) => (
                    <MatchSlot key={i} position={i + 1} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final highlight card */}
      <div
        className="mt-10 rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #111111 0%, #171717 100%)',
          border: '1px solid rgba(242,181,68,0.26)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.36)',
        }}
      >
        <p
          className="font-bold uppercase tracking-widest mb-2"
          style={{ fontSize: '0.7rem', color: '#F2B544' }}
        >
          Grand Final
        </p>
        <h2
          className="text-3xl sm:text-4xl font-black mb-2"
          style={{ color: '#ffffff' }}
        >
          July 19, 2026
        </h2>
        <p className="text-lg" style={{ color: '#B3B3B3' }}>
          MetLife Stadium, East Rutherford, NJ
        </p>
        <div
          className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl"
          style={{
            background: 'rgba(242,181,68,0.08)',
            border: '1px solid rgba(242,181,68,0.24)',
          }}
        >
          <span className="text-2xl" style={{ color: '#FFD36B', fontWeight: 900 }}>
            WCB
          </span>
          <div className="text-left">
            <p
              className="font-bold uppercase tracking-wider"
              style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}
            >
              FIFA World Cup
            </p>
            <p className="font-bold" style={{ color: '#ffffff' }}>
              United 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
