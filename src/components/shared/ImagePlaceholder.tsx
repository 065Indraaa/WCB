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

function getVisualKind(label: string): VisualKind {
  const lower = label.toLowerCase();
  if (lower.includes('leaderboard')) return 'leaderboard';
  if (lower.includes('ad slot')) return 'ad';
  if (lower.includes('countdown')) return 'countdown';
  if (lower.includes('credit') || lower.includes('betting')) return 'credits';
  if (lower.includes('security')) return 'security';
  return 'market';
}

const VISUAL_COPY: Record<VisualKind, { eyebrow: string; title: string; sub: string; accent: string }> = {
  leaderboard: {
    eyebrow: 'LIVE RANKING',
    title: 'Leaderboard Sprint',
    sub: 'Lock 60D / climb the board',
    accent: '#F2B544',
  },
  ad: {
    eyebrow: 'MATCHDAY ACCESS',
    title: 'WCB Market Pass',
    sub: 'Vote / lock / enter',
    accent: '#14F195',
  },
  countdown: {
    eyebrow: 'KICKOFF TIMER',
    title: 'June 11, 2026',
    sub: 'Opening match window',
    accent: '#F2B544',
  },
  credits: {
    eyebrow: 'CREDIT TICKET',
    title: '100:1 Early Rate',
    sub: 'Before launch / 60D lock',
    accent: '#9945FF',
  },
  security: {
    eyebrow: 'STREAMFLOW LOCK',
    title: 'On-chain 60D',
    sub: 'No manual custody',
    accent: '#14F195',
  },
  market: {
    eyebrow: 'WCB VISUAL',
    title: 'Football Markets',
    sub: 'World Cup betting layer',
    accent: '#F2B544',
  },
};

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

function IconVisual({ kind, accent }: { kind: VisualKind; accent: string }) {
  if (kind === 'countdown') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 34px)', gap: 5 }}>
        {['D', 'H', 'M'].map((item, index) => (
          <div key={item} style={{ padding: '7px 0', borderRadius: 7, background: 'rgba(7,7,7,0.62)', border: '1px solid rgba(242,181,68,0.2)', textAlign: 'center' }}>
            <div style={{ color: '#FFFFFF', fontSize: '0.86rem', fontWeight: 950 }}>{[26, 18, 45][index]}</div>
            <div style={{ color: '#6E6E6E', fontSize: '0.48rem', fontWeight: 900 }}>{item}</div>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'credits') {
    return (
      <div style={{ position: 'relative', width: 104, height: 76 }}>
        <div style={{ position: 'absolute', inset: '12px 2px 0 18px', borderRadius: 10, background: 'rgba(153,69,255,0.18)', border: '1px solid rgba(153,69,255,0.34)', transform: 'rotate(-7deg)' }} />
        <div style={{ position: 'absolute', inset: '2px 14px 12px 0', borderRadius: 10, background: 'rgba(242,181,68,0.16)', border: '1px solid rgba(242,181,68,0.34)', transform: 'rotate(6deg)' }} />
        <div style={{ position: 'absolute', inset: '9px 8px', borderRadius: 10, background: '#101010', border: '1px solid rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
          <span style={{ color: '#FFD36B', fontSize: '1rem', fontWeight: 950 }}>100:1</span>
        </div>
      </div>
    );
  }

  if (kind === 'security') {
    return (
      <div style={{ position: 'relative', width: 88, height: 88, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', border: `1px solid ${accent}55`, background: `${accent}12` }} />
        <div style={{ width: 42, height: 34, borderRadius: 8, background: '#101010', border: `1px solid ${accent}88`, position: 'relative', boxShadow: `0 0 24px ${accent}20` }}>
          <div style={{ position: 'absolute', width: 24, height: 20, borderRadius: '18px 18px 0 0', border: `4px solid ${accent}`, borderBottom: 0, left: 8, top: -17 }} />
          <div style={{ position: 'absolute', width: 6, height: 12, borderRadius: 999, background: accent, left: 17, top: 10 }} />
        </div>
      </div>
    );
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
  const copy = VISUAL_COPY[kind];
  const compact = height === 90 || label.toLowerCase().includes('leaderboard');
  const showBoard = kind === 'leaderboard' || kind === 'ad';

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
        {showBoard ? <OddsBoard kind={kind} /> : <IconVisual kind={kind} accent={copy.accent} />}
      </div>
    </div>
  );
}
