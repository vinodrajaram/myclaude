import React from 'react';

export default function Topbar({ aiPanelOpen, onToggleAI, theme, onToggleTheme, isMobile }) {
  const isDark = theme === 'dark';

  return (
    <header style={{
      height: 48,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}>
            Meridian
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--gold)',
            opacity: 0.8,
          }}>✦</span>
        </div>
        <div style={{
          width: 1,
          height: 16,
          background: 'var(--border-bright)',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}>
          Client Intelligence
        </span>
      </div>

      {/* Search — hidden on mobile */}
      {!isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          padding: '6px 13px',
          width: 260,
          transition: 'border-color 150ms',
        }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-bright)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="var(--text-dim)" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <input
            type="text"
            placeholder="Search clients, deals, events…"
            style={{ flex: 1, fontSize: 11 }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>⌘K</span>
        </div>
      )}

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Alerts */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '4px 6px' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.79 2 4 3.79 4 6v4l-1.5 2h11L12 10V6c0-2.21-1.79-4-4-4z" stroke="var(--text-muted)" strokeWidth="1.2" />
            <path d="M6.5 14c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="var(--text-muted)" strokeWidth="1.2" />
          </svg>
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 13, height: 13,
            background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 7, fontWeight: 700,
            color: 'white',
          }}>3</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'var(--border-bright)' }} />

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Light mode' : 'Dark mode'}
          style={{
            width: 30,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-bright)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {isDark ? '☀' : '◑'}
        </button>

        {/* AI toggle */}
        <button
          onClick={onToggleAI}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.01em',
            padding: '5px 12px',
            border: `1px solid ${aiPanelOpen ? 'var(--gold)' : 'var(--border-bright)'}`,
            background: aiPanelOpen ? 'var(--gold-dim)' : 'transparent',
            color: aiPanelOpen ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer',
            height: 28,
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            if (!aiPanelOpen) { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text)'; }
          }}
          onMouseLeave={(e) => {
            if (!aiPanelOpen) { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-muted)'; }
          }}
        >
          <span style={{ fontSize: 10, color: 'var(--gold)' }}>✦</span>
          Meridian AI
        </button>

        {/* Avatar */}
        <div style={{
          width: 28,
          height: 28,
          background: 'var(--surface-2)',
          border: '1px solid var(--border-bright)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)',
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}>
          JW
        </div>
      </div>
    </header>
  );
}
