/**
 * CreditRedemptionInfo — explains how credits work and how to redeem them.
 * Static informational component, no interactivity needed.
 */
export function CreditRedemptionInfo() {
  const steps = [
    {
      icon: '🔒',
      title: 'Lock $WCB',
      desc: 'Choose your amount and duration. Tokens are locked on-chain via Streamflow. No early withdrawal.',
    },
    {
      icon: '💳',
      title: 'Receive Credits',
      desc: 'Credits are instantly credited to your wallet. More tokens + longer lock = more credits.',
    },
    {
      icon: '⚽',
      title: 'Use Credits to Bet',
      desc: 'When the platform goes live on June 11, 2026, use credits as your betting capital on match predictions.',
    },
    {
      icon: '💰',
      title: 'Redeem Credits',
      desc: 'Unused credits can be redeemed back to $WCB at 100 $WCB per credit. Early stage only — this offer ends at launch.',
    },
  ];

  const creditTable = [
    { amount: '100K',  days: 30,  mult: '1.0x', credits: '1,000' },
    { amount: '100K',  days: 90,  mult: '2.0x', credits: '2,000' },
    { amount: '100K',  days: 180, mult: '3.0x', credits: '3,000' },
    { amount: '1M',    days: 30,  mult: '1.0x', credits: '10,000' },
    { amount: '1M',    days: 90,  mult: '2.0x', credits: '20,000' },
    { amount: '5M',    days: 365, mult: '5.0x', credits: '250,000' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* How it works */}
      <div className="card p-6">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
          How it works
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#DCFCE7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#15803D', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 900, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Credit rate table */}
      <div className="card overflow-hidden">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Credit Rate Examples
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
            Base rate: 1 credit per 100 $WCB · Redemption: 1 credit = 100 $WCB
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F0', borderBottom: '1px solid #E2E8F0' }}>
                {['Amount', 'Duration', 'Multiplier', 'Credits Earned'].map((h) => (
                  <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creditTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                    {row.amount} $WCB
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>
                    {row.days} days
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#D97706' }}>
                    {row.mult}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: '#15803D' }}>
                    {row.credits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important notes */}
      <div
        style={{
          borderRadius: 14,
          border: '1.5px solid #FDE68A',
          background: '#FFFBEB',
          padding: '1.25rem',
        }}
      >
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400E', marginBottom: '0.75rem' }}>
          ⚠️ Important Notes
        </h4>
        <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'No early withdrawal — tokens are locked until the chosen duration expires.',
            'Credits are wallet-bound and non-transferable.',
            'Credit redemption (1 credit → 1 $WCB) is only available during the early stage.',
            'This offer ends when the platform goes live on June 11, 2026.',
            'Locking is handled entirely on-chain via Streamflow Finance.',
          ].map((note, i) => (
            <li key={i} style={{ fontSize: '0.8rem', color: '#92400E', lineHeight: 1.5 }}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
