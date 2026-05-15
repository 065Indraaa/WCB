'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';

const NAV_LINKS = [
  { label: 'Home',        href: '/',            icon: 'HOME' },
  { label: 'Matches',     href: '/matches',     icon: 'MATCH' },
  { label: 'Groups',      href: '/groups',      icon: 'GROUP' },
  { label: 'Bracket',     href: '/bracket',     icon: 'CUP' },
  { label: 'Token',       href: '/token',       icon: 'WCB' },
  { label: 'Lock & Earn', href: '/lock',        icon: 'LOCK', dot: true },
  { label: 'Docs',        href: '/docs',        icon: 'DOCS' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'BOARD' },
];

const MOBILE_NAV = [
  { label: 'Home',    href: '/',            code: 'H' },
  { label: 'Matches', href: '/matches',     code: 'M' },
  { label: 'Groups',  href: '/groups',      code: 'G' },
  { label: 'Lock',    href: '/lock',        code: 'L' },
  { label: 'Board',   href: '/leaderboard', code: 'B' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Detect scroll for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: scrolled
            ? 'rgba(7,7,7,0.97)'
            : 'rgba(7,7,7,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(242,181,68,0.2)'
            : '1px solid rgba(242,181,68,0.12)',
          height: 56,
          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <nav
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            gap: 12,
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="WORLDCUPBET home"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Desktop nav links */}
          <ul
            style={{
              display: 'none',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: 2,
              alignItems: 'center',
            }}
            className="lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 11px',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      color: active ? '#ffffff' : '#B3B3B3',
                      background: active ? 'rgba(242,181,68,0.12)' : 'transparent',
                      borderBottom: active ? '2px solid #F2B544' : '2px solid transparent',
                      transition: 'color 0.15s, background 0.15s',
                    }}
                  >
                    {link.dot && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'inline-block',
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#14F195',
                          flexShrink: 0,
                          boxShadow: '0 0 6px #14F195',
                        }}
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Buy button, desktop */}
            <a
              href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex"
              style={{
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                background: '#F2B544',
                color: '#070707',
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 18px rgba(242,181,68,0.26)',
                transition: 'opacity 0.15s',
              }}
            >
              Buy $WCB
            </a>

            <WalletButtonDynamic className="hidden sm:inline-flex" />

            {/* Hamburger, mobile only */}
            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 36,
                height: 36,
                gap: 5,
                borderRadius: 6,
                background: menuOpen ? 'rgba(242,181,68,0.12)' : 'transparent',
                border: '1px solid',
                borderColor: menuOpen ? 'rgba(242,181,68,0.32)' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              className="lg:hidden"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span style={{ display: 'block', height: 2, width: 18, background: '#E6EDF3', borderRadius: 1, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ display: 'block', height: 2, width: 18, background: '#E6EDF3', borderRadius: 1, transition: 'opacity 0.15s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', height: 2, width: 18, background: '#E6EDF3', borderRadius: 1, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 35,
            background: 'rgba(7,7,7,0.98)',
            backdropFilter: 'blur(20px)',
            paddingTop: 56,
            overflowY: 'auto',
          }}
          className="lg:hidden"
        >
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: 4,
            }}
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? '#ffffff' : '#B3B3B3',
                    background: active ? 'rgba(242,181,68,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #F2B544' : '3px solid transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', color: active ? '#F2B544' : '#6E6E6E', width: 42 }}>{link.icon}</span>
                  {link.label}
                  {link.dot && (
                    <span
                      aria-hidden="true"
                      style={{
                        marginLeft: 'auto',
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#14F195',
                        boxShadow: '0 0 8px #14F195',
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a
                href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  background: '#F2B544',
                  color: '#070707',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 22px rgba(242,181,68,0.28)',
                }}
              >
                Buy $WCB
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile bottom nav bar */}
      <MobileBottomNav pathname={pathname} />
    </>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile bottom navigation">
      {MOBILE_NAV.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item${active ? ' active' : ''}`}
            aria-label={item.label}
          >
            <span
              aria-hidden="true"
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
                fontWeight: 900,
                background: active ? 'rgba(242,181,68,0.16)' : 'transparent',
                border: active ? '1px solid rgba(242,181,68,0.28)' : '1px solid transparent',
              }}
            >
              {item.code}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
