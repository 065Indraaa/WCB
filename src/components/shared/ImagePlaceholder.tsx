import type { CSSProperties } from 'react';

interface ImagePlaceholderProps {
  width?: string | number;
  height?: string | number;
  label?: string;
  aspectRatio?: string;
  rounded?: number;
  className?: string;
  style?: CSSProperties;
}

type VisualKind = 'leaderboard' | 'ad' | 'countdown' | 'credits' | 'security' | 'market';
type VisualCopy = { eyebrow: string; title: string; sub: string; accent: string; visual?: VisualKind };

function getVisualKind(label: string): VisualKind {
  const lower = label.toLowerCase();
  if (lower.includes('leaderboard')) return 'leaderboard';
  if (lower.includes('ad slot')) return 'ad';
  if (lower.includes('countdown')) return 'countdown';
  if (lower.includes('credit') || lower.includes('betting')) return 'credits';
  if (lower.includes('security')) return 'security';
  return 'market';
}

const VISUAL_COPY: Record<VisualKind, VisualCopy> = {
  leaderboard: {
    eyebrow: 'RANKING BOARD',
    title: 'Live lock standings',
    sub: 'Eligible 60-day locks only',
    accent: '#F2B544',
  },
  ad: {
    eyebrow: 'MATCHDAY PASS',
    title: 'Vote before markets open',
    sub: 'Preview picks, no live betting yet',
    accent: '#14F195',
  },
  countdown: {
    eyebrow: 'EARLY WINDOW',
    title: 'Lock before June 11',
    sub: 'Get the 100 WCB per credit rate',
    accent: '#F2B544',
  },
  credits: {
    eyebrow: 'PLATFORM CREDIT',
    title: 'Credits track your lock',
    sub: 'Redeem / withdraw coming soon',
    accent: '#9945FF',
  },
  security: {
    eyebrow: 'STREAMFLOW LOCK',
    title: 'Fixed 60-day lock',
    sub: 'Read from real on-chain records',
    accent: '#14F195',
  },
  market: {
    eyebrow: 'WORLD CUP MARKET',
    title: 'Football preview board',
    sub: 'Sentiment before betting opens',
    accent: '#F2B544',
  },
};

const SLOT_COPY: Array<{ key: string; copy: VisualCopy }> = [
  {
    key: 'lock now market bar',
    copy: {
      eyebrow: 'LOCK WINDOW',
      title: 'Lock Now. Earn Credits.',
      sub: 'Early rate before kickoff',
      accent: '#F2B544',
      visual: 'credits',
    },
  },
  {
    key: 'prime matchday sponsor',
    copy: {
      eyebrow: 'PRIME MATCHDAY',
      title: 'Opening odds desk',
      sub: 'Featured partner slot',
      accent: '#14F195',
      visual: 'market',
    },
  },
  {
    key: 'credit boost lounge',
    copy: {
      eyebrow: 'CREDIT BOOST',
      title: 'Lock edge starts here',
      sub: 'Priority access lane',
      accent: '#9945FF',
      visual: 'credits',
    },
  },
  {
    key: 'opening line watch',
    copy: {
      eyebrow: 'LINE WATCH',
      title: 'Markets warming up',
      sub: 'Match-by-match preview board',
      accent: '#FFD36B',
      visual: 'market',
    },
  },
  {
    key: 'live ticket zone',
    copy: {
      eyebrow: 'TICKET ZONE',
      title: 'Builder opens soon',
      sub: 'Save the matchday lane',
      accent: '#14F195',
      visual: 'ad',
    },
  },
  {
    key: 'sharp lock desk',
    copy: {
      eyebrow: 'SHARP LOCK DESK',
      title: 'Lock credits first',
      sub: 'Early wallet edge',
      accent: '#F2B544',
      visual: 'security',
    },
  },
];

function getVisualCopy(label: string): VisualCopy {
  const lower = label.toLowerCase();
  return SLOT_COPY.find((slot) => lower.includes(slot.key))?.copy ?? VISUAL_COPY[getVisualKind(label)];
}

function FieldLines({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: compact ? '12% 8%' : '10% 7%',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: compact ? 8 : 14,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: compact ? '12%' : '10%',
          bottom: compact ? '12%' : '10%',
          left: '50%',
          width: 1,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: compact ? 54 : 92,
          height: compact ? 54 : 92,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}

function OddsBoard({ kind }: { kind: VisualKind }) {
  const rows = kind === 'leaderboard'
    ? [
        ['#01', 'LOCK', '60D'],
        ['#02', 'VOTE', 'LIVE'],
        ['#03', 'FEE', 'POOL'],
      ]
    : [
        ['BRA', '2.10', 'ARG'],
        ['ENG', '1.88', 'FRA'],
        ['WCB', '100:1', 'CR'],
      ];

  return (
    <div
      style={{
        display: 'grid',
        gap: 5,
        minWidth: kind === 'leaderboard' ? 178 : 128,
      }}
    >
      {rows.map(([left, mid, right]) => (
        <div
          key={`${left}-${mid}-${right}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            borderRadius: 7,
            background: 'rgba(7,7,7,0.56)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: kind === 'leaderboard' ? '0.58rem' : '0.62rem',
            fontWeight: 900,
            color: '#E6EDF3',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span>{left}</span>
          <span style={{ color: '#F2B544' }}>{mid}</span>
          <span style={{ textAlign: 'right', color: '#B3B3B3' }}>{right}</span>
        </div>
      ))}
    </div>
  );
}

function CountdownVisual({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'grid', gap: 7, minWidth: 132 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
        {[
          ['26', 'DAYS'],
          ['18', 'HRS'],
          ['45', 'MIN'],
        ].map(([value, label]) => (
          <div key={label} style={{ padding: '7px 0', borderRadius: 8, background: 'rgba(7,7,7,0.68)', border: '1px solid rgba(242,181,68,0.22)', textAlign: 'center' }}>
            <div style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 950 }}>{value}</div>
            <div style={{ color: '#6E6E6E', fontSize: '0.46rem', fontWeight: 950, letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ width: '68%', height: '100%', background: `linear-gradient(90deg, ${accent}, #FFD36B)`, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function CreditTicketVisual() {
  return (
    <div style={{ position: 'relative', width: 132, height: 84 }}>
      <div style={{ position: 'absolute', inset: '18px 6px 0 24px', borderRadius: 12, background: 'rgba(153,69,255,0.18)', border: '1px solid rgba(153,69,255,0.34)', transform: 'rotate(-7deg)' }} />
      <div style={{ position: 'absolute', inset: '4px 18px 18px 0', borderRadius: 12, background: 'rgba(242,181,68,0.16)', border: '1px solid rgba(242,181,68,0.34)', transform: 'rotate(6deg)' }} />
      <div style={{ position: 'absolute', inset: '11px 10px', borderRadius: 12, background: '#101010', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0 10px', gap: 8 }}>
        <div>
          <div style={{ color: '#FFD36B', fontSize: '0.58rem', fontWeight: 950, letterSpacing: '0.1em' }}>EARLY</div>
          <div style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 950, lineHeight: 1 }}>100:1</div>
        </div>
        <div style={{ width: 1, height: 38, borderLeft: '1px dashed rgba(255,255,255,0.24)' }} />
      </div>
    </div>
  );
}

function SecurityVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position: 'relative', width: 132, height: 88, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', left: 4, right: 4, top: 40, height: 2, background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }} />
      {[10, 56, 102].map((left, index) => (
        <div key={left} style={{ position: 'absolute', left, top: index === 1 ? 12 : 26, width: 20, height: 20, borderRadius: '50%', background: '#101010', border: `1px solid ${accent}66`, boxShadow: `0 0 18px ${accent}20` }} />
      ))}
      <div style={{ width: 50, height: 39, borderRadius: 10, background: '#101010', border: `1px solid ${accent}88`, position: 'relative', boxShadow: `0 0 26px ${accent}20` }}>
        <div style={{ position: 'absolute', width: 28, height: 22, borderRadius: '18px 18px 0 0', border: `4px solid ${accent}`, borderBottom: 0, left: 10, top: -18 }} />
        <div style={{ position: 'absolute', width: 7, height: 13, borderRadius: 999, background: accent, left: 20, top: 12 }} />
      </div>
    </div>
  );
}

function MarketPassVisual({ accent }: { accent: string }) {
  return (
    <div style={{ width: 130, display: 'grid', gap: 6 }}>
      {[
        ['VOTE', 'OPEN'],
        ['LOCK', '60D'],
        ['BET', 'JUN 11'],
      ].map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: 8, background: 'rgba(7,7,7,0.58)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: '#B3B3B3', fontSize: '0.55rem', fontWeight: 950 }}>{label}</span>
          <span style={{ color: accent, fontSize: '0.58rem', fontWeight: 950 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function IconVisual({ kind, accent }: { kind: VisualKind; accent: string }) {
  if (kind === 'countdown') {
    return <CountdownVisual accent={accent} />;
  }

  if (kind === 'credits') {
    return <CreditTicketVisual />;
  }

  if (kind === 'security') {
    return <SecurityVisual accent={accent} />;
  }

  if (kind === 'ad') {
    return <MarketPassVisual accent={accent} />;
  }

  return <OddsBoard kind={kind} />;
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
  const kind = getVisualKind(label);
  const copy = getVisualCopy(label);
  const visualKind = copy.visual ?? kind;
  const compact = height === 90 || label.toLowerCase().includes('leaderboard');

  return (
    <div
      className={className}
      style={{
        width,
        height: height ?? (aspectRatio ? undefined : 200),
        aspectRatio: aspectRatio,
        borderRadius: rounded,
        background:
          `radial-gradient(circle at 18% 18%, ${copy.accent}2e, transparent 34%), linear-gradient(135deg, #0A0F0C 0%, #111111 48%, #171717 100%)`,
        border: `1px solid ${copy.accent}36`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: compact ? '0.75rem' : '1rem',
        color: '#FFFFFF',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        padding: compact ? '12px 14px' : '16px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        ...style,
      }}
      aria-label={`WCB visual: ${copy.title}`}
      role="img"
    >
      <FieldLines compact={compact} />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: compact ? 54 : 82,
          height: compact ? 54 : 82,
          right: compact ? 18 : 22,
          bottom: compact ? -20 : -24,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #FFFFFF 0 10%, ${copy.accent} 11% 18%, #101010 19% 100%)`,
          opacity: 0.16,
          filter: 'blur(0.2px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: compact ? 4 : 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: copy.accent, boxShadow: `0 0 14px ${copy.accent}` }} />
          <span style={{ color: copy.accent, fontSize: compact ? '0.52rem' : '0.6rem', fontWeight: 950, letterSpacing: '0.14em' }}>
            {copy.eyebrow}
          </span>
        </div>
        <div style={{ color: '#FFFFFF', fontSize: compact ? '0.95rem' : '1.15rem', fontWeight: 950, lineHeight: 1.05 }}>
          {copy.title}
        </div>
        <div style={{ color: '#B3B3B3', fontSize: compact ? '0.62rem' : '0.74rem', fontWeight: 750, marginTop: compact ? 4 : 7, lineHeight: 1.25 }}>
          {copy.sub}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <IconVisual kind={visualKind} accent={copy.accent} />
      </div>
    </div>
  );
}
