# MERIDIAN — Architecture Overview

## System Architecture Summary

MERIDIAN is a modular, AI-native platform built as a TypeScript monorepo. The architecture prioritizes:
- **Module isolation** with shared infrastructure
- **AI as first-class citizen** at every data flow
- **Multi-device delivery** from a single codebase
- **Security and compliance** baked in at the data layer

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│   │  Desktop Web │   │  iPad Web    │   │  Mobile App  │       │
│   │  (Next.js)   │   │  (Responsive)│   │ (React Native│       │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
└──────────┼─────────────────┼──────────────────┼────────────────┘
           │                 │                  │
           └────────────────►│◄─────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  tRPC Router / REST API  │  Auth Middleware  │  RBAC     │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      MODULE SERVICE LAYER                        │
│                                                                  │
│  ┌────────────┐ ┌──────────┐ ┌───────┐ ┌────────┐ ┌────────┐  │
│  │Intelligence│ │Pipeline  │ │Forge  │ │Signal  │ │Credit  │  │
│  └────────────┘ └──────────┘ └───────┘ └────────┘ └────────┘  │
│  ┌────────────┐ ┌──────────┐                                    │
│  │  Connect   │ │  Memory  │                                    │
│  └────────────┘ └──────────┘                                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                        SHARED CORE LAYER                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   AI Core    │  │  Data Layer  │  │  Design System      │   │
│  │ (Claude API) │  │  (Connectors)│  │  (Tailwind/shadcn)  │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │     Auth     │  │    Utils     │                             │
│  │ (NextAuth +  │  │              │                             │
│  │    RBAC)     │  │              │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   MERIDIAN DATA & CACHE LAYER                    │
│                                                                  │
│  ┌───────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │ PostgreSQL │ │  Redis     │ │  Vector DB │ │  Market     │  │
│  │  (Core DB) │ │  (SoR Cache│ │ (Pinecone/ │ │  Data APIs  │  │
│  │            │ │  + Sessions│ │  pgvector) │ │  (BBG, CIQ) │  │
│  └───────────┘ └────────────┘ └────────────┘ └─────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│              BANK SYSTEMS OF RECORD (via Connector Layer)        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Core Banking│  │  KYC / AML   │  │  CRM                 │  │
│  │              │  │              │  │                      │  │
│  │  Temenos     │  │  Encompass   │  │  Salesforce FSC      │  │
│  │  Finacle     │  │  Fenergo     │  │  MS Dynamics 365     │  │
│  │  FIS         │  │  Actimize    │  │  DealCloud           │  │
│  │  Finastra    │  │  World-Check │  │  Backstop            │  │
│  │              │  │              │  │                      │  │
│  │  Accounts,   │  │  KYC status, │  │  Contacts, Coverage  │  │
│  │  Facilities, │  │  Risk class, │  │  Assignments,        │  │
│  │  Balances    │  │  AML results │  │  Activities          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  Read-through cache (SoR_READONLY) │ Bi-directional (Activities)│
└─────────────────────────────────────────────────────────────────┘
```

**Note:** MERIDIAN does not own client accounts, KYC records, contacts, coverage assignments, or historical activity logs. These entities are projected via the `shared/data-layer/connectors/` layer and cached locally with TTL-based invalidation. See [systems-of-record.md](systems-of-record.md) for full integration architecture.

---

## Key Technology Decisions

### Desktop/Tablet Web: Next.js 14 (App Router)

**Decision:** Next.js 14 with App Router as the primary web application framework.

**Rationale:**
- Server-side rendering (SSR) for fast initial loads — critical for data-heavy banking dashboards
- React Server Components reduce client-side JavaScript bundle for complex module UIs
- Built-in API routes eliminate need for a separate BFF (Backend for Frontend) layer
- Excellent TypeScript support with strict mode
- Incremental Static Regeneration for relatively static reference data (company profiles, market data)
- Broad ecosystem — shadcn/ui, Tailwind, tRPC all work seamlessly with Next.js
- App Router's nested layouts enable the per-module navigation architecture MERIDIAN requires

**Trade-offs considered:**
- Vite/SPA: Faster dev experience, but no SSR, worse for SEO (less critical for internal tool) and initial load performance
- Remix: Strong contender, but Next.js has broader ecosystem and more established enterprise use

---

### Mobile: React Native (Expo)

**Decision:** React Native with Expo managed workflow for mobile.

**Rationale:**
- Code sharing with web via monorepo (shared business logic, validation, API clients)
- React Native is production-proven at scale in financial services (Bloomberg, Robinhood, etc.)
- Expo managed workflow accelerates development and OTA updates
- React Native Web for any web/mobile component sharing needed
- Near-native performance for the use cases MERIDIAN mobile covers (notifications, quick lookups, approvals)

**Trade-offs considered:**
- Native (Swift/Kotlin): Better performance but no code sharing and 2x engineering overhead
- PWA: Simpler but limited native features (push notifications, biometric auth, offline)
- Flutter: Strong cross-platform but different language (Dart) and smaller ecosystem

---

### Design System: Tailwind CSS + shadcn/ui

**Decision:** Tailwind CSS utility classes with shadcn/ui component primitives, customized to MERIDIAN brand.

**Rationale:**
- Tailwind enables rapid, consistent styling without CSS-in-JS runtime overhead
- shadcn/ui provides accessible, unstyled component primitives that we own (copy-paste, not a dependency)
- Design tokens in `tailwind.config` give us a single source of truth for color, spacing, typography
- Radix UI primitives (underlying shadcn) provide accessibility without reimplementing keyboard nav, ARIA, focus management
- Dark mode support built in — critical for trading floor environments

**Trade-offs considered:**
- MUI: Heavy, opinionated, harder to customize to banking aesthetic
- Mantine: Good but less community momentum than shadcn
- Custom CSS: Too slow to build, hard to maintain consistency

---

### AI Orchestration: Claude API (claude-sonnet-4-6)

**Decision:** Anthropic Claude API as primary LLM. claude-sonnet-4-6 as default model, with model routing for different complexity tiers.

**Rationale:**
- Claude demonstrates superior performance on long-context document analysis — critical for credit memos, CIMs, and large financial documents
- Strong instruction following with complex, multi-step banking workflows
- 200K context window handles large financial documents and pitch books
- Anthropic's Constitutional AI approach aligns with financial services risk management requirements
- Streaming responses for real-time content generation UX
- Tool use / function calling for structured data extraction from documents

**Model routing strategy:**
- `claude-haiku-4-5`: Fast lookups, short-form synthesis, autocomplete, UI interactions
- `claude-sonnet-4-6`: Default for all AI features — content generation, analysis, Q&A
- `claude-opus-4-6`: Complex multi-document analysis, credit decisioning, high-stakes synthesis

---

### State Management: Zustand + React Query (TanStack Query)

**Decision:** Zustand for client-side UI state, React Query for all server state.

**Rationale:**
- React Query handles the majority of state: caching, background refetch, optimistic updates, pagination
- Zustand for lightweight UI-only state (modal open/close, sidebar state, user preferences)
- Avoids Redux boilerplate complexity for a mostly server-state-driven application
- React Query's devtools make debugging data flows straightforward
- Works seamlessly with Next.js App Router and server components

---

### Monorepo: Turborepo

**Decision:** Turborepo for monorepo management.

**Rationale:**
- Incremental builds and remote caching dramatically reduce CI times
- Native support for `apps/` and `packages/` structure matching MERIDIAN's architecture
- Works well with pnpm workspaces for efficient package management
- Parallel task execution across packages
- Used at scale by major engineering teams (Vercel, Hashicorp, etc.)

---

### Auth: NextAuth.js + RBAC

**Decision:** NextAuth.js for authentication, custom RBAC layer for authorization.

**Rationale:**
- NextAuth supports enterprise SSO providers (Okta, Microsoft Entra, Ping Identity) via OAuth/SAML
- Session management with JWT or database sessions
- Custom RBAC layer (see `shared/auth/`) maps institutional roles to MERIDIAN permissions
- Chinese wall enforcement handled at the data access layer, not just UI
- Audit logging for all authentication events for regulatory compliance

---

### Data Layer: tRPC + REST/OpenAPI

**Decision:** tRPC for internal frontend-backend communication, REST/OpenAPI for external integrations.

**Rationale:**
- tRPC provides end-to-end type safety between Next.js frontend and Node.js backend without code generation
- Eliminates entire category of runtime type errors in API contracts
- REST/OpenAPI for external API contracts (Bloomberg, Capital IQ, data vendors, client systems)
- OpenAPI schema generation enables SDK generation for third-party integrations

---

### Infrastructure: Docker + Kubernetes

**Decision:** Docker containers orchestrated on Kubernetes, deployed on cloud (AWS/Azure primary target).

**Rationale:**
- Financial institutions require deployment within their own cloud tenancy or on-premises
- Kubernetes provides the scalability, HA, and deployment control required
- Helm charts for environment-specific configuration
- Terraform for infrastructure-as-code
- Supports multi-region deployment for data residency requirements (EU, APAC)

---

## Multi-Device Strategy

### Desktop (Primary)
- Full feature set
- Data-dense, multi-panel layouts
- Keyboard shortcuts throughout
- 1440px+ optimized, min 1024px

### iPad (Meeting & Client-Facing)
- Optimized for touch interaction
- Presentation mode for client meetings
- Offline-capable for key views (client profiles, deal summaries)
- Same Next.js app with responsive breakpoints + touch-optimized components

### Mobile (Contextual Intelligence)
- Quick intelligence lookups on-the-go
- Push notifications for alerts and approvals
- Streamlined views — no data entry, all consumption and action
- React Native for native performance and biometric auth

---

## Module Federation Approach

Each MERIDIAN module (`modules/intelligence`, `modules/pipeline`, etc.) is:
- A self-contained TypeScript package with its own `package.json`
- Exports its own tRPC router that gets composed into the main API router
- Exports React components consumed by the web and tablet apps
- Has its own database schema namespace (Prisma schema per module, merged at build time)
- Has its own AI prompt library and orchestration logic
- Can be developed and tested in isolation

The shared packages (`shared/ai-core`, `shared/data-layer`, etc.) are imported as workspace dependencies.

---

## Security Architecture Summary

See [security-compliance.md](security-compliance.md) for full detail. Key principles:

1. **Zero trust** — every request authenticated and authorized regardless of origin
2. **Data classification** — all data tagged as Public, Internal, Confidential, or Restricted
3. **Chinese walls** — enforced at database query level, not just UI visibility
4. **Audit trails** — every data access, AI generation, and user action logged
5. **MNPI controls** — restricted list integration blocks access to restricted-company data for non-wall-crossed users
6. **Encryption** — TLS in transit, AES-256 at rest, field-level encryption for PII

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to Interactive (desktop) | < 2 seconds |
| API response (standard queries) | < 300ms |
| AI content generation start (TTFB) | < 800ms |
| Client profile load | < 1 second |
| Document search | < 500ms |
| Mobile app launch | < 3 seconds |
