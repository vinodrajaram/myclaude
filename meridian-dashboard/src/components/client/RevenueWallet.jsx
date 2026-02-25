import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface-3)',
      border: '1px solid var(--border-bright)',
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gold)' }}>${payload[0].value}M</div>
    </div>
  );
};

export default function RevenueWallet({ revenue }) {
  const maxBreakdown = Math.max(...revenue.breakdown.map((b) => b.amount));
  const totalBreakdown = revenue.breakdown.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Revenue &amp; Wallet Share</span>
        <div className="section-rule" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          flexShrink: 0,
        }}>LTM</span>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 32 }}>
        {/* YTD */}
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
          borderTop: '2px solid var(--gold)',
        }}>
          <div className="kpi-label">YTD Revenue</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--gold)',
            letterSpacing: '-0.02em',
          }}>${revenue.ytd}M</div>
        </div>

        {/* LTM */}
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
        }}>
          <div className="kpi-label">LTM Revenue</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>${revenue.ltm}M</div>
        </div>

        {/* Wallet Share */}
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          padding: '20px 22px',
        }}>
          <div className="kpi-label">Wallet Share</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>{revenue.walletShare}%</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 500,
              color: revenue.walletTrendDir === 'up' ? 'var(--green)' : 'var(--red)',
            }}>
              {revenue.walletTrendDir === 'up' ? '↑' : '↓'} {revenue.walletTrend}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout: chart left, breakdown right */}
      <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* Area Chart */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}>12-Month Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenue.trend} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
              <XAxis
                dataKey="month"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-bright)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--gold)"
                strokeWidth={1.5}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 3, fill: 'var(--gold)', stroke: 'var(--surface)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}>Revenue by Product</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {revenue.breakdown.map((item, i) => {
              const pct = (item.amount / maxBreakdown) * 100;
              const sharePct = ((item.amount / totalBreakdown) * 100).toFixed(0);
              return (
                <div key={item.product}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}>{item.product}</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-dim)',
                      }}>{sharePct}%</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--text)',
                        minWidth: 48,
                        textAlign: 'right',
                      }}>${item.amount}M</span>
                    </div>
                  </div>
                  <div style={{ height: 3, background: 'var(--surface-3)', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${pct}%`,
                      background: i === 0 ? 'var(--gold)' : 'var(--border-bright)',
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
