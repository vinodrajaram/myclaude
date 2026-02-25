import React from 'react';

export default function LeadershipChanges({ leadershipChanges }) {
  const hasAction = leadershipChanges.some((l) => l.actionRequired);

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Leadership Changes</span>
        <div className="section-rule" />
        {hasAction && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 600,
            padding: '3px 10px',
            border: '1px solid var(--red)',
            color: 'var(--red)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>
            ⚑ Action Required
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {leadershipChanges.map((change, i) => (
          <div key={i} style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${change.actionRequired ? 'var(--red)' : 'var(--border-bright)'}`,
            padding: '20px 22px',
          }}>
            {/* Person + date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
                lineHeight: 1,
              }}>
                {change.person}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {change.date}
                </span>
                {change.actionRequired && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 600,
                    padding: '2px 7px',
                    border: '1px solid var(--red)',
                    color: 'var(--red)',
                    letterSpacing: '0.08em',
                  }}>ACTION</span>
                )}
              </div>
            </div>

            {/* Role transition */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                padding: '3px 8px',
                border: '1px solid var(--border)',
                background: 'var(--surface-3)',
              }}>{change.oldRole}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>→</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text)',
                padding: '3px 8px',
                border: `1px solid ${change.actionRequired ? 'var(--red)' : 'var(--border-bright)'}`,
              }}>{change.newRole}</span>
            </div>

            {/* Significance */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 400,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}>
              {change.significance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
