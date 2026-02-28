# MERIDIAN — Lessons & Patterns

This file captures patterns, decisions, and lessons learned as the platform is built. Updated after any significant course correction.

---

## Architecture Decisions Log

### 2026-02-28 — Initial Setup

**Decision: Turborepo + pnpm workspaces for monorepo**
- Rationale: Incremental builds and remote caching reduce CI times significantly
- Alternative considered: nx — more feature-rich but heavier for this team size
- Status: Committed

**Decision: tRPC for internal API, REST/OpenAPI for external**
- Rationale: End-to-end type safety without code gen for internal use; OpenAPI for ecosystem compatibility
- Alternative considered: GraphQL — rejected due to complexity overhead for this use case
- Status: Committed

**Decision: claude-sonnet-4-6 as default AI model**
- Rationale: Best balance of capability and latency for banking document tasks
- Haiku for simple lookups, Opus for complex multi-document analysis
- Status: Committed

---

## Development Patterns

*(Add patterns here as they emerge during implementation)*

---

## Mistakes to Avoid

*(Add after any course corrections)*

---

## Open Questions

- Financial data vendor licensing — how to handle in development without Bloomberg/FactSet subscription?
- Real-time covenant monitoring — webhook-based or polling from bank systems?
- AI document extraction accuracy thresholds — what % accuracy is acceptable before human review required?
