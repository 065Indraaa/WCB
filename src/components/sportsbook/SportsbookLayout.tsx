'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { MenuIcon } from '@/components/shared/MenuIcons';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { useLiveBettingMenu } from '@/lib/hooks/useLiveBettingMenu';
import { WalletButton } from '@/components/wallet/WalletButton';
import { CreditBalanceDisplay } from '@/components/betting/CreditBalanceDisplay';
import { NotificationsBell } from '@/components/betting/NotificationsBell';
import { useBets } from '@/lib/hooks/useBets';
import { useCreditBalance } from '@/lib/hooks/useCreditBalance';

const SIDEBAR_LINKS = [
  { href: '/live-bets', label: 'Markets', icon: 'live' as const },
  { href: '/live-bets/my-bets', label: 'My Bets', icon: 'token' as const },
  { href: '/live-bets/leaderboard', label: 'Leaderboard', icon: 'leaderboard' as const },
];

export function SportsbookLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#070707' }}>
      <SportsbookHeader />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Main - Full Width, No Sidebar */}
        <main style={{ flex: 1, width: '100%', minWidth: 0, overflowY: 'auto', overflowX: 'hidden', background: '#070707' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 12px 90px' }} className="sm:p-6 sm:pb-24 lg:p-8 lg:pb-28">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav pathname={pathname} />
    </div>
  );
}

/* ---------- Header ---------- */
function SportsbookHeader() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wallet = publicKey ? publicKey.toBase58() : null;
  const { balance, loading: balanceLoading } = useCreditBalance(wallet);
  const { bets } = useBets(wallet);
  const available = wallet ? balance?.availableCredits ?? null : null;

  return (
    <header style={{ height: 56, flexShrink: 0, background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '0 16px', zIndex: 50 }}>
      <Link href="/live-bets" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <BrandLogo size="sm" />
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F2B544', letterSpacing: '0.06em' }}>SPORTSBOOK</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {mounted && connected && (
          <>
            <CreditBalanceDisplay available={available} loading={balanceLoading} />
            <NotificationsBell bets={bets} />
          </>
        )}
        {mounted && <WalletButton />}
      </div>
    </header>
  );
}

/* ---------- Mobile Bottom Nav ---------- */
function MobileBottomNav({ pathname }: { pathname: string }) {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wallet = publicKey ? publicKey.toBase58() : null;
  const { activeBetCount } = useLiveBettingMenu(wallet);

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, height: 64, background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px' }}>
      {SIDEBAR_LINKS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const isMyBets = item.href === '/live-bets/my-bets';
        const showBadge = mounted && isMyBets && activeBetCount > 0;
        
        return (
          <Link key={item.href} href={item.href} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 4, 
            padding: '6px 10px', 
            borderRadius: 10, 
            textDecoration: 'none', 
            color: active ? '#F2B544' : '#6E6E6E', 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em', 
            flex: 1,
            position: 'relative',
            transition: 'all 0.2s'
          }}>
            <span style={{ 
              width: 28, 
              height: 28, 
              borderRadius: 8, 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: active ? 'rgba(242,181,68,0.14)' : 'transparent', 
              border: active ? '1.5px solid rgba(242,181,68,0.3)' : '1.5px solid transparent',
              position: 'relative'
            }}>
              <MenuIcon name={item.icon} width={14} height={14} />
              {showBadge && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 8,
                  background: '#14F195',
                  color: '#070707',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #070707'
                }}>
                  {activeBetCount}
                </span>
              )}
            </span>
            <span style={{ lineHeight: 1 }}>{item.label}</span>
          </Link>
        );
      })}
      
      {/* Exit to Site */}
      <Link href="/" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 4, 
        padding: '6px 10px', 
        borderRadius: 10, 
        textDecoration: 'none', 
        color: '#6E6E6E', 
        fontSize: '0.65rem', 
        fontWeight: 800, 
        textTransform: 'uppercase', 
        letterSpacing: '0.04em', 
        flex: 1,
        transition: 'all 0.2s'
      }}>
        <span style={{ 
          width: 28, 
          height: 28, 
          borderRadius: 8, 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'transparent'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
          </svg>
        </span>
        <span style={{ lineHeight: 1 }}>Exit</span>
      </Link>
    </nav>
  );
}
