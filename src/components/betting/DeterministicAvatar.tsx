/**
 * Deterministic identicon generated from a wallet address.
 *
 * Renders a blockies-style 5x5 symmetric pixel grid with a deterministic
 * two-color palette derived from the address. No external dependency.
 * The same address always yields the same avatar so it stays consistent
 * across the header, leaderboard, and activity feed.
 *
 * Can be swapped for jazzicon/blockies later without changing call sites.
 */

interface DeterministicAvatarProps {
  address: string;
  size?: number;
}

/** Simple stable string hash (FNV-1a style). */
function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic PRNG seeded from the hash (mulberry32). */
function makeRng(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function DeterministicAvatar({ address, size = 28 }: DeterministicAvatarProps) {
  const seed = hashString(address || 'wcb');
  const rng = makeRng(seed);

  const hue = Math.floor(rng() * 360);
  const fg = `hsl(${hue}, 68%, 58%)`;
  const bg = `hsl(${(hue + 200) % 360}, 24%, 14%)`;

  // 5 columns, mirrored → only need to decide the left 3 columns per row.
  const cells = 5;
  const cellSize = size / cells;
  const rects: { x: number; y: number }[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < 3; x++) {
      if (rng() > 0.5) {
        rects.push({ x, y });
        if (x < 2) rects.push({ x: cells - 1 - x, y });
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Wallet avatar"
      style={{ borderRadius: '50%', flexShrink: 0, display: 'block', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <rect width={size} height={size} fill={bg} />
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x * cellSize}
          y={r.y * cellSize}
          width={cellSize + 0.5}
          height={cellSize + 0.5}
          fill={fg}
        />
      ))}
    </svg>
  );
}
