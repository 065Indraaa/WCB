import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { TickerBar } from '@/components/layout/TickerBar';
import { Footer } from '@/components/layout/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://worldcupbet.live';

export const metadata: Metadata = {
  title: {
    default: '$WCB | WORLDCUPBET - World Cup 2026 Betting on Solana',
    template: '%s | WORLDCUPBET',
  },
  description:
    'Predict every match of the 2026 World Cup, hold $WCB on Solana, climb the leaderboard, and unlock priority football betting access.',
  keywords: ['World Cup 2026', 'WCB token', 'Solana betting', 'football predictions', 'crypto sportsbook', 'WORLDCUPBET'],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    title: '$WCB | WORLDCUPBET - World Cup 2026 Betting',
    description: 'The premium Solana football betting and prediction platform for World Cup 2026.',
    url: SITE_URL,
    siteName: 'WORLDCUPBET',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$WCB | WORLDCUPBET - World Cup 2026',
    description: 'Predict every match. Hold $WCB. Win the cup. Built on Solana.',
    creator: '@WCBLIVE',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ background: '#070707', color: '#FFFFFF' }} className="antialiased min-h-screen flex flex-col">
        <Providers>
          {/* Navbar is fixed, so the layout needs a spacer below it. */}
          <Navbar />
          {/* Spacer: navbar h-14 (56px) + tickerbar ~h-8 (30px) = 86px */}
          <div style={{ height: 86 }} aria-hidden="true" />
          <TickerBar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
