import React, { useState, useRef, useEffect } from 'react';

// ─── AI Response Simulation ───────────────────────────────────

function generateSummary(client) {
  const { profile, revenue, lending, dealPipeline } = client;
  const activeDeal = dealPipeline.find((d) => d.stage === 'Closing' || d.stage === 'Mandate');
  return `✦ Client Summary — ${profile.name}

${profile.name} is a ${profile.sector} ${profile.tier === 1 ? 'Tier 1' : profile.tier === 2 ? 'Tier 2' : 'Tier 3'} client covered by ${profile.coverageBanker}, headquartered in ${profile.hq}.

Revenue: LTM $${revenue.ltm}M · YTD $${revenue.ytd}M · Wallet ${revenue.walletShare}% (${revenue.walletTrend})

Lending: $${lending.committed}M committed, $${lending.drawn}M drawn. Rating: ${lending.riskRating}.

${activeDeal ? `Priority deal: ${activeDeal.name} — ${activeDeal.stage}, $${activeDeal.size}M, closes ${activeDeal.expectedClose}.` : ''}

${client.aiBrief}`;
}

function generateRisks(client) {
  const { profile, lending, leadershipChanges, marketEvents, dealPipeline } = client;
  const negEvents = marketEvents.events.filter((e) => e.impact === 'negative');
  const actionRequired = leadershipChanges.filter((l) => l.actionRequired);
  const bridge = dealPipeline.find((d) => d.product.toLowerCase().includes('bridge'));
  const risks = [];

  if (parseInt(((lending.drawn / lending.committed) * 100)) > 85) {
    risks.push(`— Credit: ${lending.riskRating} with ${((lending.drawn / lending.committed) * 100).toFixed(0)}% utilization. Headroom thin at $${lending.undrawn}M.`);
  }
  if (actionRequired.length > 0) {
    risks.push(`— Leadership: ${actionRequired.map((l) => l.person).join(', ')} transition(s) require immediate outreach.`);
  }
  if (negEvents.length > 0) {
    risks.push(`— Market: ${negEvents[0].headline}`);
  }
  if (bridge) {
    risks.push(`— Refinancing: ${bridge.name} — capture refi mandate before maturity.`);
  }
  if (risks.length === 0) risks.push('— No material risks flagged. Monitor credit utilization and wallet share trend.');

  return `✦ Key Risks — ${profile.name}\n\n${risks.join('\n\n')}\n\nRecommendation: schedule a risk review with ${profile.coverageBanker} this quarter.`;
}

function generateMeetingPrep(client) {
  const { profile, revenue, dealPipeline, leadershipChanges, marketEvents } = client;
  const topDeal = dealPipeline[0];
  const recentEvent = marketEvents.events[0];
  const leaderChange = leadershipChanges[0];

  return `✦ Meeting Prep — ${profile.name}

OPEN WITH:
  "${recentEvent?.headline.substring(0, 72)}…"

TOP AGENDA:
  1. ${topDeal ? `${topDeal.name} — ${topDeal.stage}, $${topDeal.size}M, close ${topDeal.expectedClose}` : 'Pipeline review'}
  2. Wallet share ${revenue.walletShare}% (${revenue.walletTrend}) — probe competitive pressure
  ${leaderChange ? `3. ${leaderChange.person} transition — reaffirm coverage relationship` : ''}

KEY METRICS TO REFERENCE:
  LTM Revenue: $${revenue.ltm}M · YTD: $${revenue.ytd}M
  Top product: ${revenue.breakdown[0].product} ($${revenue.breakdown[0].amount}M)

WATCH:
  ${leaderChange?.actionRequired ? `${leaderChange.person} recently transitioned — tread carefully on relationship continuity` : 'Confirm decision-maker hierarchy before pitching new mandates'}`;
}

function generateNextAction(client) {
  const { profile, dealPipeline, leadershipChanges, lending } = client;
  const closing = dealPipeline.filter((d) => d.stage === 'Closing');
  const mandate = dealPipeline.filter((d) => d.stage === 'Mandate');
  const actionRequired = leadershipChanges.filter((l) => l.actionRequired);
  const maturingSoon = lending.facilities.find((f) => parseInt(f.maturity.split('-')[0]) <= 2027);

  const actions = [];
  if (actionRequired.length > 0) actions.push(`🔴 URGENT: Contact ${actionRequired[0].person} — ${actionRequired[0].oldRole} → ${actionRequired[0].newRole}.`);
  if (closing.length > 0) actions.push(`🟡 CLOSING: Execute ${closing[0].name} ($${closing[0].size}M) — target ${closing[0].expectedClose}.`);
  if (mandate.length > 0) actions.push(`🟢 MANDATE: Kick off ${mandate[0].name} with ${mandate[0].banker}.`);
  if (maturingSoon) actions.push(`📋 PIPELINE: ${maturingSoon.type} ($${maturingSoon.amount}M) matures ${maturingSoon.maturity} — pitch refi now.`);
  if (actions.length === 0) actions.push('— Schedule quarterly business review. No immediate actions outstanding.');

  const diff = Math.round((new Date('2026-02-24') - new Date(profile.lastInteraction)) / 86400000);
  const lastStr = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff}d ago`;
  return `✦ Next Best Actions — ${profile.name}\n\n${actions.join('\n\n')}\n\nCoverage: ${profile.coverageBanker} · Last interaction: ${lastStr}`;
}

function generateRevenueInsight(client) {
  const { profile, revenue } = client;
  const last = revenue.trend[revenue.trend.length - 1];
  const prev = revenue.trend[revenue.trend.length - 2];
  const mom = (((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1);

  return `✦ Revenue & Wallet — ${profile.name}

YTD: $${revenue.ytd}M · LTM: $${revenue.ltm}M
Wallet: ${revenue.walletShare}% (${revenue.walletTrend})
MoM (${last.month}): ${mom > 0 ? '+' : ''}${mom}%

TOP PRODUCTS:\n${revenue.breakdown.map((b, i) => `  ${i + 1}. ${b.product} — $${b.amount}M`).join('\n')}

${revenue.walletTrendDir === 'down' ? 'Wallet share is declining — investigate competitive pressure and probe who is taking share.' : 'Wallet share growing — defend position by accelerating pipeline deals.'}`;
}

function generateLendingInsight(client) {
  const { profile, lending } = client;
  const util = ((lending.drawn / lending.committed) * 100).toFixed(0);

  return `✦ Lending — ${profile.name}

Committed: $${lending.committed}M · Drawn: $${lending.drawn}M (${util}%) · Undrawn: $${lending.undrawn}M
Rating: ${lending.riskRating}

FACILITIES:\n${lending.facilities.map((f) => `  — ${f.type}: $${f.amount}M, matures ${f.maturity} [${f.status}]`).join('\n')}

${parseInt(util) > 85 ? '⚠ High utilization — limited headroom. Monitor covenant compliance carefully.' : 'Utilization is within a normal range.'}`;
}

function generateFallback(client) {
  return `✦ Meridian AI — ${client.profile.name}

Available commands:
  summarize  — full client snapshot
  risks      — key risk factors
  meeting    — meeting prep & agenda
  action     — next best actions
  revenue    — wallet share analysis
  lending    — exposure details

What would you like to explore?`;
}

function getAIResponse(message, client) {
  const m = message.toLowerCase();
  if (m.includes('summar')) return generateSummary(client);
  if (m.includes('risk')) return generateRisks(client);
  if (m.includes('meeting') || m.includes('prep')) return generateMeetingPrep(client);
  if (m.includes('next') || m.includes('action')) return generateNextAction(client);
  if (m.includes('revenue') || m.includes('wallet')) return generateRevenueInsight(client);
  if (m.includes('lend') || m.includes('facility') || m.includes('credit')) return generateLendingInsight(client);
  return generateFallback(client);
}

const QUICK_PROMPTS = [
  { label: 'Summarize', msg: 'Summarize this client' },
  { label: 'Next action', msg: 'What is the next best action?' },
  { label: 'Meeting prep', msg: 'Help me prep for a meeting' },
  { label: 'Key risks', msg: 'What are the key risks?' },
];

// ─── Component ────────────────────────────────────────────────

export default function AIChatPanel({ client, mobile }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `✦ Context loaded\n\n${client?.aiBrief || ''}` },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'ai', text: `✦ ${client?.profile?.name}\n\n${client?.aiBrief || ''}` }]);
  }, [client?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text) => {
    if (!text.trim() || !client || thinking) return;
    setMessages((p) => [...p, { role: 'user', text: text.trim() }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setMessages((p) => [...p, { role: 'ai', text: getAIResponse(text, client) }]);
      setThinking(false);
    }, 500 + Math.random() * 500);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div style={{
      width: mobile ? '100%' : 360,
      height: mobile ? '100%' : undefined,
      flexShrink: 0,
      background: 'var(--surface)',
      borderLeft: mobile ? 'none' : '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '0 18px',
        height: 48,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 13, color: 'var(--gold)' }}>✦</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
          }}>Meridian AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Live</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        flexShrink: 0,
      }}>
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => send(qp.msg)}
            disabled={thinking}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.06em',
              padding: '5px 11px',
              border: '1px solid var(--border-bright)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: thinking ? 'not-allowed' : 'pointer',
              transition: 'all 140ms',
            }}
            onMouseEnter={(e) => {
              if (!thinking) {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-bright)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '10px 16px',
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '90%',
              background: msg.role === 'user' ? 'var(--surface-2)' : 'transparent',
              border: msg.role === 'user' ? '1px solid var(--border-bright)' : 'none',
              padding: msg.role === 'user' ? '9px 13px' : '0',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: 1.75,
              color: msg.role === 'user' ? 'var(--text)' : 'var(--text-muted)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div style={{ padding: '10px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', opacity: 0.6 }}>
              ✦ thinking…
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
        background: 'var(--surface-2)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold)', flexShrink: 0, lineHeight: 1 }}>›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about this client…"
          style={{
            flex: 1,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || thinking}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '4px 9px',
            border: '1px solid var(--border-bright)',
            background: 'transparent',
            color: input.trim() && !thinking ? 'var(--gold)' : 'var(--text-dim)',
            cursor: input.trim() && !thinking ? 'pointer' : 'default',
            transition: 'color 150ms',
          }}
        >
          ↵
        </button>
      </div>
    </div>
  );
}
