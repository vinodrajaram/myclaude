import React from 'react';

const daysAgo = (dateStr) => {
  const diff = Math.round((new Date('2026-02-24') - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

const ACTIONS = ['Schedule Call', 'New Pitch', 'Log Interaction'];

export default function ClientHeader({ client }) {
  const { profile, aiBrief } = client;

  const tierColor =
    profile.tier === 1 ? 'var(--gold)' :
    profile.tier === 2 ? 'var(--blue)' : 'var(--text-muted)';

  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '36px 40px 32px',
    }}>
      {/* Breadcrumb row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {profile.sector}
        </span>
        <span style={{ color: 'var(--border-bright)', fontSize: 14, lineHeight: 1 }}>›</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
        }}>
          {profile.hq}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 600,
            padding: '3px 8px',
            border: `1px solid ${tierColor}`,
            color: tierColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Tier {profile.tier}
          </span>
          {profile.public && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              padding: '3px 8px',
              border: '1px solid var(--border-bright)',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>
              {profile.ticker}
            </span>
          )}
        </div>
      </div>

      {/* Company name */}
      <h1 className="client-h1" style={{
        fontFamily: 'var(--font-display)',
        fontSize: 38,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.025em',
        color: 'var(--text)',
        marginBottom: 24,
      }}>
        {profile.name}
      </h1>

      {/* AI Brief */}
      <div style={{
        background: 'var(--gold-dim)',
        borderLeft: '2px solid var(--gold)',
        padding: '14px 20px',
        marginBottom: 28,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: 8,
        }}>
          <span>✦</span> AI Brief
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          fontWeight: 400,
        }}>
          {aiBrief}
        </p>
      </div>

      {/* Coverage meta + action buttons */}
      <div className="header-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 36 }}>
          {[
            { label: 'Coverage Banker', value: profile.coverageBanker },
            { label: 'Last Interaction', value: daysAgo(profile.lastInteraction) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 5,
              }}>{label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text)',
                fontWeight: 500,
              }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: 8 }}>
          {ACTIONS.map((label, i) => (
            <button
              key={label}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.02em',
                padding: '8px 16px',
                border: `1px solid ${i === 0 ? 'var(--gold)' : 'var(--border-bright)'}`,
                background: i === 0 ? 'var(--gold-dim)' : 'transparent',
                color: i === 0 ? 'var(--gold)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
                e.currentTarget.style.background = 'var(--gold-dim)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = i === 0 ? 'var(--gold)' : 'var(--border-bright)';
                e.currentTarget.style.color = i === 0 ? 'var(--gold)' : 'var(--text-muted)';
                e.currentTarget.style.background = i === 0 ? 'var(--gold-dim)' : 'transparent';
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
