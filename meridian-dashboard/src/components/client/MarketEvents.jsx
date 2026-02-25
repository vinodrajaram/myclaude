import React from 'react';

const impactConfig = {
  positive: { color: 'var(--green)', label: '↑ Positive' },
  negative: { color: 'var(--red)',   label: '↓ Negative' },
  neutral:  { color: 'var(--text-muted)', label: '— Neutral' },
};

export default function MarketEvents({ marketEvents }) {
  const { stockPrice, stockChangePct, analystConsensus, events } = marketEvents;
  const isUp = stockChangePct > 0;

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Market &amp; Events</span>
        <div className="section-rule" />
        {/* Stock widget */}
        {stockPrice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text)',
                lineHeight: 1,
                marginBottom: 2,
              }}>
                ${stockPrice.toFixed(2)}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: isUp ? 'var(--green)' : 'var(--red)',
              }}>
                {isUp ? '+' : ''}{stockChangePct.toFixed(2)}%
              </div>
            </div>
            {analystConsensus && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                padding: '4px 10px',
                border: '1px solid var(--border-bright)',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {analystConsensus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Events Timeline */}
      <div>
        {events.map((event, i) => {
          const cfg = impactConfig[event.impact] || impactConfig.neutral;
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '88px 1fr',
              gap: 20,
              padding: '16px 0',
              borderBottom: i < events.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {/* Date + source */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}>
                  {event.date.substring(5)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-dim)',
                  letterSpacing: '0.04em',
                }}>
                  {event.source}
                </div>
              </div>

              {/* Headline + impact */}
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 400,
                  color: 'var(--text)',
                  lineHeight: 1.55,
                  marginBottom: 8,
                }}>
                  {event.headline}
                </p>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 600,
                  color: cfg.color,
                  letterSpacing: '0.08em',
                }}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
