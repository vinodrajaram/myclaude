import React from 'react';

const statusColor = (s) =>
  s === 'Active' ? 'var(--green)' : s === 'Watch' ? 'var(--gold)' : 'var(--text-muted)';

export default function LendingExposure({ lending }) {
  const util = ((lending.drawn / lending.committed) * 100).toFixed(0);
  const utilHigh = parseInt(util) > 85;
  const maxMat = Math.max(...lending.maturitySchedule.map((m) => m.amount));

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Lending Exposure</span>
        <div className="section-rule" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 600,
          padding: '3px 9px',
          border: '1px solid var(--border-bright)',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          flexShrink: 0,
        }}>
          {lending.riskRating}
        </span>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'Committed', value: `$${lending.committed}M`, sub: null, accent: false },
          { label: 'Drawn', value: `$${lending.drawn}M`, sub: `${util}% utilized`, accent: true },
          { label: 'Undrawn', value: `$${lending.undrawn}M`, sub: null, accent: false },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderTop: accent ? `2px solid ${utilHigh ? 'var(--red)' : 'var(--gold)'}` : '1px solid var(--border)',
            padding: '20px 22px',
          }}>
            <div className="kpi-label">{label}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: accent ? (utilHigh ? 'var(--red)' : 'var(--gold)') : 'var(--text)',
              marginBottom: sub ? 6 : 0,
            }}>{value}</div>
            {sub && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: utilHigh ? 'var(--red)' : 'var(--text-muted)',
              }}>{sub}</div>
            )}
          </div>
        ))}
      </div>

      {/* Utilization bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            UTILIZATION
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: utilHigh ? 'var(--red)' : 'var(--text-muted)' }}>
            {util}%
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--surface-3)', position: 'relative' }}>
          <div style={{
            height: '100%',
            width: `${util}%`,
            background: utilHigh ? 'var(--red)' : 'var(--gold)',
            opacity: 0.85,
            transition: 'width 500ms ease',
          }} />
        </div>
      </div>

      {/* Two columns: Facilities table | Maturity schedule */}
      <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32 }}>
        {/* Facility Table */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 12,
          }}>Facilities</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Maturity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lending.facilities.map((f, i) => (
                <tr key={i}>
                  <td>{f.type}</td>
                  <td style={{ textAlign: 'right' }}>${f.amount}M</td>
                  <td style={{ color: 'var(--text-muted)' }}>{f.maturity}</td>
                  <td>
                    <span style={{ color: statusColor(f.status), fontWeight: 500 }}>{f.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maturity Bar Chart */}
        {maxMat > 0 && (
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: 12,
            }}>Maturity Schedule</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72 }}>
              {lending.maturitySchedule.map((m) => {
                const h = maxMat > 0 ? (m.amount / maxMat) * 100 : 0;
                return (
                  <div key={m.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    {m.amount > 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        ${m.amount}M
                      </div>
                    )}
                    <div style={{
                      width: '100%',
                      height: m.amount > 0 ? `${Math.max(h, 10)}%` : '8%',
                      background: m.amount > 0 ? 'var(--gold)' : 'var(--surface-3)',
                      opacity: m.amount > 0 ? 0.75 : 0.4,
                    }} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
                      {m.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
