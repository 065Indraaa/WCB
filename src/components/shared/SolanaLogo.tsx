'use client';

interface SolanaLogoProps {
  size?: number;
  className?: string;
}

export function SolanaLogo({ size = 24, className = '' }: SolanaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Solana logo"
    >
      <defs>
        <linearGradient id="solanaGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path
        d="M2 6.5L4.5 4H19.5L22 6.5L19.5 9H4.5L2 6.5Z"
        fill="url(#solanaGradient)"
        opacity="0.9"
      />
      <path
        d="M2 12L4.5 9.5H19.5L22 12L19.5 14.5H4.5L2 12Z"
        fill="url(#solanaGradient)"
        opacity="0.6"
      />
      <path
        d="M2 17.5L4.5 15H19.5L22 17.5L19.5 20H4.5L2 17.5Z"
        fill="url(#solanaGradient)"
        opacity="0.3"
      />
    </svg>
  );
}
