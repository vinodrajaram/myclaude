# MERIDIAN — Responsive Strategy

## Device Philosophy

MERIDIAN is a multi-device platform, but not one app stretched across all screen sizes. Each device form factor has a distinct context of use:

| Device | Context | Primary Use Cases |
|--------|---------|------------------|
| **Desktop** | Desk-based deep work | Data analysis, document creation, pipeline management, research |
| **iPad** | Meeting rooms, client-facing, travel | Presenting, briefing review, light creation, approvals |
| **Mobile** | On-the-go, moments between meetings | Quick lookups, alerts, approvals, meeting prep |

Design for the device's context, not just its screen size.

---

## Desktop Experience (1024px–2560px+)

### Target Users
All personas during their core working hours.

### Layout Architecture

```
┌──────┬──────────────────────────────────┬──────────┐
│      │  Top Bar (module + search + user)│          │
│  Nav │──────────────────────────────────│  Context │
│      │                                  │  Panel   │
│  64px│    Primary Content Area         │          │
│  or  │                                  │  (optional)│
│ 220px│                                  │  280px   │
│      │                                  │          │
└──────┴──────────────────────────────────┴──────────┘
```

**Sidebar (left):**
- Collapsed: 64px with icon-only navigation + tooltips
- Expanded: 220px with icons + labels
- Toggled via button or `Cmd+B`

**Primary content area:**
- Fills remaining width
- Maximum content width: 1440px (centered on ultrawide)
- Multi-column layouts for data-heavy views (2–3 column grid)

**Context panel (right, optional):**
- Module-dependent: shows related entities, AI chat, or quick actions
- Togglable — collapses to preserve content space

### Desktop-Specific Features
- **Keyboard shortcuts throughout**: All common actions bound (`Cmd+K`, module shortcuts `⌘1–7`, `N` for new, `E` for edit)
- **Multi-panel views**: Intelligence + Pipeline side-by-side for deal team workflow
- **Data density**: Tables show 20+ rows; dashboards show 6–8 KPI cards
- **Drag and drop**: Pipeline board, task reordering
- **Hover states**: Rich hover cards showing entity summaries before clicking

---

## iPad Experience (768px–1024px)

### Target Users
- Bankers in client meetings
- Bankers preparing during commute
- Senior bankers doing light reviews

### Layout Adaptations

```
┌────────────────────────────────────────┐
│  Top Bar (module name + search + user) │
├────────────────────────────────────────┤
│                                        │
│         Primary Content Area          │
│                                        │
│   (Full width, single column)         │
│                                        │
└────────────────────────────────────────┘
        Bottom Tab Bar (5 modules)
```

**Navigation:** Bottom tab bar replacing sidebar (5 primary modules + "More")

**Content adaptation:**
- Single-column layouts for most views
- Two-column for specific views with sufficient space (landscape orientation)
- Larger touch targets (minimum 44×44px)
- Swipe gestures for navigation between sections

### iPad-Specific Features

**Presentation Mode:**
- Triggered from any client profile, pitch book, or briefing
- Hides navigation chrome entirely
- Content formatted for large display / side-by-side with client
- Swipe between slides/sections
- "Private notes" overlay (visible to banker on second screen or via AirPlay)

**Offline Mode:**
- Key client profiles cached for offline access (configurable)
- Meeting briefs cached automatically 24 hours before scheduled meetings
- Clear "offline" indicator when viewing cached content

**Apple Pencil support (future):**
- Annotation on documents during meetings
- Handwritten notes captured and converted to text

---

## Mobile Experience (320px–767px)

### Target Users
- Any banker on-the-go
- Quick reference between meetings
- Approval decisions

### Design Principles for Mobile

**Thumb-zone first:**
Primary actions in bottom 40% of screen (thumb reach zone on phones). Navigation at bottom. Destructive actions require upward reach (intentional).

**One action per screen:**
Mobile screens don't try to replicate the desktop. Each screen answers one question or enables one action:
- "Who am I meeting with, and what do I need to know?" (Meeting brief)
- "What's changed in my pipeline today?" (Pipeline summary)
- "Do I have any alerts to action?" (Notification center)
- "What's the news on Acme Corp?" (Company signal feed)

**Content not interface:**
Hide all chrome that isn't essential. Navigation collapses. Secondary actions hidden behind swipe or three-dot menus. The content is the screen.

### Mobile Navigation

```
┌───────────────────────────────┐
│  ← Back    Company Name   ⋯  │
├───────────────────────────────┤
│                               │
│       Content                 │
│                               │
├───────────────────────────────┤
│  🧠   🔄   ✍️   📡   🔔      │
│ Intel Pipeline Forge Signal Notif│
└───────────────────────────────┘
```

Five-tab navigation covering core daily-use modules.

### Mobile-Specific Features

**Quick Actions:**
- Swipe right on a deal card to log an interaction
- Swipe left to mark as needing follow-up
- Long-press on any entity to access context actions

**Voice-to-Text:**
- Meeting notes entry via voice
- Quick interaction logging: "Hold to record post-meeting note"

**Push Notifications:**
- High-priority alerts: covenant breach, mandate won, pipeline alert
- Meeting reminders with one-tap access to brief
- Approval requests with one-tap approve/reject

**Biometric Authentication:**
- Face ID / Touch ID for app unlock
- Sensitive operations (approvals, document access) require biometric confirmation

---

## Responsive Breakpoints

```
Mobile Small:   320px  – 479px   (compact mobile)
Mobile:         480px  – 767px   (standard mobile)
Tablet:         768px  – 1023px  (iPad portrait, small tablets)
Desktop Small:  1024px – 1279px  (laptop, iPad landscape)
Desktop:        1280px – 1535px  (standard desktop)
Desktop Large:  1536px+          (large monitor, ultrawide)
```

### Tailwind Breakpoint Config
```typescript
screens: {
  'sm':  '480px',
  'md':  '768px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
}
```

---

## Component Responsive Behavior

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Navigation | Bottom tabs | Bottom tabs | Left sidebar |
| Data table | Cards | Scrollable table (reduced columns) | Full table |
| Dashboard grid | 1 column | 2 columns | 3–4 columns |
| KPI stats | Horizontal scroll | 2×2 grid | 4-column row |
| Pipeline board | List view | 2-column kanban | Full kanban |
| Client 360° | Tabbed sections | 2-column layout | Full layout |
| Meeting brief | Single scroll | Single scroll | Split with actions |
| Forge editor | View only | Limited edit | Full editor |

---

## Implementation Notes

### Single Codebase Strategy
MERIDIAN uses a single Next.js app for desktop and tablet (responsive web), plus React Native for mobile.

**Code sharing between web and mobile:**
- Business logic: Shared TypeScript hooks and utilities (monorepo packages)
- API clients: Shared tRPC client configuration
- Data types and validation: Shared Zod schemas
- NOT shared: UI components (web: shadcn/Tailwind; mobile: React Native components)

### CSS Strategy
Tailwind CSS with mobile-first approach:
```tsx
// Mobile-first: base styles are mobile, then upgrade for larger screens
<div className="
  grid grid-cols-1          // mobile: 1 column
  md:grid-cols-2            // tablet: 2 columns
  xl:grid-cols-4            // desktop: 4 columns
  gap-4 md:gap-6
">
```

### Testing Across Devices
- **Desktop**: Chrome, Firefox, Safari (Playwright tests)
- **iPad**: Safari on iPadOS (BrowserStack / real device)
- **Mobile web**: Safari iOS, Chrome Android
- **React Native**: iOS Simulator + Android emulator; real device testing for biometric features
