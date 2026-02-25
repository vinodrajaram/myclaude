import React from 'react';

export default function Returns({ returns }) {
  const kpis = [
    {
      label: 'Return on Equity',
      short: 'ROE',
      value: `${returns.roe}%`,
      good: returns.roe >= 12,
      accent: false,
    },
    {
      label: 'Risk-Adj. Return on Capital',
      short: 'RAROC',
      value: `${returns.raroc}%`,
      good: returns.raroc >= 15,
      accent: true,
    },
    {
      label: 'Revenue / Cost of Capital',
      short: 'Rev / COC',
      value: `${returns.revenueVsCoc}x`,
      good: returns.revenueVsCoc >= 2,
      warn: returns.revenueVsCoc >= 1,
      accent: false,
    },
  ];

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Risk-Adjusted Returns</span>
        <div className="section-rule" />
      </div>

      {/* KPI Row */}
      <div className="kpi-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 32 }}>
        {kpis.map(({ label, short, value, good, warn, accent }) => {
          const valueColor = good ? 'var(--green)' : warn ? 'var(--gold)' : 'var(--red)';
          return (
            <div key={short} style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderTop: accent ? `2px solid ${valueColor}` : '1px solid var(--border)',
              padding: '20px 22px',
            }}>
              <div className="kpi-label">{label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: valueColor,
                marginBottom: 6,
              }}>{value}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: good ? 'var(--green)' : warn ? 'var(--gold)' : 'var(--red)',
                opacity: 0.7,
              }}>
                {good ? 'Above hurdle' : warn ? 'At hurdle' : 'Below hurdle'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal P&L Table */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 12,
      }}>Deal-Level Returns</div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Deal</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Revenue</th>
            <th style={{ textAlign: 'right' }}>Cost</th>
            <th style={{ textAlign: 'right' }}>Margin</th>
            <th style={{ textAlign: 'right' }}>RAROC</th>
          </tr>
        </thead>
        <tbody>
          {returns.deals.map((deal, i) => {
            const margin = (((deal.revenue - deal.cost) / deal.revenue) * 100).toFixed(0);
            const rarocGood = deal.raroc >= 15;
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{deal.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{deal.type}</td>
                <td style={{ textAlign: 'right' }}>${deal.revenue}M</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>${deal.cost}M</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{margin}%</td>
                <td style={{ textAlign: 'right', color: rarocGood ? 'var(--green)' : 'var(--text-muted)', fontWeight: rarocGood ? 600 : 400 }}>
                  {deal.raroc}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
