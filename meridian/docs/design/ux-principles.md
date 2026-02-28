# MERIDIAN — UX Principles

## Design Philosophy

MERIDIAN is built for experts under pressure. The people using it are intelligent, time-poor, and already operating in high-stress environments with high stakes. Every UX decision must earn its place by making a banker faster, better informed, or more confident.

---

## Core UX Principles

### 1. Banker Time is Sacred

Every second saved in the interface is a second a banker can spend on higher-value work. This means:

- **Minimize clicks**: Critical actions should require no more than 2 clicks from any context
- **Load fast**: No loading spinners on critical paths. Optimistic updates, background fetching, skeleton screens.
- **Remember context**: Never make bankers re-enter context they've already provided
- **Keyboard-first**: Power users should be able to navigate the entire platform without a mouse

### 2. Intelligence Over Interface

The AI should handle complexity. The interface should stay clean.

- Surface AI-synthesized insights, not raw data dashboards
- Proactive information delivery — don't make bankers ask for information they should already have
- Defaults that are correct for 80% of users — configuration for the other 20%
- AI drafts should feel like a head start, not extra work to clean up

### 3. Confidence Through Transparency

Bankers cannot trust opaque AI. Every AI output must be:

- **Attributed**: "This brief was generated from 3 news articles and your CRM history"
- **Dated**: "Financials last updated: Q3 2025 10-K, filed 2025-11-15"
- **Correctable**: Every AI draft is editable; corrections are easy
- **Reviewable**: Clear "AI draft" labeling; never presented as verified fact

### 4. Mobile Moments, Desktop Work

Banking has different modes:
- **Desktop**: Deep work — building models, preparing materials, reviewing documents
- **Mobile**: Contextual moments — quick brief before walking into a meeting, approving a request, checking an alert

Mobile UX is optimized for these "moments" — single-action, fast, readable in 30 seconds. Not a stripped-down version of the desktop; a purpose-built mobile experience.

### 5. One Platform, Multiple Personas

Different personas see different defaults:
- An Analyst landing on a deal page sees: financial model links, task list, precedent search
- An MD landing on the same deal sees: fee estimate, pipeline status, key relationship contacts
- A Credit Analyst landing on a company page sees: credit profile, covenant status, spreading worksheet

Same underlying data. Different surface area. Configured by role, adjustable by preference.

---

## Interaction Patterns

### Command Palette (`Cmd+K`)

The universal shortcut. Every navigation, search, and action is accessible via command palette:

```
⌘K → type "apple" → navigate to Apple Inc. company profile
⌘K → type "new deal" → create new deal (modal)
⌘K → type "generate brief" → launch meeting brief generator
⌘K → type "DCM comps 2025" → search Memory for DCM comparable transactions
```

The command palette is the power-user interface. Heavy users will live in it.

### Contextual Actions

Every entity in MERIDIAN has a context menu accessible by right-click or three-dot menu. The options are smart:

- On a **company card**: "Generate brief", "Add to pipeline", "View in Intelligence", "Search related docs"
- On a **deal record**: "Generate pitch book", "Update stage", "Log interaction", "View credit profile"
- On a **signal item**: "Create deal idea", "Save to watchlist", "Share to colleague", "Mark read"

### Progressive Disclosure

Don't show everything upfront. Lead with the 20% that matters 80% of the time:

```
Company Card (default view):
┌────────────────────────────────────────┐
│ Apple Inc.              ● GREEN 82     │
│ Technology | Tier 1 Client            │
│ Last contact: 3 days ago              │
│ 2 open deals · $450M pipeline value  │
└────────────────────────────────────────┘
          ↓ Expand
┌────────────────────────────────────────┐
│ + Financials summary                  │
│ + Recent news (3 items)               │
│ + Contacts (5)                        │
│ + Deal history (8 transactions)       │
│ + Credit profile                      │
└────────────────────────────────────────┘
```

### Optimistic Updates

UI updates immediately when a user takes an action. Background sync confirms. If sync fails, graceful rollback with error messaging.

- Log an interaction: appears immediately in the feed
- Update a deal stage: stage changes instantly
- Generate a document: loading state with streaming preview

### Empty States with Purpose

Empty states are never dead ends. Every empty state has:

1. A clear explanation of why it's empty
2. An action to populate it
3. A link to learn more or see examples

```
┌─────────────────────────────────────────┐
│                                         │
│      No pitch books for Acme Corp       │
│                                         │
│  Create your first pitch book to       │
│  begin building Acme's content history  │
│                                         │
│    [ Generate Pitch Book ]              │
│                                         │
└─────────────────────────────────────────┘
```

---

## Information Architecture

### Global Navigation

```
Left Sidebar (always visible):
├── Intelligence (⌘1)
├── Pipeline (⌘2)
├── Forge (⌘3)
├── Signal (⌘4)
├── Credit (⌘5) [if enabled]
├── Connect (⌘6)
├── Memory (⌘7)
└── ─────────────
    Settings
    User profile
```

### Navigation Hierarchy

```
Module → Section → Entity → Detail

Example:
Intelligence → Portfolio Dashboard → Apple Inc. → Client 360° Profile → Financials Tab
```

Breadcrumbs always visible. Back navigation always works as expected. Deep links work for any entity.

---

## Accessibility

MERIDIAN meets WCAG 2.1 AA compliance:

- **Color contrast**: All text/background combinations ≥ 4.5:1 (7:1 for body text)
- **Keyboard navigation**: Full keyboard access to all interactive elements
- **Screen reader support**: ARIA labels, roles, and live regions throughout
- **Focus management**: Clear focus indicators; logical tab order; focus trapping in modals
- **Reduced motion**: All animations disabled when `prefers-reduced-motion: reduce`
- **Text scaling**: Interface reflowable up to 200% text scale
- **Error states**: Never color alone — icons and text accompany all color-coded states

---

## Error Handling UX

### Friendly, Actionable Errors

Bankers don't need technical error messages. They need to know what happened and what to do:

```
❌ Bad:  "Error 503: Service temporarily unavailable"
✅ Good: "We couldn't load Apple's financials right now.
          Try refreshing, or check back in a few minutes."
```

### AI Generation Errors

When AI generation fails:
```
"We couldn't generate the brief — the news feed timed out.
 [Retry]  [Generate without news]  [Skip to manual edit]"
```

### Data Freshness Warnings

When displaying potentially stale data:
```
⚠ Financials from Q2 2025 — newer data may be available.
  [Refresh from Bloomberg]
```

---

## Form Design

- **Progressive forms**: Don't show all fields at once. Lead with required fields; optional fields collapsed.
- **Inline validation**: Validate on blur (not on every keystroke)
- **Smart defaults**: Pre-fill from context wherever possible
- **Help text**: Visible without interaction for critical fields; tooltip for supplementary guidance
- **Confirmation for destructive actions**: "Delete" and "Reset" actions require explicit confirmation

---

## Performance UX

- **Skeleton screens** instead of loading spinners (preserve layout, reduce perceived wait)
- **Instant feedback** on every user action (within 100ms: acknowledge the click)
- **Background loading**: Load secondary content after primary content is visible
- **Offline graceful degradation**: Show cached data with staleness indicator when offline
- **Long AI operations**: Progress indicator with intermediate results ("Found 12 relevant news items...")
