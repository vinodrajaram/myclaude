import React from 'react';

const stageConfig = {
  Pitching:  { color: 'var(--text-muted)',  border: 'var(--border-bright)', order: 3 },
  Diligence: { color: 'var(--blue)',         border: 'var(--blue)',          order: 2 },
  Mandate:   { color: 'var(--gold)',         border: 'var(--gold)',          order: 1 },
  Closing:   { color: 'var(--green)',        border: 'var(--green)',         order: 0 },
};

export default function DealPipeline({ dealPipeline }) {
  const sorted = [...dealPipeline].sort(
    (a, b) => (stageConfig[a.stage]?.order ?? 4) - (stageConfig[b.stage]?.order ?? 4)
  );

  const totalByStage = Object.keys(stageConfig).map((stage) => {
    const deals = sorted.filter((d) => d.stage === stage);
    return { stage, total: deals.reduce((s, d) => s + d.size, 0), count: deals.length };
  });

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Deal Pipeline</span>
        <div className="section-rule" />
      </div>

      {/* Stage summary row */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid var(--border)' }}>
        {totalByStage.map(({ stage, total, count }, i) => {
          const cfg = stageConfig[stage];
          return (
            <div key={stage} style={{
              flex: 1,
              padding: '14px 18px',
              borderRight: i < totalByStage.length - 1 ? '1px solid var(--border)' : 'none',
              borderTop: `2px solid ${count > 0 ? cfg.border : 'var(--border)'}`,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: count > 0 ? cfg.color : 'var(--text-dim)',
                marginBottom: 6,
              }}>{stage}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 700,
                color: count > 0 ? cfg.color : 'var(--text-dim)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                marginBottom: 2,
              }}>
                {total > 0 ? `$${total}M` : '—'}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-dim)',
              }}>
                {count} deal{count !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deals Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Deal</th>
            <th>Product</th>
            <th style={{ textAlign: 'right' }}>Size</th>
            <th>Stage</th>
            <th>Expected Close</th>
            <th>Banker</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((deal, i) => {
            const cfg = stageConfig[deal.stage] || stageConfig.Pitching;
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{deal.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{deal.product}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>${deal.size}M</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 600,
                    padding: '3px 8px',
                    border: `1px solid ${cfg.border}`,
                    color: cfg.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {deal.stage}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{deal.expectedClose}</td>
                <td style={{ color: 'var(--text-muted)' }}>{deal.banker}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
