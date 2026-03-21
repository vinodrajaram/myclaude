# Beehive

**Privacy-First AI Meeting Intelligence for Bankers**

Beehive captures Zoom calls, generates AI summaries and action items, and builds a connected knowledge graph linking meetings, people, deals, and commitments over time.

## What it does

- Connects to Zoom via OAuth and receives `recording.completed` webhooks
- Fetches VTT transcripts, sends to Gemini Vertex AI for summarization
- Extracts action items with owners and due dates
- Builds a semantic knowledge layer (entities + vector embeddings) across all calls
- Surfaces relevant prior meeting context when preparing for new calls
- Drafts follow-up emails pre-populated with summary and action items

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | Next.js (TypeScript), deployed on Cloud Run |
| LLM | Gemini 1.5 Pro / 2.0 Flash via Vertex AI |
| Embeddings | text-embedding-004 |
| Database | Cloud SQL (PostgreSQL) + pgvector |
| Token encryption | Cloud KMS |
| Auth | Bank SSO (OIDC/SAML) |
| Transcription | Zoom built-in VTT (no external STT service) |
| Notifications | Server-Sent Events (SSE) |

## Docs

- [`docs/design.md`](docs/design.md) — Full product & architecture design doc
- [`docs/test-plan.md`](docs/test-plan.md) — Test plan covering critical paths, edge cases, unit + integration + E2E targets
- [`DESIGN.md`](DESIGN.md) — Design system: color tokens, typography, spacing, components

## Status

Planning phase. No code yet.
