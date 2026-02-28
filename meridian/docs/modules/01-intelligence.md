# Module 01: Meridian Intelligence — Client Hub

## Purpose

Meridian Intelligence is the relationship intelligence engine of the platform. It gives every banker a continuously updated, AI-synthesized picture of their clients — bringing together financials, news, deal history, contacts, and relationship context into a single, always-current view.

The defining question Intelligence answers: **"What do I need to know about this client, right now?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| MD / Director | Executive-level briefings, relationship health monitoring |
| VP / Coverage Banker | Daily client monitoring, meeting preparation |
| RM (Corporate Banking) | Portfolio management, annual review prep |
| IB Associate | Company research, deal context, new sector onboarding |
| Business Head | Coverage portfolio analytics, white space identification |

---

## Key Features

### 1. Client 360° Profile

The central view for any company in the platform. Aggregates:

- **Company Overview**: Description, sector, market cap / revenue, HQ location, key metrics
- **Financial Snapshot**: Revenue, EBITDA, net debt, leverage — current period and trend
- **Credit Profile**: Internal/external rating, rating trend, credit limit (if applicable)
- **Relationship Status**: Tier designation, coverage owner, last engagement, deal count
- **Recent Activity**: Latest news, filings, earnings, M&A announcements — AI summarized
- **Deal History**: All mandates, pitches, and transactions with this client
- **Contacts**: Key relationships with seniority map and last interaction dates
- **Open Items**: Active deals, outstanding follow-ups, upcoming meetings

**AI layer**: News and filings synthesized daily by Claude. Earnings releases auto-summarized within minutes of publication.

---

### 2. Relationship Health Score

A dynamic, AI-computed score (0–100) representing the strength and recency of the banking relationship.

**Score Inputs:**
- Recency of last client contact (meeting, call, email)
- Deal activity in last 12 months (mandates won, revenue)
- Breadth of product coverage (how many products are active)
- Senior contact engagement (C-suite vs. IR vs. legal)
- Competitive intelligence signals (competitor activity)

**Score Outputs:**
- `GREEN` (70–100): Strong, active relationship
- `AMBER` (40–69): Relationship needs nurturing
- `RED` (0–39): At risk — action required

**AI narrative**: For amber and red scores, Claude generates a 2–3 sentence explanation of why the score dropped and suggested recovery actions.

---

### 3. Meeting Briefing Generator

One click generates a comprehensive pre-meeting brief:

- **Company snapshot**: What this company does, key recent events
- **Financial highlights**: Last 2 quarters, guidance, analyst estimates
- **Relationship context**: History with this client, products in place, recent interactions
- **Contact intelligence**: Who you're meeting, their background, what they care about
- **Talking points**: 3–5 AI-suggested conversation starters relevant to current events
- **Open items**: Action items from previous meetings
- **Competitive context**: What competitors are doing with this client (if known)

Deliverable format: Printable 1-page brief + mobile-optimized card view.

**AI layer**: Claude synthesizes all available data into the brief using the `intelligence.meeting-brief` prompt. Generation takes < 15 seconds.

---

### 4. Portfolio Client Dashboard

The home view for coverage bankers and relationship managers:

- **Client cards**: Tile or list view of all covered companies
- **Health score distribution**: How many clients are green/amber/red
- **Recent activity feed**: Cross-portfolio news, interactions, deal events
- **White space view**: Which clients haven't been pitched on which products
- **Upcoming meetings**: Next 7 days meeting schedule with prep links
- **Revenue attribution**: YTD revenue by client, by product

Filterable by: sector, relationship tier, health score, product activity.

---

### 5. White Space Analysis

AI-assisted identification of cross-sell and upsell opportunities:

- Maps products in use against typical product sets for comparable clients
- Identifies product gaps vs. peer group (e.g., "comparable clients typically also use FX hedging")
- Surfaces opportunity signal based on company situation (leverage ratio → refinancing opportunity)
- Prioritizes by estimated fee opportunity

**AI layer**: Claude compares client's product usage profile against anonymized peer benchmarks and generates a prioritized opportunity list with rationale.

---

### 6. Annual Review Automation (Corporate Banking)

For RMs, annual credit and relationship reviews are a significant time investment. Intelligence automates:

- Pre-population of review template from current financial data
- AI-drafted relationship narrative (products, revenue, engagement quality)
- Updated financial analysis with period-over-period commentary
- Covenant and credit condition update

Human review and approval remains mandatory. AI provides the 80% draft.

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| News synthesis | Summarize daily news per company | claude-haiku-4-5 |
| Earnings summary | Extract and narrate key earnings metrics | claude-sonnet-4-6 |
| Meeting brief generation | Synthesize full brief from all sources | claude-sonnet-4-6 |
| Health score narrative | Explain score with context | claude-haiku-4-5 |
| White space analysis | Generate opportunity recommendations | claude-sonnet-4-6 |
| Annual review draft | Populate and narrate review document | claude-sonnet-4-6 |
| Trigger event classification | Classify and score trigger events for deal relevance | claude-haiku-4-5 |

---

## Data Requirements

### Internal Data
- Company master data (name, sector, ratings, coverage assignments)
- Deal history (all past pitches and mandates)
- Interaction logs (meetings, calls, emails if CRM-synced)
- Credit data (if applicable, from Credit module)
- User coverage assignments and preferences

### External Data
- Market data: prices, spreads, indices (Bloomberg / FactSet)
- News: company-specific and sector news (Reuters, Bloomberg News)
- Public filings: 10-K, 10-Q, 8-K, press releases (SEC, regulatory databases)
- Analyst research: earnings estimates, price targets, ratings changes
- M&A databases: announced transactions (Refinitiv, CapIQ)

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Pipeline | Client profile links to open deals and pipeline value |
| Forge | "Generate pitch" action launches Forge with client context pre-loaded |
| Signal | Trigger events and news feed from Signal enriches Intelligence |
| Credit | Credit profile and EWI score surfaced within client 360° |
| Connect | Meetings and action items synced from Connect to client profile |
| Memory | Past pitch books, memos, and transaction history searchable |

---

## UX Principles for this Module

- **Single scroll**: The full 360° profile should be navigable in a single responsive page
- **Progressive disclosure**: Summary cards expand to detail on demand — don't overwhelm
- **Freshness indicators**: Every data point shows "last updated" to calibrate trust
- **Action anchors**: Every section surfaces a relevant action (generate brief, log interaction, start pitch)
- **Mobile-first for briefings**: Meeting briefs must be readable on mobile before a meeting
