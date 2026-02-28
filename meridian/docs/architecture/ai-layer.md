# MERIDIAN — AI Layer Architecture

## Overview

The AI layer is the intelligence engine of MERIDIAN. It is not a feature — it is infrastructure. Every module calls into the AI layer for synthesis, generation, extraction, and reasoning. This document defines how AI is architected, orchestrated, and governed across the platform.

---

## AI Layer Principles

1. **Consistency** — Every AI interaction goes through `shared/ai-core`. No module calls Claude directly with ad hoc prompts.
2. **Observability** — Every AI call is logged with input, output, latency, token counts, and model used.
3. **Reviewability** — AI outputs are always surfaced as drafts for human review. MERIDIAN never acts autonomously without human confirmation.
4. **Context-awareness** — The AI layer knows user identity, role, and current context. Prompts are constructed with full situational context.
5. **Cost awareness** — Model routing logic uses the cheapest model capable of the task.

---

## Claude API Integration

### Primary Model: `claude-sonnet-4-6`

Used for all standard AI features:
- Content generation (pitch books, memos, briefs)
- Document Q&A and analysis
- Intelligent synthesis of market data
- Chat and conversational interfaces

### Fast Model: `claude-haiku-4-5`

Used for latency-sensitive, lower-complexity tasks:
- Autocomplete suggestions
- Short-form classification (sentiment, topic tagging)
- Quick entity extraction
- Real-time UI feedback (e.g., "is this a valid company name?")

### Power Model: `claude-opus-4-6`

Used for complex, high-stakes reasoning:
- Full credit memo analysis
- Multi-document cross-referencing (e.g., comparing 5 years of credit files)
- Complex financial narrative synthesis
- Compliance-sensitive decisions

---

## AI Core Architecture (`shared/ai-core/`)

```
shared/ai-core/
├── client.ts              # Anthropic SDK client singleton
├── router.ts              # Model routing logic (task → model selection)
├── context-builder.ts     # User/role/module context injection
├── prompt-registry/       # Version-controlled prompt library
│   ├── intelligence/
│   ├── pipeline/
│   ├── forge/
│   ├── signal/
│   ├── credit/
│   ├── connect/
│   └── memory/
├── tools/                 # Claude tool definitions (function calling)
│   ├── financial-data.ts
│   ├── document-search.ts
│   ├── web-search.ts
│   └── calculations.ts
├── streaming.ts           # SSE streaming handler for real-time generation
├── middleware/
│   ├── audit-logger.ts    # Log every AI call
│   ├── pii-filter.ts      # Strip PII from logs
│   ├── cost-tracker.ts    # Track token usage per user/module
│   └── rate-limiter.ts    # Per-user and per-org rate limiting
└── types.ts               # Shared AI types
```

---

## Prompt Architecture

### Prompt Registry

All prompts are version-controlled in `shared/ai-core/prompt-registry/`. Each prompt:
- Has a unique ID and semantic version
- Is typed (inputs and outputs)
- Includes a test suite with expected behaviors
- Can be A/B tested via feature flags

### Prompt Structure

Every MERIDIAN prompt follows this structure:

```
[SYSTEM CONTEXT]
You are MERIDIAN, an AI assistant embedded in a banking intelligence platform.
You are assisting {role} at {institution}.
Current module: {module}
Current date: {date}

[USER CONTEXT]
{user-specific context: coverage universe, active deals, preferences}

[TASK INSTRUCTION]
{specific task instruction}

[INPUT DATA]
{structured data, documents, or query}

[OUTPUT FORMAT]
{required output structure, tone, length}

[CONSTRAINTS]
{compliance constraints, tone requirements, factual grounding rules}
```

### Example: Meeting Brief Prompt

```typescript
// prompt-registry/intelligence/meeting-brief.ts
export const meetingBriefPrompt = {
  id: 'intelligence.meeting-brief.v2',
  model: 'claude-sonnet-4-6',
  systemPrompt: `You are a research analyst embedded in MERIDIAN,
    an AI-first banking platform. Your role is to prepare concise,
    accurate, and actionable pre-meeting briefs for investment bankers.`,
  userPromptTemplate: `
    Prepare a pre-meeting brief for {{bankerName}} ({{bankerRole}})
    ahead of their meeting with {{contactName}} ({{contactTitle}})
    at {{companyName}} on {{meetingDate}}.

    Recent news about the company:
    {{recentNews}}

    Company financials summary:
    {{financialsSummary}}

    Open action items:
    {{openItems}}

    Meeting objective: {{meetingObjective}}

    Format the brief as:
    1. One-line company summary
    2. Recent developments (3-5 bullet points)
    3. Key financial metrics
    4. Relationship context
    5. Suggested talking points (3-5 bullets)
    6. Open items to address

    Tone: Professional, concise. Max 400 words.`,
};
```

---

## Tool Use (Function Calling)

Claude tools enable the AI to fetch live data during generation, making outputs grounded in current information.

### Registered Tools

**`search_company_data`**
- Fetches company financials, ratings, and key metrics from internal database
- Used in: Intelligence, Credit, Forge

**`search_documents`**
- Semantic search across the document vault and Memory module
- Used in: Memory, Forge, Credit

**`fetch_market_data`**
- Real-time market data: prices, spreads, indices
- Used in: Signal, Forge

**`get_deal_history`**
- Retrieves all past deals and pitches for a company
- Used in: Intelligence, Pipeline, Forge

**`get_covenant_data`**
- Fetches current covenant levels and actuals
- Used in: Credit

**`search_precedents`**
- Searches comparable transactions database
- Used in: Forge, Signal, Pipeline

### Tool Call Flow

```
User Request
     │
     ▼
Context Builder (adds user/role/session context)
     │
     ▼
Claude API Call (with tools registered)
     │
     ▼
Claude decides to call tool(s) → Tool execution → Results fed back
     │
     ▼
Claude generates final response (grounded in tool results)
     │
     ▼
Response streamed to client → Audit logged
```

---

## Streaming Architecture

All content generation in Forge, Intelligence briefings, and Credit memos uses streaming to provide immediate visual feedback.

```typescript
// streaming.ts
export async function streamAIResponse(
  prompt: PromptConfig,
  onChunk: (chunk: string) => void,
  onComplete: (metadata: StreamMetadata) => void
) {
  const stream = await anthropic.messages.stream({
    model: prompt.model,
    messages: prompt.messages,
    tools: prompt.tools,
    max_tokens: prompt.maxTokens,
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      onChunk(chunk.delta.text);
    }
  }

  const usage = await stream.finalUsage();
  await auditLogger.log({ prompt, usage });
  onComplete({ tokens: usage, duration: Date.now() - startTime });
}
```

---

## Context Injection

The context builder enriches every AI request with:

| Context Type | Contents |
|-------------|----------|
| User Identity | Name, role, seniority, institution |
| Coverage Universe | List of companies/sectors this user covers |
| Active Deals | Current deal pipeline for this user |
| Current Module | Which module the request originates from |
| Restriction Status | Whether user is wall-crossed (affects data access) |
| Preferences | Preferred output format, verbosity, language |
| Session Context | Recent actions in current session |

---

## Audit Logging

Every AI call is logged to the audit store:

```typescript
interface AIAuditRecord {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  module: string;
  promptId: string;
  promptVersion: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  completionStatus: 'success' | 'error' | 'timeout';
  // Input and output are stored separately with PII-filtered versions
  inputRef: string;    // Reference to input log (PII filtered)
  outputRef: string;   // Reference to output log
}
```

Audit logs are:
- Retained for 7 years (regulatory requirement)
- Immutable once written
- Exportable for regulatory examination
- Accessible to compliance officers

---

## Cost Management

Token cost tracking per user, per module, per organization:

- Daily/monthly budget limits configurable per org
- Alerts at 80% of budget consumed
- Model downgrade fallback if budget exceeded (sonnet → haiku)
- Cost attribution dashboard for finance teams
- Cost per feature analytics to guide optimization

---

## AI Safety Controls

1. **Hallucination mitigation**: All factual claims grounded via tool calls; AI instructed to state uncertainty
2. **MNPI awareness**: Prompts include restricted list status; AI instructed not to synthesize from restricted-company data
3. **Output review**: All AI outputs are drafts — no autonomous action taken on AI output
4. **Prompt injection defense**: User-provided content is sanitized before inclusion in prompts
5. **Confidentiality**: AI outputs never logged to external systems; all processing within institutional cloud boundary
