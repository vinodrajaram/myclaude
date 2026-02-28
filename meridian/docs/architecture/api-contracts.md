# MERIDIAN — API Design Principles & Contracts

## Overview

MERIDIAN uses a layered API strategy: tRPC for internal type-safe frontend-backend communication, and REST/OpenAPI for external integrations and third-party data vendor contracts.

---

## Internal API: tRPC

### Design Principles

1. **End-to-end type safety**: Types flow from database schema → tRPC procedure → React client with zero code generation
2. **Module isolation**: Each module exports its own tRPC router, composed into a root router
3. **Input validation**: All inputs validated with Zod schemas
4. **Error handling**: Typed error codes with client-displayable messages
5. **Auth middleware**: Every procedure protected by auth context; permission check built into procedure layer

### Router Structure

```typescript
// Root router composition
export const appRouter = createTRPCRouter({
  intelligence: intelligenceRouter,
  pipeline: pipelineRouter,
  forge: forgeRouter,
  signal: signalRouter,
  credit: creditRouter,
  connect: connectRouter,
  memory: memoryRouter,
  // Shared
  auth: authRouter,
  user: userRouter,
  org: orgRouter,
});
```

### Example Procedure Pattern

```typescript
// modules/intelligence/router.ts
export const intelligenceRouter = createTRPCRouter({
  // Query: fetch company profile
  getCompanyProfile: protectedProcedure
    .input(z.object({ companyId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await ctx.auth.assertPermission('intelligence:company:read');
      return intelligenceService.getCompanyProfile(input.companyId, ctx.userId);
    }),

  // Query with pagination
  listCompanies: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      sector: z.string().optional(),
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      await ctx.auth.assertPermission('intelligence:company:list');
      return intelligenceService.listCompanies(input, ctx.userId);
    }),

  // Mutation: generate meeting brief (AI call)
  generateMeetingBrief: protectedProcedure
    .input(z.object({
      companyId: z.string().uuid(),
      contactId: z.string().uuid(),
      meetingDate: z.string().datetime(),
      objective: z.string().max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.auth.assertPermission('intelligence:brief:generate');
      return intelligenceService.generateMeetingBrief(input, ctx.user);
    }),
});
```

### Standard Response Shapes

```typescript
// Paginated list
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// AI generation response (streaming via subscription or single response)
interface AIGenerationResponse {
  id: string;
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  generatedAt: DateTime;
  promptId: string;
}

// Standard error shape (TRPCError)
interface APIError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR';
  message: string;          // User-displayable message
  details?: unknown;        // Debug details (only in development)
}
```

---

## External API: REST / OpenAPI

For external consumers (data vendor integrations, bank system integrations, third-party connections).

### Design Principles

1. **RESTful resource semantics**: Nouns for resources, HTTP verbs for actions
2. **Versioned**: `/v1/` prefix, deprecation notices, minimum 12-month sunset window
3. **OpenAPI 3.1**: All endpoints documented in OpenAPI spec with schemas
4. **Pagination**: Cursor-based pagination for all list endpoints
5. **Rate limiting**: Per-API-key rate limits with standard headers
6. **Idempotency**: POST/PATCH endpoints support `Idempotency-Key` header

### URL Structure

```
https://api.meridian.{institution}.com/v1/{resource}

Examples:
GET  /v1/companies/{id}
GET  /v1/companies?search=apple&sector=technology
POST /v1/deals
PUT  /v1/deals/{id}
GET  /v1/deals/{id}/documents
POST /v1/ai/generate/meeting-brief
GET  /v1/signals?type=ma_announcement&since=2025-01-01
```

### Authentication

External API uses API keys with scoped permissions:
```
Authorization: Bearer mk_live_xxxxx
```

API keys:
- Organization-scoped
- Permission-scoped (read-only, read-write, AI features, admin)
- Expirable with configurable TTL
- Rotatable without downtime

### Standard Response Envelope

```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_01JXZ...",
    "timestamp": "2025-03-15T09:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "COMPANY_NOT_FOUND",
    "message": "Company with ID 'abc123' not found",
    "requestId": "req_01JXZ...",
    "documentation": "https://docs.meridian.io/errors/COMPANY_NOT_FOUND"
  }
}
```

### Pagination (Cursor-based)

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMyJ9",
    "hasMore": true,
    "total": 847
  }
}

// Next page request:
GET /v1/companies?cursor=eyJpZCI6IjEyMyJ9&limit=20
```

### Rate Limiting Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1710494400
X-RateLimit-Window: 3600
```

---

## Data Vendor Integration Contracts

### Bloomberg Terminal / Bloomberg API

- **Protocol**: Bloomberg B-PIPE or Bloomberg Server API
- **Data consumed**: Real-time market data, company financials, news
- **Authentication**: Bloomberg BUID credentials
- **Notes**: Requires Bloomberg license at institution level; MERIDIAN acts as an approved application

### Capital IQ / FactSet

- **Protocol**: REST API
- **Data consumed**: Company financial data, M&A transaction history, peer groups
- **Authentication**: API key provided by data vendor
- **Notes**: License and usage terms governed by institution's data agreement

### Reuters / Bloomberg News

- **Protocol**: Webhook push + REST pull
- **Data consumed**: News articles, regulatory filings, press releases
- **Authentication**: License key
- **Notes**: AI summarization is permitted under standard enterprise data licenses

### Internal Bank Systems

Each institution integration is custom-configured:

| System Type | Integration Pattern | Auth Method |
|-------------|-------------------|-------------|
| Core Banking | REST API or DB view | mTLS + service account |
| CRM (Salesforce, Dynamics) | REST API | OAuth 2.0 client credentials |
| Email (Exchange/O365) | Graph API | OAuth 2.0 + delegated permissions |
| Document Management (SharePoint) | Graph API | OAuth 2.0 |
| Credit System | REST API or file-based | Service account |
| Risk System | REST API | mTLS |

---

## Webhook Contracts

MERIDIAN emits webhooks for key events to allow integration with bank systems:

### Webhook Payload Structure

```json
{
  "id": "evt_01JXZ...",
  "type": "deal.stage_changed",
  "timestamp": "2025-03-15T09:30:00Z",
  "organizationId": "org_abc",
  "data": {
    "dealId": "deal_xyz",
    "previousStage": "PITCHED",
    "newStage": "MANDATE",
    "changedBy": "user_123",
    "deal": { ... }
  },
  "version": "1.0"
}
```

### Key Event Types

| Event | Description |
|-------|-------------|
| `deal.created` | New deal added to pipeline |
| `deal.stage_changed` | Deal moves to new stage |
| `deal.mandate_awarded` | Mandate confirmed |
| `covenant.breach_detected` | Covenant breach identified |
| `covenant.headroom_tight` | Covenant headroom below threshold |
| `signal.trigger_event` | M&A trigger or other deal signal detected |
| `credit.ewi_alert` | EWI score deterioration |
| `document.created` | New document added |

### Webhook Security

- HMAC-SHA256 signature in `X-Meridian-Signature` header
- Webhook URL must be HTTPS
- 3 retry attempts with exponential backoff on failure
- Dead letter queue for failed webhooks with manual replay
