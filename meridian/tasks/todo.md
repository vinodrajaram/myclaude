# MERIDIAN — Build Plan

## Project Status: Context & Documentation Phase Complete

All foundation documentation has been written. Ready to begin implementation.

---

## Phase 0: Foundation ✅ Complete

- [x] Project naming: MERIDIAN
- [x] Folder structure created
- [x] README.md
- [x] docs/vision.md
- [x] docs/personas.md
- [x] docs/capabilities.md
- [x] docs/architecture/overview.md
- [x] docs/architecture/ai-layer.md
- [x] docs/architecture/data-model.md
- [x] docs/architecture/security-compliance.md
- [x] docs/architecture/api-contracts.md
- [x] docs/modules/01-intelligence.md
- [x] docs/modules/02-pipeline.md
- [x] docs/modules/03-forge.md
- [x] docs/modules/04-signal.md
- [x] docs/modules/05-credit.md
- [x] docs/modules/06-connect.md
- [x] docs/modules/07-memory.md
- [x] docs/design/design-system.md
- [x] docs/design/ux-principles.md
- [x] docs/design/responsive-strategy.md

---

## Phase 1: Monorepo & Shared Infrastructure

### 1.1 Monorepo Setup

- [ ] Initialize Turborepo monorepo
- [ ] Configure pnpm workspaces
- [ ] Set up `tsconfig.json` base config (strict mode)
- [ ] Set up `eslint` and `prettier` shared config
- [ ] Set up GitHub Actions CI pipeline

### 1.2 Shared Packages

- [ ] `shared/design-system`: Tailwind config, tokens, base shadcn components
- [ ] `shared/ai-core`: Claude API client, prompt registry scaffold, streaming handler
- [ ] `shared/data-layer`: Prisma schema scaffold, tRPC context, API client types
- [ ] `shared/auth`: NextAuth config, RBAC types and middleware
- [ ] `shared/utils`: Date formatting, number formatting, validation helpers

### 1.3 Database Setup

- [ ] PostgreSQL schema design (Prisma)
- [ ] Core entity migrations: Organization, User, Company, Contact, Deal, Document
- [ ] Redis cache configuration
- [ ] pgvector extension setup for semantic search

---

## Phase 2: Web App Shell

### 2.1 Next.js App Setup

- [ ] Initialize `apps/web` with Next.js 14 App Router
- [ ] Configure Tailwind + shadcn/ui with MERIDIAN design tokens (dark mode default)
- [ ] Implement navigation shell (sidebar + top bar)
- [ ] Implement command palette (`Cmd+K`)
- [ ] Set up tRPC client configuration
- [ ] Implement auth flow (NextAuth + mock SSO for dev)
- [ ] Implement RBAC context provider
- [ ] Set up React Query + Zustand

### 2.2 Module Routing

- [ ] `/intelligence/*` routes
- [ ] `/pipeline/*` routes
- [ ] `/forge/*` routes
- [ ] `/signal/*` routes
- [ ] `/credit/*` routes
- [ ] `/connect/*` routes
- [ ] `/memory/*` routes

---

## Phase 3: Module 01 — Intelligence (Client Hub)

**Target personas**: Coverage Banker, VP/Director, MD, RM

### 3.1 Company Database

- [ ] Company list view with search and filters
- [ ] Company profile page (skeleton)
- [ ] Bloomberg/FactSet data connector (or mock data for dev)
- [ ] Company financials display component

### 3.2 Client 360° Profile

- [ ] Overview section (company details, key metrics)
- [ ] Relationship health score component
- [ ] Recent news section (with AI synthesis)
- [ ] Deal history section
- [ ] Contacts section
- [ ] Open items section

### 3.3 Meeting Brief Generator

- [ ] Meeting brief prompt design and implementation
- [ ] Brief generation UI with streaming output
- [ ] Mobile-optimized brief view
- [ ] Brief PDF export

### 3.4 Portfolio Dashboard

- [ ] Client portfolio overview (cards + list toggle)
- [ ] Health score distribution summary
- [ ] White space analysis view
- [ ] Recent activity feed across portfolio

---

## Phase 4: Module 02 — Pipeline (Deal Origination)

**Target personas**: VP, Coverage Banker, MD

### 4.1 Deal Records

- [ ] Deal creation form
- [ ] Deal list view
- [ ] Deal kanban board (stage-based)
- [ ] Deal detail view

### 4.2 Conflict Clearance

- [ ] ConflictCheck creation — triggered at deal creation (mandatory) and on-demand
- [ ] AI conflict search: scan deals, mandates, relationships, CRM history, personal disclosures
- [ ] Conflict report UI: structured findings with severity, evidence, suggested resolution
- [ ] IBC review interface: per-finding determination, dismiss/accept/escalate
- [ ] IBC overall decision: CLEARED / CONDITIONALLY_CLEARED / BLOCKED with rationale
- [ ] ConflictCondition enforcement (Chinese wall integration with access control layer)
- [ ] Condition monitoring: breach detection and IBC alert
- [ ] IBC Compliance Dashboard: pending queue, active conditions, conflict history, personal disclosure register
- [ ] Personal conflict disclosure form and register
- [ ] Annual disclosure renewal reminders
- [ ] Conflicts register export (CSV/PDF for regulatory inspection)
- [ ] RBAC: IBC role with conflict clearance permissions

### 4.3 Insider List Management

- [ ] Insider list creation on mandate stage or MNPI event
- [ ] Add/remove insider UI (internal users + external persons)
- [ ] Acknowledgement workflow (in-app + email)
- [ ] Compliance officer dashboard (all open lists, outstanding acknowledgements)
- [ ] ESMA XML export generator
- [ ] CSV and PDF export with tamper-detection hash
- [ ] Insider list audit log (separate from general audit)
- [ ] Retention enforcement (5-year floor, block deletion)
- [ ] Integration with restricted list: flag insiders when company hits restricted list

### 4.3 Analytics

- [ ] Pipeline value by stage chart
- [ ] Win rate tracking
- [ ] Revenue forecast
- [ ] Banker performance view (for managers)

### 4.3 AI Deal Ideas

- [ ] Deal idea generation from trigger events
- [ ] Idea review and conversion to deal record

---

## Phase 5: Module 03 — Forge (Content Factory)

**Target personas**: IB Analyst, Associate, Credit Analyst

### 5.1 Document Editor

- [ ] Rich text editor (Tiptap or Lexical)
- [ ] Section-based document structure
- [ ] Collaborative editing (Yjs or Liveblocks)
- [ ] Version history

### 5.2 AI Generation

- [ ] Pitch book generator UI + prompt
- [ ] Briefing note generator
- [ ] Financial narrative generator
- [ ] Inline AI chat panel

### 5.3 Template Library

- [ ] Template browser
- [ ] Template application
- [ ] Template management (admin)

### 5.4 Export Engine

- [ ] PowerPoint export (PptxGenJS or server-side)
- [ ] Word export (docx library)
- [ ] PDF export with watermarking

---

## Phase 6: Module 04 — Signal (Market Intelligence)

**Target personas**: VP, MD, Product Banker

### 6.1 Intelligence Feed

- [ ] Personalized feed UI
- [ ] News ingestion pipeline (RSS/API connectors)
- [ ] AI synthesis and relevance scoring
- [ ] Trigger event detection

### 6.2 Sector Monitor

- [ ] Sector dashboard
- [ ] M&A activity tracker
- [ ] Earnings summary

### 6.3 Transaction Comps

- [ ] Comps database UI
- [ ] Search and filter
- [ ] Export to Forge integration

---

## Phase 7: Shared Infrastructure (Ongoing)

- [ ] Full audit logging system
- [ ] RBAC and Chinese wall enforcement
- [ ] AI audit trail
- [ ] Notification system
- [ ] API rate limiting
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Posthog or Mixpanel)

---

## Phase 7: Module 09 — Talent (Resource Intelligence)

*Phase 2*

### 7.1 Activity Event Infrastructure

- [ ] Activity event emitter in each module (Forge, Pipeline, Connect, Intelligence, Credit, Memory)
- [ ] Event schema: userId, dealId?, companyId?, moduleId, eventType, timestamp, durationMs
- [ ] Event consumer in Talent module: classify events to ActivityType + compute duration
- [ ] TimeEntry creation from inferred events (confidence scored)

### 7.2 AI-Inferred Time Log

- [ ] Daily analyst review view: list of inferred entries for confirmation
- [ ] One-tap confirm, drag-to-reassign deal, manual activity type override
- [ ] "Dark time" attribution prompts (calendar gap detection via O365/Google)
- [ ] Bulk confirm for clean days
- [ ] Mobile-optimised daily review card

### 7.3 Individual Analyst Dashboard

- [ ] This week overview: total hours, by-deal breakdown, by-activity breakdown
- [ ] Deal exposure history (all deals contributed to, hours-weighted)
- [ ] Activity mix trend (rolling 12 months)
- [ ] Skill / experience profile (deal type, sector, activity diversity)
- [ ] Wellbeing signals: hours intensity, late-night pattern, weekend work
- [ ] "My data" transparency view: what is stored, who can see it

### 7.4 Manager Capacity Dashboard

- [ ] Team capacity table (current week vs. baseline vs. peer)
- [ ] Capacity status badges (HIGH / MED / LOW / CRITICAL)
- [ ] Wellbeing alert cards with deal context and suggested action
- [ ] Deal staffing view: who is on what, current week allocation
- [ ] AI weekly team narrative
- [ ] Manager action logging on wellbeing alerts

### 7.5 Deal Time Economics

- [ ] Time rollup per deal (by seniority, by activity type)
- [ ] Pre-mandate vs. post-mandate split
- [ ] Fee revenue integration (SoR connector or manual input)
- [ ] Revenue-per-junior-hour and time-weighted margin computation
- [ ] Per-deal economics card in Pipeline deal view

### 7.6 Business Strategy Analytics

- [ ] Revenue-per-analyst-hour by deal type, sector, product (rolling 12m)
- [ ] Pitch efficiency: hours invested vs. conversion rate vs. mandated deals
- [ ] AI pattern analysis and strategic commentary
- [ ] Headcount demand forecast from pipeline + historical hours data
- [ ] Export to PDF for management reporting

### 7.7 Skill & Experience Tracker

- [ ] Per-analyst experience profile (hours-weighted deal type / sector / activity)
- [ ] AI development gap analysis vs. target profile for seniority level
- [ ] Performance review data narrative (AI-drafted, manager-reviewed)
- [ ] Rotation planning recommendations

---

## Phase 8: Module 08 — Compliance (In-Business Compliance Center)

*Phase 1 (conflict clearance core) + Phase 2 (conduct monitoring, policy Q&A, certification tracker)*

### 8.1 IBC Operations Dashboard

- [ ] Dashboard shell with summary tiles (conflicts, insider lists, wall crossings, disclosures)
- [ ] Pending queue with SLA countdown and filters
- [ ] At-risk items panel (overdue, expiring, missing checks)
- [ ] Rolling 30-day metrics (turnaround, clear rate, condition count)

### 8.2 Conflict Clearance Center

- [ ] Conflict check intake (triggered from Pipeline deal creation + on-demand)
- [ ] AI conflict search implementation (deals, mandates, relationships, CRM history, personal disclosures)
- [ ] Conflict report UI: per-finding cards with severity, evidence, AI suggestion
- [ ] IBC per-finding determination (accept / dismiss / escalate to L2)
- [ ] IBC overall decision workflow (CLEARED / CONDITIONALLY_CLEARED / BLOCKED)
- [ ] Escalation to Line 2 queue
- [ ] Conflict condition creation and type configuration
- [ ] Chinese wall condition enforcement (integration with data access layer)
- [ ] Banker recusal condition enforcement (deal data access block)
- [ ] Condition breach detection and IBC alert
- [ ] Condition periodic review task generation
- [ ] Conflict history register with full search and export

### 8.3 Insider List Oversight

- [ ] Cross-portfolio insider list dashboard (IBC view across all deals)
- [ ] AI gap detection (access logs vs. insider list cross-reference)
- [ ] Unacknowledged insider tracking and escalation
- [ ] ESMA XML export generator
- [ ] Export log with tamper-detection hash

### 8.4 Chinese Wall & Wall Crossing Management

- [ ] Wall creation interface (participants, scope, duration)
- [ ] Wall crossing request workflow (banker submission → IBC review → decision)
- [ ] Time-limited access enforcement and auto-expiry
- [ ] Crossing register with history and expiry alerts

### 8.5 Restricted List Management

- [ ] Restricted list CRUD with downstream access control enforcement
- [ ] AI trigger detection for restricted list candidates
- [ ] Restricted list access event log (permitted and blocked)
- [ ] Restricted list audit export

### 8.6 Personal Conflict Disclosure Register

- [ ] Disclosure submission form (banker self-declaration)
- [ ] IBC review and acknowledgement workflow
- [ ] Deal-team conflict cross-check on deal team assignment
- [ ] Renewal tracking and reminder notifications
- [ ] Disclosure register export

### 8.7 Conduct Risk Monitoring (Phase 2)

- [ ] Access pattern anomaly detection (MNPI access without mandate)
- [ ] Workflow gap monitoring (deals without conflict checks, insider lists)
- [ ] Cross-wall access attempt detection (already in wall enforcement; add to Compliance view)
- [ ] Weekly AI conduct risk narrative
- [ ] IBC escalation to Line 2 workflow for conduct findings

### 8.8 Policy Library & Regulatory Q&A (Phase 2)

- [ ] Policy document store (versioned, categorised)
- [ ] AI Q&A interface with citation against policy library
- [ ] Policy update notification workflow
- [ ] AI "what changed" brief on policy update

### 8.9 Regulatory Reporting & Export (Phase 1 basics, Phase 2 full)

- [ ] Conflict register export (CSV/PDF)
- [ ] Insider list export (CSV/PDF/ESMA XML) — Phase 1
- [ ] Wall crossing history export
- [ ] Regulatory examination pack assembly (Phase 2)
- [ ] Monthly compliance summary PDF (Phase 2)

### 8.10 Certification Tracker (Phase 2)

- [ ] Certification records per banker (FCA, FINRA, internal)
- [ ] Expiry alerts (90/30/7 day)
- [ ] Annual attestation tracking
- [ ] Missing attestation escalation to IBC

---

## Phase 9: Module 05 — Credit (Risk Co-pilot)

*Phase 2 — post Phase 1 MVP*

- [ ] Credit memo drafting
- [ ] Financial spreading (AI extraction)
- [ ] Covenant monitoring dashboard
- [ ] Portfolio risk dashboard
- [ ] EWI system

---

## Phase 9: Module 06 — Connect (Workflow & Comms)

*Phase 2*

- [ ] Task management
- [ ] Approval workflows
- [ ] CRM auto-logging
- [ ] Calendar integration
- [ ] Notification hub

---

## Phase 10: Module 07 — Memory (Knowledge Base)

*Phase 2*

- [ ] Document vault and storage
- [ ] Vector embedding pipeline
- [ ] Semantic search interface
- [ ] Precedent transaction database
- [ ] Expert finder

---

## Phase 11: Mobile App

*Phase 2 / 3*

- [ ] Initialize `apps/mobile` with Expo
- [ ] Navigation structure (bottom tabs)
- [ ] Core views: Intelligence feed, Pipeline summary, Notifications
- [ ] Meeting brief mobile view
- [ ] Push notifications
- [ ] Biometric auth

---

## Decisions Needed Before Implementation Starts

1. **Data vendors**: Bloomberg vs. FactSet vs. mock data for initial development?
2. **Auth**: Real SSO provider for dev (Okta sandbox) or mock auth?
3. **Deployment target**: Which cloud provider? (AWS / Azure preference)
4. **Phase 1 scope**: Build all 4 Phase 1 modules simultaneously or sequential?
5. **Mobile timing**: Start React Native in parallel with web, or after web MVP?

---

## Review Notes

*(Updated as modules are built and shipped)*
