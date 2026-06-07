'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How do betting credits work?',
    a: 'Credits are derived from your locked $WCB tokens. The longer you lock, the more credits you earn. One credit equals one $WCB bet unit. Lock before June 11, 2026 for the early rate of 100 $WCB per credit.',
  },
  {
    q: 'How do I place a bet?',
    a: 'Connect your Solana wallet, navigate to the Live tab, select a match, click on the odds for your predicted outcome (Home, Draw, or Away), enter your bet amount, and confirm.',
  },
  {
    q: 'What happens if I lose a bet?',
    a: 'You receive a 20% refund on losing bets automatically. The remaining 80% goes to the prize pool distributed to winning bettors.',
  },
  {
    q: 'When does live betting open?',
    a: 'Full live betting with real-time odds opens on June 11, 2026. Pre-launch market previews are available now so you can browse fixtures and plan your strategy.',
  },
  {
    q: 'Which wallets are supported?',
    a: 'Any Solana wallet that supports the Wallet Standard: Phantom, Solflare, Backpack, Glow, and others.',
  },
  {
    q: 'Is there a minimum or maximum bet?',
    a: 'Minimum bet is 10 credits. Maximum bet is capped at your available credit balance.',
  },
  {
    q: 'How are odds calculated?',
    a: 'Odds are dynamically calculated based on community prediction sentiment, FIFA rankings, and historical match data. They update in real-time as more users place predictions.',
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid #21262D',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 4px',
          background: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          fontSize: '0.88rem',
          fontWeight: 800,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {item.q}
        <span
          style={{
            fontSize: '0.75rem',
            color: '#F2B544',
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <p
          style={{
            margin: '0 0 14px',
            fontSize: '0.82rem',
            color: '#B3B3B3',
            lineHeight: 1.65,
            paddingRight: 24,
          }}
        >
          {item.a}
        </p>
      )}
    </div>
  );
}

export function SupportTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* FAQ */}
      <section>
        <div className="section-header" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F0FDF4', margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="card" style={{ padding: '4px 16px 0' }}>
          {FAQS.map((f) => (
            <FaqAccordion key={f.q} item={f} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <div className="section-header" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F0FDF4', margin: 0 }}>Quick Links</h2>
        </div>
        <div className="stats-grid-3">
          <Link href="/lock" className="card card-hover" style={{ padding: '1.1rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🔒</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>Lock & Earn</div>
            <div style={{ fontSize: '0.6rem', color: '#6E6E6E', marginTop: 2 }}>Activate credits</div>
          </Link>
          <Link href="/leaderboard" className="card card-hover" style={{ padding: '1.1rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>Leaderboard</div>
            <div style={{ fontSize: '0.6rem', color: '#6E6E6E', marginTop: 2 }}>Top bettors</div>
          </Link>
          <Link href="/docs" className="card card-hover" style={{ padding: '1.1rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>📖</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>Documentation</div>
            <div style={{ fontSize: '0.6rem', color: '#6E6E6E', marginTop: 2 }}>How it works</div>
          </Link>
        </div>
      </section>

      {/* Info */}
      <section>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6E6E6E', margin: '0 0 8px' }}>
            Transparency
          </p>
          <p style={{ fontSize: '0.82rem', color: '#B3B3B3', lineHeight: 1.65, margin: 0 }}>
            All bets are stored on-chain and settled automatically when match results are finalized.
            Lock records are read directly from Streamflow Finance contracts. Prize pools are
            distributed transparently via smart contracts.
          </p>
        </div>
      </section>
    </div>
  );
}
