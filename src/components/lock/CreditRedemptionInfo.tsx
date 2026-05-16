import {
  EARLY_TOKENS_PER_CREDIT,
  FIXED_LOCK_DAYS,
  LOCK_LAUNCH_TIMESTAMP,
  POST_LAUNCH_TOKENS_PER_CREDIT,
} from '@/lib/lock';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatLaunchDate() {
  const d = new Date(LOCK_LAUNCH_TIMESTAMP * 1000);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function CreditRedemptionInfo() {
  const steps = [
    {
      code: '01',
      title: 'Lock $WCB',
      desc: `Lock for a fixed ${FIXED_LOCK_DAYS} days through Streamflow. The lock is read from real on-chain Streamflow data.`,
    },
    {
      code: '02',
      title: 'Receive Credits',
      desc: `Before launch: ${EARLY_TOKENS_PER_CREDIT} $WCB locked = 1 credit. After launch: ${POST_LAUNCH_TOKENS_PER_CREDIT} $WCB locked = 1 credit.`,
    },
    {
      code: '03',
      title: 'Use Credits',
      desc: 'Credits are wallet-bound platform credits for entries, access, leaderboard ranking, and the coming redeem/withdraw flow.',
    },
    {
      code: '04',
      title: 'Redeem / Withdraw Coming Soon',
      desc: 'Credit redeem/withdraw is planned, but it is not active yet. WCB will publish exact rules before enabling it.',
    },
  ];

  const creditTable = [
    { amount: '100', early: '1', post: '0' },
    { amount: '1K', early: '10', post: '5' },
    { amount: '10K', early: '100', post: '50' },
    { amount: '100K', early: '1,000', post: '500' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card p-6">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1.25rem' }}>
          How it works
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {steps.map((s, i) => (
            <div key={s.code} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(242,181,68,0.12)',
                    border: '1px solid rgba(242,181,68,0.28)',
                    color: '#FFD36B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 900, flexShrink: 0,
                  }}
                >
                  {s.code}
                </div>
                <div
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#F2B544', color: '#070707',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 900, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#B3B3B3', margin: 0, lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #2A2A2A', background: '#111111' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Credit Rate
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#B3B3B3', marginTop: '0.25rem' }}>
            Early locks before {formatLaunchDate()} receive double the post-launch credit rate.
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#111111', borderBottom: '1px solid #2A2A2A' }}>
                {['Locked Amount', 'Before Launch', 'After Launch'].map((h) => (
                  <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E6E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creditTable.map((row) => (
                <tr key={row.amount} style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {row.amount} $WCB
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: '#FFD36B' }}>
                    {row.early} credits
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#B3B3B3' }}>
                    {row.post} credits
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          borderRadius: 14,
          border: '1px solid rgba(242,181,68,0.28)',
          background: 'rgba(242,181,68,0.08)',
          padding: '1.25rem',
        }}
      >
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFD36B', marginBottom: '0.75rem' }}>
          Important Notes
        </h4>
        <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            `All new lock flows use a fixed ${FIXED_LOCK_DAYS}-day duration.`,
            'Lock data is sourced from Streamflow records, not local mock data.',
            'Credits remain wallet-bound until redeem/withdraw rules are enabled.',
            'Credit redeem/withdraw is coming soon and not active yet.',
            'Creator fee is the only funding source for WCB reward pool distributions.',
          ].map((note) => (
            <li key={note} style={{ fontSize: '0.8rem', color: '#B3B3B3', lineHeight: 1.5 }}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
