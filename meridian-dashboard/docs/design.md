# Meridian Dashboard — Design System

## Aesthetic
Dark, editorial, financial terminal. Inspired by Bloomberg Terminal, Reuters Eikon, and luxury print media. No decorative elements. Every pixel earns its place.

## CSS Variables
```css
--bg: #08090A          /* Page background — near black */
--surface: #101114     /* Card / panel surface */
--surface-2: #181A1E   /* Elevated surface, active states */
--gold: #C9A84C        /* Primary accent — use sparingly */
--gold-bright: #E4C46A /* Hover / emphasis gold */
--text: #E2DDD6        /* Primary text — warm white */
--text-muted: #7A7570  /* Secondary text */
--text-dim: #2E2C2A    /* Disabled / placeholder */
--border: #1A1C20      /* Default border */
--border-bright: #262930 /* Active / hover border */
--green: #5BAF7A       /* Positive values */
--red: #C45C5C         /* Negative values */
--blue: #6B9FD4        /* Informational / neutral links */
```

## Typography

| Use case | Font | Weight | Size |
|---|---|---|---|
| Company names, section titles | Cormorant Garamond | 600 | 48px / 28px / 18px |
| Data values, KPI numbers | IBM Plex Mono | 400 | varies |
| Labels, tags, inputs | IBM Plex Mono | 300-400 | 11-12px |
| Body copy, AI responses | IBM Plex Sans | 300 | 13-14px |

## Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Topbar (48px height)                                       │
├──────────┬────────────────────────────────┬─────────────────┤
│ Sidebar  │  Client Detail (flex-1)        │  AI Chat        │
│ 260px    │  scrollable                    │  360px          │
│          │                                │  collapsible    │
└──────────┴────────────────────────────────┴─────────────────┘
```

## Rules
- **No border-radius** — square corners everywhere
- **Gold = one accent only** — never use gold for more than one prominent element per section
- **Mono for numbers** — all financial data in IBM Plex Mono
- **Spacing unit: 8px** — all spacing in multiples of 4 or 8
- **Borders not shadows** — use 1px borders instead of box-shadow for separation
- **Uppercase labels** — section headers and tags in uppercase, letter-spacing: 0.12em

## Component Sizing

| Component | Notes |
|---|---|
| Topbar | 48px tall, sticky |
| ClientSidebar | 260px wide, full height |
| AIChatPanel | 360px wide, collapsible to 0 |
| ClientHeader company name | 48px Cormorant |
| KPI tile big number | 36-42px Cormorant or Mono |
| Section heading | 11px uppercase mono, gold |
| Facility / deal table rows | 13px mono |

## Color Usage Rules
- **Gold** → section headings, AI accent, active sidebar item border, 1 KPI highlight per section
- **Green** → positive % changes, positive impact events, healthy metrics
- **Red** → negative % changes, alerts, action required flags, risk warnings
- **Blue** → stage pill "Mandate", informational links
- **Text-muted** → secondary labels, table headers, metadata
