import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { TickerBar } from '@/components/layout/TickerBar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundSong } from '@/components/layout/BackgroundSong';

const WelcomePopup = dynamic(
  () => import('@/components/shared/WelcomePopup').then((m) => m.WelcomePopup),
  { ssr: false },
);

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundSong />
      <WelcomePopup />
      <Navbar />
      {/* Spacer: navbar h-14 (56px) + tickerbar ~h-8 (30px) = 86px */}
      <div style={{ height: 86 }} aria-hidden="true" />
      <TickerBar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
