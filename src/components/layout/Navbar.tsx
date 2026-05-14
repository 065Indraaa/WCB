'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { WalletButton } from '@/components/wallet/WalletButton';

const NAV_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Matches',     href: '/matches' },
  { label: 'Groups',      href: '/groups' },
  { label: 'Bracket',     href: '/bracket' },
  { label: 'Token',       href: '/token' },
  { label: 'Lock & Earn', href: '/lock' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(250,251,248,0.5)',
          backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'blur(8px)',
          borderBottomColor: scrolled ? 'rgba(226,232,240,1)' : 'rgba(226,232,240,0)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
        }}
        transition={{ duration: 0.2 }}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="WORLDCUPBET home"
            style={{ textDecoration: 'none' }}
          >
            <BrandLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={
                      active
                        ? { color: '#15803D', background: '#DCFCE7', textDecoration: 'none' }
                        : { color: '#334155', textDecoration: 'none' }
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <WalletButton className="hidden sm:inline-flex" />

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.span
                className="block rounded-full"
                style={{ height: 2, width: 20, background: '#0F172A' }}
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block rounded-full"
                style={{ height: 2, width: 20, background: '#0F172A' }}
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block rounded-full"
                style={{ height: 2, width: 20, background: '#0F172A' }}
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <motion.div
        className="fixed inset-0 z-30 lg:hidden"
        style={{ background: '#FAFBF8' }}
        initial={false}
        animate={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Spacer for fixed header */}
        <div style={{ height: 64 }} aria-hidden="true" />

        <nav
          className="flex flex-col items-stretch gap-1 px-6 pt-6"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link, i) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: menuOpen ? i * 0.04 : 0, duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="block px-4 py-4 rounded-xl text-lg font-semibold transition-colors"
                  style={
                    active
                      ? { background: '#DCFCE7', color: '#15803D', textDecoration: 'none' }
                      : { color: '#0F172A', textDecoration: 'none' }
                  }
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: menuOpen ? NAV_LINKS.length * 0.04 : 0, duration: 0.2 }}
            className="mt-4"
          >
            <a
              href={process.env.NEXT_PUBLIC_PUMPFUN_URL ?? 'https://pump.fun'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              🚀 Buy $WCB on Pump.fun
            </a>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
}
