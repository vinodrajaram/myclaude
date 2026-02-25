import React, { useState, useEffect } from 'react';
import Topbar from './components/layout/Topbar.jsx';
import ClientSidebar from './components/layout/ClientSidebar.jsx';
import AIChatPanel from './components/layout/AIChatPanel.jsx';
import ClientHeader from './components/client/ClientHeader.jsx';
import RevenueWallet from './components/client/RevenueWallet.jsx';
import LendingExposure from './components/client/LendingExposure.jsx';
import Returns from './components/client/Returns.jsx';
import MarketEvents from './components/client/MarketEvents.jsx';
import LeadershipChanges from './components/client/LeadershipChanges.jsx';
import DealPipeline from './components/client/DealPipeline.jsx';
import { clients } from './data/clients.js';

export default function App() {
  const [selectedId, setSelectedId] = useState(clients[0].id);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail' | 'ai'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const client = clients.find((c) => c.id === selectedId) || clients[0];

  const handleSelect = (id) => {
    setSelectedId(id);
    if (isMobile) setMobileView('detail');
  };

  const mainContent = (
    <>
      <ClientHeader client={client} />
      <RevenueWallet revenue={client.revenue} />
      <LendingExposure lending={client.lending} />
      <Returns returns={client.returns} />
      <MarketEvents marketEvents={client.marketEvents} />
      <LeadershipChanges leadershipChanges={client.leadershipChanges} />
      <DealPipeline dealPipeline={client.dealPipeline} />
      <div style={{ height: isMobile ? 80 : 48 }} />
    </>
  );

  const toggleTheme = () => setTheme((t) => t === 'dark' ? 'light' : 'dark');

  if (isMobile) {
    const tabs = [
      { id: 'list', symbol: '≡', label: 'Clients' },
      { id: 'detail', symbol: client.profile.name.split(' ')[0], label: 'Detail', isName: true },
      { id: 'ai', symbol: '✦', label: 'AI' },
    ];

    return (
      <div className="app-shell">
        <Topbar
          aiPanelOpen={mobileView === 'ai'}
          onToggleAI={() => setMobileView((v) => v === 'ai' ? 'detail' : 'ai')}
          theme={theme}
          onToggleTheme={toggleTheme}
          isMobile
        />

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {mobileView === 'list' && (
            <ClientSidebar
              selectedId={selectedId}
              onSelect={handleSelect}
              selectedClient={client}
              mobile
            />
          )}
          {mobileView === 'detail' && (
            <main style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
              {mainContent}
            </main>
          )}
          {mobileView === 'ai' && (
            <AIChatPanel client={client} mobile />
          )}
        </div>

        {/* Bottom Tab Bar */}
        <nav style={{
          height: 56,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexShrink: 0,
          zIndex: 50,
        }}>
          {tabs.map(({ id, symbol, label, isName }) => {
            const active = mobileView === id;
            return (
              <button
                key={id}
                onClick={() => setMobileView(id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  border: 'none',
                  borderTop: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  transition: 'color 150ms',
                  padding: 0,
                }}
              >
                <span style={{
                  fontFamily: isName ? 'var(--font-display)' : 'var(--font-mono)',
                  fontSize: isName ? 12 : 17,
                  fontWeight: isName ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: isName ? '-0.01em' : 0,
                  maxWidth: 72,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{symbol}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="app-shell">
      <Topbar
        aiPanelOpen={aiPanelOpen}
        onToggleAI={() => setAiPanelOpen((v) => !v)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="app-body">
        <ClientSidebar selectedId={selectedId} onSelect={handleSelect} selectedClient={client} />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          {mainContent}
        </main>
        {aiPanelOpen && <AIChatPanel client={client} />}
      </div>
    </div>
  );
}
