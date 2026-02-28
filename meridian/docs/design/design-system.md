# MERIDIAN — Design System

## Overview

The MERIDIAN design system defines the visual language, component library, and design tokens that make the platform feel cohesive, professional, and distinctively un-enterprise. It is implemented in Tailwind CSS with shadcn/ui component primitives, customized to MERIDIAN's brand.

---

## Design Philosophy

**Professional without being sterile.** MERIDIAN is used by bankers who are already drowning in dense, grey enterprise software. The design should feel intentional, modern, and calm — not a Bloomberg terminal, not a startup SaaS tool, but something that belongs in both environments.

**Information density with breathing room.** Banking requires high information density — lots of data in a small space. But density should not mean cramped. We achieve density through type hierarchy, spacing rhythm, and selective use of color for signal.

**Dark mode is primary.** Trading floors and banking offices often prefer dark interfaces. MERIDIAN ships dark mode as the default, with a clean light mode available.

---

## Color System

### Brand Colors

| Token | Dark Mode | Light Mode | Use |
|-------|-----------|-----------|-----|
| `--color-primary` | `#4F8EF7` | `#2563EB` | Actions, links, key CTAs |
| `--color-primary-hover` | `#6BA3FA` | `#1D4ED8` | Primary button hover |
| `--color-secondary` | `#A78BFA` | `#7C3AED` | Secondary actions, accents |
| `--color-accent` | `#34D399` | `#059669` | Success, positive indicators |

### Semantic Colors

| Token | Dark Mode | Light Mode | Meaning |
|-------|-----------|-----------|---------|
| `--color-success` | `#34D399` | `#059669` | Positive states, green health |
| `--color-warning` | `#FBBF24` | `#D97706` | Amber alerts, attention needed |
| `--color-danger` | `#F87171` | `#DC2626` | Errors, red alerts, critical |
| `--color-info` | `#60A5FA` | `#3B82F6` | Informational, neutral signals |

### Surface Colors (Dark Mode)

| Token | Value | Use |
|-------|-------|-----|
| `--surface-bg` | `#0F1117` | App background |
| `--surface-base` | `#161B2B` | Card / panel background |
| `--surface-raised` | `#1E2640` | Elevated components, dropdowns |
| `--surface-overlay` | `#252D47` | Modals, tooltips |
| `--surface-border` | `#2D3554` | Borders, dividers |
| `--surface-hover` | `#1E2640` | Hover state on interactive items |

### Surface Colors (Light Mode)

| Token | Value | Use |
|-------|-------|-----|
| `--surface-bg` | `#F8FAFC` | App background |
| `--surface-base` | `#FFFFFF` | Card / panel background |
| `--surface-raised` | `#F1F5F9` | Elevated components |
| `--surface-overlay` | `#FFFFFF` | Modals |
| `--surface-border` | `#E2E8F0` | Borders, dividers |
| `--surface-hover` | `#F1F5F9` | Hover states |

### Text Colors

| Token | Dark Mode | Light Mode | Use |
|-------|-----------|-----------|-----|
| `--text-primary` | `#F1F5F9` | `#0F172A` | Primary content |
| `--text-secondary` | `#94A3B8` | `#475569` | Secondary content, labels |
| `--text-tertiary` | `#64748B` | `#94A3B8` | Timestamps, metadata |
| `--text-disabled` | `#334155` | `#CBD5E1` | Disabled states |
| `--text-inverse` | `#0F172A` | `#F1F5F9` | Text on colored backgrounds |

---

## Typography

### Type Scale

MERIDIAN uses **Inter** for UI text (body, labels, data) and **Inter** with tight tracking for display headings.

| Scale | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `display-lg` | 32px | 700 | 1.2 | Hero headings, page titles |
| `display-md` | 24px | 700 | 1.25 | Section titles, modal headings |
| `heading-lg` | 20px | 600 | 1.3 | Card headers, panel titles |
| `heading-md` | 16px | 600 | 1.4 | Sub-section headers |
| `heading-sm` | 14px | 600 | 1.4 | Compact headers, table headers |
| `body-lg` | 16px | 400 | 1.6 | Primary body text |
| `body-md` | 14px | 400 | 1.5 | Standard body, form labels |
| `body-sm` | 13px | 400 | 1.5 | Secondary information |
| `caption` | 12px | 400 | 1.4 | Timestamps, metadata, footnotes |
| `label` | 11px | 500 | 1.3 | Tags, badges, chip labels |
| `mono` | 13px | 400 | 1.5 | Numbers, codes, financial data |

### Data Formatting

All financial figures use monospace alignment for scannable tables:
```css
.financial-figure {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
```

---

## Spacing System

8-point grid system. All spacing in multiples of 4px.

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Micro gaps between related elements |
| `space-2` | 8px | Compact padding within components |
| `space-3` | 12px | Standard component internal padding |
| `space-4` | 16px | Default component padding |
| `space-5` | 20px | Card internal padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large section gaps |
| `space-10` | 40px | Page-level section separation |
| `space-12` | 48px | Hero/feature spacing |

---

## Component Library

### Navigation Components

**Global Navigation (Sidebar)**
- Fixed left sidebar, 64px collapsed / 220px expanded
- Module icons with labels (expanded) or tooltips (collapsed)
- User avatar and settings at bottom
- Keyboard shortcut: `Cmd+K` to open command palette

**Top Bar**
- Module name and breadcrumb
- Global search (opens command palette)
- Notification bell with badge
- User menu

**Command Palette** (`Cmd+K`)
- Universal search and action trigger
- Fuzzy search across clients, deals, documents
- Keyboard-first navigation
- AI-powered: "Find me the pitch book for Acme Corp 2023"

---

### Data Display Components

**Stat Card**
Used for KPIs and summary metrics:
```
┌──────────────────────────────┐
│ Pipeline Value               │
│ $2.4B                        │
│ ↑ 12% vs. prior month        │
└──────────────────────────────┘
```

**Data Table**
- Fixed/sticky headers
- Column sorting
- Row selection with bulk actions
- Inline edit for quick data updates
- Pagination (cursor-based, virtualized for large datasets)
- Zebra striping optional

**Health Score Badge**
```
● GREEN  ● AMBER  ● RED
```
Color dot + label, optionally with numeric score.

**Timeline**
For deal stages, credit history, interaction history:
```
◉───────────●───────────○───────────○
IDEA      PITCHED   MANDATE    CLOSE
 Mar 15    Apr 2      —          —
```

---

### Form Components

Built on Radix UI primitives via shadcn:
- **Input**: Standard text, number, date inputs
- **Select**: Searchable dropdown
- **Combobox**: Multi-select with search
- **Date Picker**: Calendar with range support
- **Textarea**: Auto-resize, with character count
- **Checkbox / Radio / Switch**: Accessible, keyboard-navigable
- **File Upload**: Drag-and-drop with type validation and progress

---

### Feedback Components

- **Toast notifications**: Bottom-right, auto-dismiss, stacked
- **Banner alerts**: Top-of-page contextual alerts
- **Empty states**: Illustrated, with clear action prompts
- **Loading skeletons**: Component-level skeleton screens (not spinners)
- **Progress indicators**: Linear and radial variants

---

### AI-Specific Components

**AI Generation Card**
```
┌─────────────────────────────────────┐
│ ✦ Generating meeting brief...        │
│ ████████████████░░░░  80%            │
│                                     │
│ Analysing recent news...            │
└─────────────────────────────────────┘
```

**AI Draft Banner**
Applied to all AI-generated content:
```
┌─────────────────────────────────────┐
│ ✦ AI Draft — Review before use       │
│ Generated 2 mins ago · claude-sonnet │
└─────────────────────────────────────┘
```

**Inline AI Chat**
Available in Forge documents and select modules:
- Floating panel, resizable
- Conversation history
- Code/table rendering
- Copy to clipboard on any AI response

---

## Icon System

Using **Lucide Icons** (consistent with shadcn/ui). Module icons are custom SVGs:

| Module | Icon Concept |
|--------|-------------|
| Intelligence | Brain/neural network |
| Pipeline | Funnel/flow |
| Forge | Anvil/hammer |
| Signal | Radio waves / pulse |
| Credit | Shield/chart |
| Connect | Network nodes |
| Memory | Archive/vault |

---

## Animation & Motion

**Principles:**
- Animations should feel purposeful — transitions communicate state, not decorate
- Duration: 150ms for micro-interactions, 250ms for component transitions, 350ms for page transitions
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out) for most transitions

**Reduced motion:** All animations respect `prefers-reduced-motion` media query.

**Key animations:**
- Page transitions: horizontal slide with fade (150ms)
- Modal: scale + fade (200ms)
- Toast: slide in from bottom (200ms), slide out (150ms)
- AI generation text: streaming text render
- Loading skeleton: shimmer pulse

---

## Tailwind Configuration

```typescript
// tailwind.config.ts (excerpt)
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // All design tokens mapped here
        'surface-bg': 'var(--surface-bg)',
        'surface-base': 'var(--surface-base)',
        'surface-raised': 'var(--surface-raised)',
        'surface-border': 'var(--surface-border)',
        // ... etc
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```
