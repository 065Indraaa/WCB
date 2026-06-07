'use client';

import { useMemo, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMatches } from '@/lib/hooks/useMatches';
import { useCreditBalance } from '@/lib/hooks/useCreditBalance';
import { useBets } from '@/lib/hooks/useBets';
import type { Match } from '@/types/match';
import { LiveTab } from './LiveTab';
import { BetSlip } from './BetSlip';
import { WalletButton } from '@/components/wallet/WalletButton';
import type { BetSelection } from './types';

function isMarketOpen(m: Match): boolean {
  return m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME' || m.displayStatus === 'UPCOMING';
}

export function BettingDashboard() {
  const { connected, publicKey } = useWallet();
  const wallet = connected && publicKey ? publicKey.toBase58() : null;
  const [selection, setSelection] = useState<BetSelection | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const matchesQuery = useMatches({});
  const marketMatches = useMemo(() => (matchesQuery.data ?? []).filter(isMarketOpen), [matchesQuery.data]);
  const liveCount = marketMatches.filter((m) => m.displayStatus === 'LIVE' || m.displayStatus === 'HALFTIME').length;

  const { balance, loading: balanceLoading } = useCreditBalance(wallet);
  const { bets, placeBet, placing } = useBets(wallet);
  const available = wallet ? balance?.availableCredits ?? null : null;

  // Prevent hydration mismatch by not rendering wallet-dependent UI until mounted
  if (!mounted) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ 
          marginBottom: 20,
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(242,181,68,0.05) 0%, rgba(7,7,7,0) 100%)',
          border: '1px solid rgba(242,181,68,0.12)',
          borderRadius: 12
        }}>
          <div style={{ width: 150, height: 20, borderRadius: 6, background: 'rgba(26,26,26,0.5)', marginBottom: 8 }} />
          <div style={{ width: 200, height: 14, borderRadius: 4, background: 'rgba(26,26,26,0.3)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {/* Compact Header */}
      <div style={{ 
        marginBottom: 20,
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(242,181,68,0.05) 0%, rgba(7,7,7,0) 100%)',
        border: '1px solid rgba(242,181,68,0.12)',
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,181,68,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            {/* Title Section */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div 
                  className={liveCount > 0 ? 'live-dot' : ''}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: liveCount > 0 ? '#EF4444' : '#6E6E6E',
                    boxShadow: liveCount > 0 ? '0 0 12px rgba(239,68,68,0.6)' : 'none'
                  }} 
                />
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  color: '#F2B544' 
                }}>
                  {liveCount > 0 ? 'LIVE NOW' : 'MARKETS'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
                Live Betting
              </h1>
            </div>
            
            {/* Compact Stats */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {liveCount > 0 && (
                <div style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.24)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{ fontSize: '1.1rem' }}>🔴</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#EF4444' }}>{liveCount}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>Live</span>
                </div>
              )}
              <div style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: 'rgba(242,181,68,0.1)',
                border: '1px solid rgba(242,181,68,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F2B544' }}>{marketMatches.length}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F2B544', textTransform: 'uppercase' }}>Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Banner - Simplified */}
      {!connected && (
        <div
          style={{
            marginBottom: 20,
            padding: '16px 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(242,181,68,0.08) 0%, rgba(242,181,68,0.02) 100%)',
            border: '1px solid rgba(242,181,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>
              🔐 Connect Wallet
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#B3B3B3', lineHeight: 1.5 }}>
              Start betting with $WCB credits
            </p>
          </div>
          <WalletButton />
        </div>
      )}

      {/* Balance - Compact for Connected Users */}
      {connected && (available ?? 0) > 0 && (
        <div style={{
          marginBottom: 20,
          padding: '14px 18px',
          borderRadius: 10,
          background: 'linear-gradient(90deg, rgba(20,241,149,0.08) 0%, rgba(242,181,68,0.08) 100%)',
          border: '1px solid rgba(20,241,149,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>💰</span>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E', margin: 0 }}>
                Credits
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 900, color: '#14F195', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {balanceLoading ? '...' : available?.toLocaleString() ?? '0'} $WCB
              </p>
            </div>
          </div>
          {bets && bets.length > 0 && (
            <div style={{
              padding: '4px 12px',
              borderRadius: 6,
              background: 'rgba(242,181,68,0.12)',
              border: '1px solid rgba(242,181,68,0.24)',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#F2B544'
            }}>
              {bets.length} Active Bet{bets.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Main Content - Clean Container */}
      <div style={{ 
        background: 'rgba(11,11,11,0.3)',
        border: '1px solid rgba(42,42,42,0.5)',
        borderRadius: 12,
        padding: '20px',
        minHeight: '400px'
      }}>
        <LiveTab
          liveMatches={marketMatches}
          loading={matchesQuery.isLoading}
          onSelect={connected ? setSelection : () => {}}
          selectedMatchId={selection?.match.id ?? null}
          selectedChoice={selection?.choice ?? null}
          onGoToSchedule={() => {}}
        />
      </div>

      <BetSlip
        selection={selection}
        onClose={() => setSelection(null)}
        walletConnected={!!wallet}
        available={available}
        balanceLoading={balanceLoading}
        placeBet={placeBet}
        placing={placing}
      />
    </div>
  );
}
