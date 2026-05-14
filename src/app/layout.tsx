import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { TickerBar } from '@/components/layout/TickerBar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://worldcupbet.live';

export const metadata: Metadata = {
  title: {
    default: '$WCB · WORLDCUPBET — World Cup 2026 Predictions on Solana',
    template: '%s · WORLDCUPBET',
  },
  description:
    'Predict every match of the 2026 FIFA World Cup. Hold $WCB on Solana, climb the leaderboard, and ride the hype. Real betting opens after launch.',
  keywords: ['World Cup 2026', 'WCB token', 'Solana memecoin', 'football predictions', 'Pump.fun', 'WORLDCUPBET'],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    title: '$WCB · WORLDCUPBET — World Cup 2026 Predictions',
    description: 'The community prediction platform for World Cup 2026. Built on Solana, launched on Pump.fun.',
    url: SITE_URL,
    siteName: 'WORLDCUPBET',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$WCB · WORLDCUPBET — World Cup 2026',
    description: 'Predict every match. Hold $WCB. Win the cup. Built on Solana.',
    creator: '@WCBLIVE',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-page text-ink antialiased min-h-screen flex flex-col">
        <Providers>
          {/* Navbar is fixed — needs a spacer below it */}
          <Navbar />
          {/* Spacer: navbar h-16 + tickerbar ~h-8 = 64+32 = 96px */}
          <div className="h-24" aria-hidden="true" />
          <TickerBar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
