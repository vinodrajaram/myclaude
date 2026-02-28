# MERIDIAN

**AI-first banking intelligence platform for investment and corporate bankers.**

> Turn intelligence into action. Faster.

---

## What is MERIDIAN?

MERIDIAN is a connected platform that puts AI at the center of every workflow for bankers at large financial institutions. It serves investment bankers, corporate bankers, relationship managers, credit analysts, and business heads — giving each persona exactly the intelligence they need, when they need it, across every device they use.

Built on Claude, MERIDIAN is not a feature set bolted onto legacy CRM. It is a ground-up re-imagination of how banking professionals work: synthesizing data, drafting materials, tracking deals, monitoring credit, and surfacing insights — all within a single coherent platform.

---

## Modules

| Module | Name | Purpose |
|--------|------|---------|
| 01 | **Meridian Intelligence** | Client Hub — 360° client intelligence and relationship management |
| 02 | **Meridian Pipeline** | Deal Origination — deal tracking, mandate management, pipeline analytics |
| 03 | **Meridian Forge** | Content Factory — AI-powered pitch books, CIMs, memos, and materials |
| 04 | **Meridian Signal** | Market Intelligence — real-time signals, news synthesis, sector coverage |
| 05 | **Meridian Credit** | Risk Co-pilot — credit analysis, covenant monitoring, portfolio risk |
| 06 | **Meridian Connect** | Workflow & Comms — tasks, approvals, meeting prep, CRM sync |
| 07 | **Meridian Memory** | Knowledge Base — institutional memory, precedent search, document vault |
| 08 | **Meridian Compliance** | In-Business Compliance — conflict clearance, insider lists, walls, conduct risk |
| 09 | **Meridian Talent** | Resource Intelligence — time tracking, capacity management, deal economics, strategy |

---

## Platform Architecture

MERIDIAN is a multi-device platform:
- **Desktop** — primary work surface for analysts and bankers (Next.js 14 web app)
- **iPad** — meeting room, client-facing, and presentation-optimized
- **Mobile** — on-the-go alerts, approvals, and quick intelligence lookups

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop/Tablet Web | Next.js 14 (App Router) |
| Mobile | React Native (Expo) |
| Design System | Tailwind CSS + shadcn/ui |
| AI Orchestration | Claude API (claude-sonnet-4-6) |
| State Management | Zustand + React Query |
| Monorepo | Turborepo |
| Auth | NextAuth.js + RBAC |
| Data Layer | tRPC + REST/OpenAPI |
| Infrastructure | Docker + Kubernetes |

---

## Getting Started

```bash
# Clone and install
git clone <repo>
cd meridian
npm install   # or: pnpm install (recommended)

# Run desktop web app
cd apps/web
npm run dev

# Run mobile app
cd apps/mobile
npx expo start
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Vision](docs/vision.md) | Platform vision, philosophy, and north star |
| [Personas](docs/personas.md) | All user personas with jobs-to-be-done |
| [Capabilities](docs/capabilities.md) | Capability clusters, priority matrix |
| [Architecture Overview](docs/architecture/overview.md) | System architecture and tech decisions |
| [AI Layer](docs/architecture/ai-layer.md) | Claude API orchestration strategy |
| [Data Model](docs/architecture/data-model.md) | Core data entities and relationships |
| [Security & Compliance](docs/architecture/security-compliance.md) | Governance, regulatory, Chinese walls |
| [Module Specs](docs/modules/) | Detailed specs for all 7 modules |
| [Design System](docs/design/design-system.md) | Visual language and component tokens |
| [UX Principles](docs/design/ux-principles.md) | Interaction philosophy |
| [Responsive Strategy](docs/design/responsive-strategy.md) | Desktop/iPad/Mobile approach |

---

## Project Status

See [tasks/todo.md](tasks/todo.md) for current build plan and progress.

---

*MERIDIAN — Where intelligence meets execution.*
