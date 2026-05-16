export function TokenPriceWidget() {
  const rows = [
    { label: 'Price', value: 'Coming Soon' },
    { label: '24h', value: 'Paused' },
    { label: 'Holders', value: 'Paused' },
    { label: 'Mkt Cap', value: 'Paused' },
  ];

  return (
    <div className="bet-card" style={{ padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B7280' }}>$WCB Token</span>
        <span className="badge badge-upcoming" style={{ fontSize: '0.58rem' }}>SOON</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        {rows.map((s) => (
          <div key={s.label} style={{ padding: '8px', background: '#111111', borderRadius: 6, border: '1px solid #2A2A2A' }}>
            <div style={{ fontSize: '0.56rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E6E6E' }}>{s.label}</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div
        className="btn-primary"
        style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', cursor: 'default', opacity: 0.82 }}
      >
        Token Coming Soon
      </div>
    </div>
  );
}
