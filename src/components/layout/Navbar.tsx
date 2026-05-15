'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { WalletButtonDynamic } from '@/components/wallet/WalletButtonDynamic';

const NAV_LINKS = [
  { label: 'Home',        href: '/',            icon: '🏠' },
  { label: 'Matches',     href: '/matches',     icon: '⚽' },
  { label: 'Groups',      href: '/groups',      icon: '🌍' },
  { label: 'Bracket',     href: '/bracket',     icon: '🏆' },
  { label: 'Token',       href: '/token',       icon: '💎' },
  { label: 'Lock & Earn', href: '/lock',        icon: '🔒', dot: true },
  { label: 'Leaderboard', href: '/leaderboard', icon: '📊' },
];

// Mobile bottom nav — 5 most important links
const MOBILE_NAV = [
  { label: 'Home',    href: '/',            icon: HomeIcon },
  { label: 'Matches', href: '/matches',     icon: MatchIcon },
  { label: 'Groups',  href: '/groups',      icon: GroupIcon },
  { label: 'Lock',    href: '/lock',        icon: LockIcon },
  { label: 'Board',   href: '/leaderboard', icon: BoardIcon },
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}
function MatchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 6l1.5 3h3l-2.5 2 1 3L10 12.5 7 14l1-3-2.5-2h3z" fill="currentColor" />
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

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
      {/* ── Top header ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: scrolled
            ? 'rgba(10,14,10,0.97)'
            : 'rgba(10,14,10,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(34,197,94,0.18)'
            : '1px solid rgba(34,197,94,0.1)',
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
                      color: active ? '#ffffff' : '#9CA3AF',
                      background: active ? 'rgba(34,197,94,0.12)' : 'transparent',
                      borderBottom: active ? '2px solid #22C55E' : '2px solid transparent',
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
                          background: '#22C55E',
                          flexShrink: 0,
                          boxShadow: '0 0 6px #22C55E',
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
            {/* Buy button — desktop */}
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
                background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 10px rgba(21,128,61,0.35)',
                transition: 'opacity 0.15s',
              }}
            >
              🚀 Buy $WCB
            </a>

            <WalletButtonDynamic className="hidden sm:inline-flex" />

            {/* Hamburger — mobile only */}
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
                background: menuOpen ? 'rgba(34,197,94,0.1)' : 'transparent',
                border: '1px solid',
                borderColor: menuOpen ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)',
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

      {/* ── Mobile full-screen menu ── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 35,
            background: 'rgba(8,12,8,0.98)',
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
                    color: active ? '#ffffff' : '#9CA3AF',
                    background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                    borderLeft: active ? '3px solid #22C55E' : '3px solid transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
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
                        background: '#22C55E',
                        boxShadow: '0 0 8px #22C55E',
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
                  background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(21,128,61,0.4)',
                }}
              >
                🚀 Buy $WCB on Pump.fun
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* ── Mobile bottom nav bar ── */}
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
        const IconComp = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item${active ? ' active' : ''}`}
            aria-label={item.label}
          >
            <IconComp />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
