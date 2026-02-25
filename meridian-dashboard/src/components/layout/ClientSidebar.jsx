import React, { useState } from 'react';
import { clients } from '../../data/clients.js';

const tierFilters = ['All', 'Tier 1', 'Tier 2', 'Tier 3'];

const tierAccent = (tier) =>
  tier === 1 ? 'var(--gold)' : tier === 2 ? 'var(--blue)' : 'var(--text-dim)';

const logoColors = [
  { bg: '#1a1f2e', border: '#C9A84C', text: '#C9A84C' },
  { bg: '#1a1f2e', border: '#4a7fc1', text: '#4a7fc1' },
  { bg: '#1a1f2e', border: '#5a9e74', text: '#5a9e74' },
  { bg: '#1a1f2e', border: '#9e5a8a', text: '#9e5a8a' },
  { bg: '#1a1f2e', border: '#c17a4a', text: '#c17a4a' },
];

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function ClientLogo({ name, index, size = 36 }) {
  const palette = logoColors[index % logoColors.length];
  return (
    <div style={{
      width: size,
      height: size,
      flexShrink: 0,
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: size * 0.3,
      fontWeight: 700,
      color: palette.text,
      letterSpacing: '0.04em',
    }}>
      {getInitials(name)}
    </div>
  );
}

export default function ClientSidebar({ selectedId, onSelect, selectedClient, mobile }) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.profile.name.toLowerCase().includes(search.toLowerCase()) ||
      c.profile.sector.toLowerCase().includes(search.toLowerCase());
    const matchTier =
      tierFilter === 'All' || tierFilter === `Tier ${c.profile.tier}`;
    return matchSearch && matchTier;
  });

  const maxLtm = Math.max(...clients.map((c) => c.revenue.ltm));

  return (
    <aside style={{
      width: mobile ? '100%' : 320,
      height: mobile ? '100%' : undefined,
      flexShrink: 0,
      background: 'var(--surface)',
      borderRight: mobile ? 'none' : '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}>My Book</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}>{clients.length}</span>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          padding: '7px 11px',
          marginBottom: 10,
          transition: 'border-color 150ms',
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="var(--text-dim)" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="square"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            style={{ flex: 1, fontSize: 13 }}
          />
        </div>

        {/* Tier Filter */}
        <div style={{ display: 'flex', gap: 3 }}>
          {tierFilters.map((t) => {
            const active = tierFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '6px 0',
                  border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                  background: active ? 'var(--gold-dim)' : 'transparent',
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {t === 'All' ? 'All' : t.replace('Tier ', 'T')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Client List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((client) => {
          const isActive = client.id === selectedId;
          const ltmPct = (client.revenue.ltm / maxLtm) * 100;

          return (
            <div
              key={client.id}
              onClick={() => onSelect(client.id)}
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                background: isActive ? 'var(--surface-2)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                transition: 'background 120ms, border-color 120ms',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--surface-2)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Logo + name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <ClientLogo name={client.profile.name} index={clients.indexOf(client)} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      flex: 1,
                      paddingRight: 6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {client.profile.name}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      fontWeight: 500,
                      padding: '2px 6px',
                      border: `1px solid ${tierAccent(client.profile.tier)}`,
                      color: tierAccent(client.profile.tier),
                      letterSpacing: '0.08em',
                      flexShrink: 0,
                    }}>
                      T{client.profile.tier}
                    </span>
                  </div>
                  {/* Sector */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.02em',
                    marginTop: 2,
                  }}>
                    {client.profile.sector} · {client.profile.hq.split(',')[0]}
                  </div>
                </div>
              </div>

              {/* LTM Revenue + mini bar (collapsed view) */}
              {!isActive && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>LTM</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                      ${client.revenue.ltm}M
                    </span>
                  </div>
                  <div style={{ height: 2, background: 'var(--border)', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${ltmPct}%`,
                      background: 'var(--border-bright)',
                      transition: 'width 300ms',
                    }} />
                  </div>
                </>
              )}

              {/* Wallet KPIs — expanded for active tile */}
              {isActive && (
                <div style={{ marginTop: 2 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 8 }}>
                    {[
                      { label: 'YTD', value: `$${client.revenue.ytd}M`, highlight: true },
                      { label: 'LTM', value: `$${client.revenue.ltm}M`, highlight: false },
                      {
                        label: 'Wallet',
                        value: `${client.revenue.walletShare}%`,
                        sub: client.revenue.walletTrend,
                        subDir: client.revenue.walletTrendDir,
                      },
                    ].map(({ label, value, sub, subDir, highlight }) => (
                      <div key={label} style={{
                        background: 'var(--bg)',
                        border: `1px solid ${highlight ? 'var(--gold)' : 'var(--border)'}`,
                        borderTop: `2px solid ${highlight ? 'var(--gold)' : 'var(--border)'}`,
                        padding: '7px 8px',
                      }}>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--text-dim)',
                          marginBottom: 3,
                        }}>{label}</div>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 14,
                          fontWeight: 700,
                          color: highlight ? 'var(--gold)' : 'var(--text)',
                          lineHeight: 1,
                          letterSpacing: '-0.01em',
                        }}>{value}</div>
                        {sub && (
                          <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 9,
                            color: subDir === 'up' ? 'var(--green)' : 'var(--red)',
                            marginTop: 2,
                          }}>
                            {subDir === 'up' ? '↑' : '↓'} {sub.replace(/[+\-]/, '')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Top product bar */}
                  {client.revenue.breakdown?.length > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                          {client.revenue.breakdown[0].product}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text)' }}>
                          ${client.revenue.breakdown[0].amount}M
                        </span>
                      </div>
                      <div style={{ height: 2, background: 'var(--border)', position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 0, height: '100%',
                          width: `${(client.revenue.breakdown[0].amount / client.revenue.ltm) * 100}%`,
                          background: 'var(--gold)',
                        }} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            padding: 32,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            textAlign: 'center',
          }}>
            No clients match
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          {filtered.length} clients
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          FY2026
        </span>
      </div>
    </aside>
  );
}
