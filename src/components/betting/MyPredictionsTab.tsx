'use client';

import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBets } from '@/lib/hooks/useBets';
import { TeamFlag } from '@/components/shared/TeamFlag';
import { useMatches } from '@/lib/hooks/useMatches';
import type { Bet } from '@/types/betting';
import type { PredictionChoice } from '@/lib/predictions';

function choiceLabel(choice: PredictionChoice): string {
  switch (choice) {
    case 'home': return 'Home';
    case 'draw': return 'Draw';
    case 'away': return 'Away';
  }
}

function statusBadge(status: Bet['status']) {
  const styles: Record<string, React.CSSProperties> = {
    pending: { background: 'rgba(242,181,68,0.12)', color: '#F2B544', border: '1px solid rgba(242,181,68,0.25)' },
    won:     { background: 'rgba(20,241,149,0.12)', color: '#14F195', border: '1px solid rgba(20,241,149,0.25)' },
    lost:    { background: 'rgba(239,68,68,0.12)',  color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' },
    cancelled:{ background: 'rgba(255,255,255,0.04)', color: '#6E6E6E', border: '1px solid rgba(255,255,255,0.08)' },
  };
  const labels: Record<string, string> = { pending: 'Active', won: 'Won', lost: 'Lost', cancelled: 'Cancelled' };
  return { style: styles[status], label: labels[status] };
}

function BetRow({ bet, matchName, teamCode }: { bet: Bet; matchName: string; teamCode: string }) {
  const badge = statusBadge(bet.status);
  const oddsNum = parseFloat(bet.odds) || 1;
  const potentialWin = Math.round(bet.amount * (oddsNum - 1));
  const isSettled = bet.status === 'won' || bet.status === 'lost';
  const profit = bet.status === 'won' ? potentialWin : bet.status === 'lost' ? -Math.round(bet.amount * 0.8) : 0;

  return (
    <div
      className="bet-row"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 12px',
        padding: '12px 14px',
      }}
    >
      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
        <TeamFlag code={teamCode} name={matchName} size="sm" />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {matchName}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.62rem', fontWeight: 700, color: '#6E6E6E' }}>
            {choiceLabel(bet.choice)} · {bet.odds} odds
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 900, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
            {bet.amount.toLocaleString()} $WCB
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.6rem', color: '#6E6E6E', fontWeight: 700 }}>
            {isSettled && bet.status === 'won' ? `+${potentialWin.toLocaleString()} win` : isSettled ? '20% refunded' : `To win ${potentialWin.toLocaleString()}`}
          </p>
        </div>

        {isSettled && (
          <p
            style={{
              margin: 0,
              fontSize: '0.82rem',
              fontWeight: 900,
              color: profit >= 0 ? '#14F195' : '#EF4444',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            {profit >= 0 ? '+' : ''}{profit.toLocaleString()} $WCB
          </p>
        )}

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 8px',
            borderRadius: 5,
            fontSize: '0.62rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            ...badge.style,
          }}
        >
          {badge.label}
        </span>
      </div>
    </div>
  );
}

export function MyPredictionsTab() {
  const { publicKey, connected } = useWallet();
  const wallet = publicKey ? publicKey.toBase58() : null;
  const { bets, loading } = useBets(wallet);
  const matchesQuery = useMatches({});
  const matches = matchesQuery.data ?? [];

  const matchMap = useMemo(() => {
    const map = new Map<number, typeof matches[0]>();
    for (const m of matches) map.set(m.id, m);
    return map;
  }, [matches]);

  const active = bets.filter((b) => b.status === 'pending');
  const settled = bets.filter((b) => b.status === 'won' || b.status === 'lost' || b.status === 'cancelled');

  const stats = useMemo(() => {
    const won = bets.filter((b) => b.status === 'won').length;
    const lost = bets.filter((b) => b.status === 'lost').length;
    const total = won + lost;
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
    const totalWagered = bets.reduce((s, b) => s + b.amount, 0);
    const totalProfit = bets.reduce((s, b) => {
      if (b.status === 'won') return s + Math.round(b.amount * (parseFloat(b.odds) - 1));
      if (b.status === 'lost') return s - Math.round(b.amount * 0.8);
      return s;
    }, 0);
    return { won, lost, total, winRate, totalWagered, totalProfit };
  }, [bets]);

  if (!connected) {
    return (
      <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#B3B3B3', margin: '0 0 16px' }}>
          Connect your wallet to view your bets and stats.
        </p>
      </div>
    );
  }

  if (loading && bets.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bet-card" style={{ padding: 14 }}>
            <div style={{ width: '60%', height: 12, borderRadius: 4, background: '#1A1A1A' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div className="stats-grid-4">
        <StatCard label="Total Bets" value={bets.length.toString()} />
        <StatCard label="Active" value={active.length.toString()} color="#F2B544" />
        <StatCard label="Win Rate" value={`${stats.winRate}%`} color={stats.winRate >= 50 ? '#14F195' : '#B3B3B3'} />
        <StatCard
          label="Net P&L"
          value={`${stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString()} $WCB`}
          color={stats.totalProfit >= 0 ? '#14F195' : '#EF4444'}
        />
      </div>

      {/* Active Bets */}
      {active.length > 0 && (
        <section>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F0FDF4', margin: 0 }}>Active Bets</h2>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {active.map((bet) => {
              const match = matchMap.get(bet.matchId);
              const name = match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : `Match #${bet.matchId}`;
              const code = match ? (bet.choice === 'home' ? match.homeTeam.code : bet.choice === 'away' ? match.awayTeam.code : 'WCB') : 'WCB';
              return <BetRow key={bet.id} bet={bet} matchName={name} teamCode={code} />;
            })}
          </div>
        </section>
      )}

      {/* Settled Bets */}
      {settled.length > 0 && (
        <section>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F0FDF4', margin: 0 }}>Settled Bets</h2>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {settled.map((bet) => {
              const match = matchMap.get(bet.matchId);
              const name = match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : `Match #${bet.matchId}`;
              const code = match ? (bet.choice === 'home' ? match.homeTeam.code : bet.choice === 'away' ? match.awayTeam.code : 'WCB') : 'WCB';
              return <BetRow key={bet.id} bet={bet} matchName={name} teamCode={code} />;
            })}
          </div>
        </section>
      )}

      {bets.length === 0 && (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#B3B3B3', margin: '0 0 6px' }}>No bets placed yet.</p>
          <p style={{ fontSize: '0.78rem', color: '#6E6E6E', margin: 0 }}>Head to the Live tab to place your first bet on World Cup 2026 matches.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = '#FFFFFF' }: { label: string; value: string; color?: string }) {
  return (
    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div
        style={{
          fontSize: '0.58rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#6E6E6E',
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
