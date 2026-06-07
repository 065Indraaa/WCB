import type { Metadata } from 'next';
import { SportsbookLayout } from '@/components/sportsbook/SportsbookLayout';

export const metadata: Metadata = {
  title: {
    default: 'Live Bets | WORLDCUPBETS Sportsbook',
    template: '%s | WORLDCUPBETS Sportsbook',
  },
  description: 'World Cup 2026 live betting dashboard on Solana.',
};

export default function LiveBetsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SportsbookLayout>{children}</SportsbookLayout>;
}
