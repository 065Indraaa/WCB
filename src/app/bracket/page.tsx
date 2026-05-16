export const metadata = { title: 'Bracket | World Cup 2026' };

const SLOT_HEIGHT = 104;
const SLOT_WIDTH = 190;
const BASE_GAP = 18;
const BASE_MATCH_COUNT = 16;
const BASE_STEP = SLOT_HEIGHT + BASE_GAP;
const BRACKET_HEIGHT = BASE_MATCH_COUNT * SLOT_HEIGHT + (BASE_MATCH_COUNT - 1) * BASE_GAP;
const CONNECTOR_WIDTH = 64;
const CONNECTOR_JOIN_X = 28;

const ROUNDS = [
  { id: 'R32', label: 'Round of 32', count: 32 },
  { id: 'R16', label: 'Round of 16', count: 16 },
  { id: 'QF', label: 'Quarter-Finals', count: 8 },
  { id: 'SF', label: 'Semi-Finals', count: 4 },
  { id: 'F', label: 'Final', count: 2 },
];

function getRoundLayout(roundIndex: number) {
  const groupSize = 2 ** roundIndex;
  const centerStep = BASE_STEP * groupSize;
  const gap = centerStep - SLOT_HEIGHT;
  const paddingTop = (BASE_STEP * (groupSize - 1)) / 2;

  return { gap, paddingTop, centerStep };
}

function MatchSlot({ position }: { position: number }) {
  return (
    <div
      className="bracket-slot card overflow-hidden transition-colors"
      style={{ width: 190, minHeight: 104, padding: '0.75rem', background: '#111111' }}
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

function BracketConnectors({ matchCount }: { matchCount: number }) {
  if (matchCount <= 1) return null;
  const roundIndex = Math.log2(BASE_MATCH_COUNT / matchCount);
  const { paddingTop, centerStep } = getRoundLayout(roundIndex);
  const nextLayout = getRoundLayout(roundIndex + 1);

  return (
    <div className="bracket-connectors" aria-hidden="true">
      {Array.from({ length: matchCount / 2 }).map((_, i) => {
        const topCenter = paddingTop + SLOT_HEIGHT / 2 + (i * 2) * centerStep;
        const bottomCenter = paddingTop + SLOT_HEIGHT / 2 + (i * 2 + 1) * centerStep;
        const targetCenter = nextLayout.paddingTop + SLOT_HEIGHT / 2 + i * nextLayout.centerStep;

        return (
          <div key={i} className="bracket-connector">
            <span
              className="bracket-line bracket-line-horizontal"
              style={{ left: 0, top: topCenter, width: CONNECTOR_JOIN_X }}
            />
            <span
              className="bracket-line bracket-line-horizontal"
              style={{ left: 0, top: bottomCenter, width: CONNECTOR_JOIN_X }}
            />
            <span
              className="bracket-line bracket-line-vertical"
              style={{ left: CONNECTOR_JOIN_X, top: topCenter, height: bottomCenter - topCenter }}
            />
            <span
              className="bracket-line bracket-line-horizontal bracket-line-output"
              style={{ left: CONNECTOR_JOIN_X, top: targetCenter, width: CONNECTOR_WIDTH - CONNECTOR_JOIN_X }}
            />
          </div>
        );
      })}
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
        <div className="bracket-board">
          {ROUNDS.map((round, roundIndex) => {
            const matchCount = round.count / 2;
            const { gap, paddingTop } = getRoundLayout(roundIndex);

            return (
              <div key={round.id} className="bracket-round-wrap">
                <div className="bracket-round">
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
                    className="bracket-slots"
                    style={{
                      gap,
                      paddingTop,
                    }}
                  >
                    {Array.from({ length: matchCount }).map((_, i) => (
                      <MatchSlot key={i} position={i + 1} />
                    ))}
                  </div>
                </div>
                <BracketConnectors matchCount={matchCount} />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .bracket-board {
          display: flex;
          align-items: flex-start;
          gap: 0;
          min-width: max-content;
          padding: 2px 12px 4px 2px;
        }

        .bracket-round-wrap {
          display: flex;
          align-items: flex-start;
        }

        .bracket-round {
          position: relative;
          z-index: 2;
          width: ${SLOT_WIDTH}px;
        }

        .bracket-slots {
          display: flex;
          flex-direction: column;
          min-height: ${BRACKET_HEIGHT}px;
        }

        .bracket-slot {
          position: relative;
          z-index: 2;
        }

        .bracket-connectors {
          position: relative;
          width: ${CONNECTOR_WIDTH}px;
          height: ${BRACKET_HEIGHT}px;
          margin-top: 55px;
          flex: 0 0 ${CONNECTOR_WIDTH}px;
        }

        .bracket-connector {
          position: absolute;
          inset: 0;
        }

        .bracket-line {
          position: absolute;
          display: block;
          background: linear-gradient(90deg, rgba(242,181,68,0.18), rgba(242,181,68,0.62));
          box-shadow: 0 0 12px rgba(242,181,68,0.12);
        }

        .bracket-line-horizontal {
          height: 1px;
          transform: translateY(-0.5px);
        }

        .bracket-line-vertical {
          width: 1px;
          transform: translateX(-0.5px);
          background: linear-gradient(180deg, rgba(242,181,68,0.62), rgba(242,181,68,0.18));
        }

        .bracket-line-output::after {
          content: '';
          position: absolute;
          right: -3px;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #F2B544;
          box-shadow: 0 0 14px rgba(242,181,68,0.35);
        }

        .bracket-round-wrap:last-child .bracket-connectors {
          display: none;
        }

        .bracket-round-wrap:last-child {
          padding-right: 0;
        }

        @media (max-width: 768px) {
          .bracket-board {
            padding-bottom: 10px;
          }

          .bracket-connectors {
            opacity: 0.86;
          }
        }
      `}</style>

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
