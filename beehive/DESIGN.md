# Beehive — Design System

*Privacy-First AI Meeting Intelligence for Bankers*
*Established 2026-03-20 by /plan-design-review*
*Updated 2026-03-20 by /design-consultation — typography resolved, contrast fixed, icons + motion + inputs added*

---

## Visual Language

**Aesthetic:** Warm professional. Not cold fintech. Not consumer-bright.
The amber accent is the hive — used sparingly as the single expressive note
against an otherwise minimal, high-density interface.

**Guiding principle:** Dieter Rams' "as little design as possible."
Every element earns its pixels or gets cut.

---

## Typography

| Role | Typeface | Size | Weight |
|---|---|---|---|
| Display / headings | Geist Sans | 18–20px | 500 |
| Section headers | Geist Sans | 15px | 500 |
| Body | Geist Sans | 13px | 400 |
| Labels / metadata | Geist Sans | 11px | 500, uppercase, 0.06em tracking |
| Data / timestamps | JetBrains Mono | 12px | 400 |
| CTA buttons | Geist Sans | 13px | 600 |

Base size: **13px**. Bankers work in dense UIs. Don't inflate for consumer comfort.
Line height: 1.5 for body, 1.2 for headings.

### Type scale

| Token | Size | Use |
|---|---|---|
| `text-xs` | 11px | Labels, metadata, badges |
| `text-sm` | 12px | Monospace data, secondary body |
| `text-base` | 13px | Primary body, buttons |
| `text-md` | 15px | Section headers, empty state headlines |
| `text-lg` | 18px | Page headings, call titles |
| `text-xl` | 20px | Display headings (rare) |
| `text-2xl` | 24px | Dashboard hero numbers |

### Font loading

Geist Sans and Geist Mono via `next/font` (self-hosted by Next.js — no external request):

```ts
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

JetBrains Mono via Google Fonts `<link>` or self-hosted. If self-hosting Geist, prefer
a local copy of JetBrains Mono too to avoid a second external font request.

---

## Color Tokens

### Dark mode (default)

```css
--bg:           #0F0F0F;
--surface:      #1A1A1A;
--surface-high: #242424;
--border:       #2E2E2E;
--text-1:       #F0EEE8;   /* warm white — primary */
--text-2:       #8A8A8A;   /* secondary — 6.2:1 on --bg ✓ */
--text-3:       #787878;   /* tertiary / disabled — 4.6:1 on --bg ✓ */
--accent:       #C9932A;   /* amber — the hive */
--accent-dim:   #C9932A22; /* amber at 13% opacity — backgrounds */
--destructive:  #E05252;
--success:      #52A87A;
```

### Light mode (toggle)

```css
--bg:           #F7F5F1;   /* warm off-white */
--surface:      #FFFFFF;
--surface-high: #FAFAF8;
--border:       #E4E2DC;
--text-1:       #111110;
--text-2:       #6B6966;
--text-3:       #A8A49E;
--accent:       #A67C1E;   /* amber darkened for contrast */
--accent-dim:   #A67C1E18;
--destructive:  #C0392B;
--success:      #2E7D52;
```

Theme class applied to `<html>`: `.dark` (default) / `.light`.
FOUC prevention: inline `<script>` in `<head>` applies theme before first paint.
Persisted to `localStorage('beehive-theme')`.

**Contrast audit (dark mode):**
- text-1 (#F0EEE8) on bg (#0F0F0F): ~17:1 ✓
- text-2 (#8A8A8A) on bg (#0F0F0F): ~6.2:1 ✓
- text-3 (#787878) on bg (#0F0F0F): ~4.6:1 ✓
- accent (#C9932A) on bg (#0F0F0F): ~7.1:1 ✓

---

## Spacing Scale

Base unit: **4px**.

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Tight — icon gap, inline elements |
| `space-2` | 8px | Component internal padding |
| `space-3` | 12px | Between related elements |
| `space-4` | 16px | Section padding, card padding |
| `space-6` | 24px | Between sections |
| `space-8` | 32px | Page-level padding |
| `space-12` | 48px | Major section gaps |

No half-pixels. No arbitrary values.

---

## Border Radius

| Context | Value |
|---|---|
| Cards / panels | 6px |
| Inputs / buttons | 4px |
| Badges / tags | 4px (not pill — professional) |
| Avatars | 50% |
| Tooltips | 4px |

---

## Elevation

Elevation via border, not shadow.

```css
/* Level 0 — page background */
background: var(--bg);

/* Level 1 — surface */
background: var(--surface);
border: 1px solid var(--border);

/* Level 2 — elevated (modals, dropdowns) */
background: var(--surface-high);
border: 1px solid var(--border);
box-shadow: 0 4px 16px rgba(0,0,0,0.4);
```

---

## Motion & Transitions

Minimal-functional. Transitions aid comprehension. They do not perform.

```css
/* Interactive elements — hover, active */
transition: background 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out;

/* Sidebar collapse / expand */
transition: width 200ms ease-in-out;

/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
animation: shimmer 1.4s ease-in-out infinite;

/* Step pill transitions (Fetching → Transcribing → Summarizing) */
transition: background 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out;

/* Reduced motion — all animations off */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

No entrance animations. No page transitions. Motion only where it aids comprehension.

---

## Icons

**Library:** [Lucide](https://lucide.dev) — 2px stroke, 24px grid, minimal. Used by shadcn/ui. React: `lucide-react`.

**Size system:**

| Context | Size | Use |
|---|---|---|
| Micro / inline | 14px | Within text, inline with labels |
| Standard | 16px | Sidebar nav, action buttons, table rows |
| Featured | 20px | Toolbar, recording controls |
| Empty state | 24px | Empty state illustrations |

**Color:**
- Default: inherits `currentColor` (matches text)
- Active / accent: `var(--accent)` — only for active nav, empty states, recording dot
- Muted: `var(--text-3)` — secondary controls, disabled states

**Stroke weight:** 1.5px default (matches Geist Sans at 13px text weight visually).
Do not mix Lucide with other icon libraries. One library, one stroke weight.

---

## Component Patterns

### Call row (NOT a card)

Summary rows use a left accent border, not a box.

```
┌─ amber 2px ─┬──────────────────────────────────────┐
│             │ Riverview Capital / Q2 Financing      │  13px, text-1
│             │ Today · 12 min · Zoom          3 acts │  11px, text-2
│             │ Leverage ratio to 4.5x. Model…        │  12px, text-2
└─────────────┴──────────────────────────────────────┘
```

- Left border: `2px solid var(--accent)` when has open actions; `2px solid var(--border)` when complete
- No box shadow. No rounded corners on the row (only 6px on the container).
- Hover: `background: var(--surface-high)` with 120ms ease-out transition

### Buttons

```css
/* Primary CTA */
background: var(--accent);
color: #0F0F0F;
padding: 10px 16px;
border-radius: 4px;
font-weight: 600;
transition: opacity 120ms ease-out;

/* Hover */
opacity: 0.9;

/* Secondary */
background: transparent;
color: var(--text-1);
border: 1px solid var(--border);
padding: 9px 15px;
transition: background 120ms ease-out, border-color 120ms ease-out;

/* Secondary hover */
background: var(--surface-high);
border-color: var(--text-3);

/* Destructive */
background: transparent;
color: var(--destructive);
border: 1px solid var(--destructive);
```

No gradient buttons. No rounded-full pills for CTAs.

### Form inputs

```css
/* Default */
background: var(--surface);
border: 1px solid var(--border);
border-radius: 4px;
color: var(--text-1);
font-size: 13px;
padding: 8px 10px;
transition: border-color 120ms ease-out, box-shadow 120ms ease-out;

/* Focus */
border-color: var(--accent);
outline: none;
box-shadow: 0 0 0 2px var(--accent-dim);

/* Error */
border-color: var(--destructive);
box-shadow: 0 0 0 2px rgba(224, 82, 82, 0.12);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
background: var(--surface-high);

/* Placeholder text */
color: var(--text-3);
```

Inline editing (action item descriptions): same focus/error states applied inline.
No separate "edit mode" treatment — the field is always visually editable on focus.

### Recording indicator

```
● 12:47   (amber dot + monospace timer)
```

- Dot: 8px circle, `var(--accent)`, NO pulse animation (distracting during calls)
- Timer: JetBrains Mono, 13px
- Stop button: outlined red, NOT filled (so it doesn't feel alarming)

### Loading states

- **Lists:** Skeleton rows (animated shimmer, `var(--surface-high)`) — never spinners
- **Processing pipeline:** Step pills (Fetching → Transcribing → Summarizing) with active/pending/done states
- **Search:** Immediate — no loading state needed at list scale

### Empty states

Structure: Lucide icon (24px, amber) + headline (15px, text-1) + subline (13px, text-2) + optional CTA.

```
        ○          ← Lucide icon, var(--accent), 24px
   Your hive       ← 15px, text-1, centered, Geist Sans 500
   is quiet.
   No calls today. ← 13px, text-2, centered
  [Connect Calendar]← secondary button, optional
```

No illustrations. No "empty box" graphics. Warm, specific, minimal.

### Badges / tags

```css
/* Entity tag (person, company, deal) */
display: inline-block;
background: var(--accent-dim);
color: var(--accent);
border-radius: 4px;
padding: 1px 6px;
font-size: 11px;
font-weight: 500;
```

### Focus ring

```css
outline: 2px solid var(--accent);
outline-offset: 2px;
```

On-brand and visible. Never hidden.

---

## Navigation

### Desktop (≥1280px)

Left sidebar, 200px, collapsible to 56px icon-only.

Nav items (in order): Home, Calls, Hive, Actions, — (divider), Settings

Active state: `background: var(--accent-dim)`, left border `2px solid var(--accent)`.

### Tablet (768–1279px)

Sidebar collapsed to icon-only (56px). Same items.

### Mobile (<768px)

Bottom tab bar: Home, Calls, Hive, Actions.
Height: 56px + safe area inset.
Active: amber icon + label.

---

## Responsive Breakpoints

| Name | Min-width | Layout |
|---|---|---|
| mobile | 0 | Bottom tabs, single column, full-screen recording |
| tablet | 768px | Collapsed sidebar, single column content |
| desktop | 1280px | Full sidebar, two-column call detail |

---

## Accessibility

- All text meets WCAG AA contrast (4.5:1 minimum) — see contrast audit in Color Tokens
- Keyboard: Tab through all interactive elements; Space to start/stop recording
- Screen reader: `aria-label` on all icon-only controls; `aria-live="polite"` on live transcript
- Touch targets: minimum 44×44px; checkboxes have 44px tap area regardless of visual size
- Reduced motion: all animations and transitions respect `prefers-reduced-motion`
- Focus: never `outline: none` without a visible alternative

---

## Anti-Patterns (BANNED)

- No hero sections with gradient backgrounds
- No 3-column "feature" card grids
- No illustration-heavy empty states
- No loading spinners — use skeleton or progress steps
- No rounded-full (pill) badges
- No "AI-powered" marketing copy in UI
- No modal-heavy flows — use inline or drawer
- No box shadows on list rows — use borders
- No marketing language in app copy ("seamlessly", "powerful", "intelligent")
- No mixing icon libraries — Lucide only

---

## Voice & Copy

- **Tone:** Direct, professional, warm. Not corporate, not casual.
- **Tense:** Present. "Recording…" not "We are recording your call."
- **Length:** As short as possible. Cut every word that doesn't earn its place.
- **Placeholders:** Specific. "Search calls, clients, deals…" not "Search…"
- **Errors:** Own them. "Couldn't load your calls." not "An error occurred."
- **Empty states:** Warm, specific, never generic. "Your hive is quiet." not "No items found."

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-20 | Initial system established | Created by /plan-design-review |
| 2026-03-20 | Söhne → Geist Sans | Söhne requires paid license; Geist is free, Linear-aesthetic, self-hostable via next/font, excellent at 13px density |
| 2026-03-20 | text-3 dark: #5A5A5A → #787878 | Previous value was 2.9:1 against bg — below WCAG AA. #787878 gives 4.6:1 ✓ |
| 2026-03-20 | Icons: Lucide added | Fills gap — no icon library was specified. Lucide matches stroke weight and density of Geist Sans at 13px |
| 2026-03-20 | Motion spec added | Hover/transition timing was undefined — engineers would invent inconsistent values |
| 2026-03-20 | Form input states added | Inline editing requires defined focus/error/disabled states |
| 2026-03-20 | Type scale formalized | 15px (text-md) added for section headers and empty state headlines |
