# Module 09: Meridian Talent — Resource Intelligence

## Purpose

Meridian Talent makes the human capital layer of a banking franchise legible for the first time. It tracks how junior bankers spend their time, synthesises that data into productivity and capacity signals for managers, and gives business heads the analytics to understand where talent is being most and least efficiently deployed across deal types, sectors, and products.

Today this picture doesn't exist. Analysts log hours in fragmented spreadsheets (if at all), managers guess at capacity, and business heads make resourcing decisions based on intuition. MERIDIAN makes it structured, low-friction, and AI-driven.

The defining question Talent answers: **"Where is our people's time going, and is it being used well?"**

---

## Design Philosophy

### Not a surveillance tool

Time tracking in banking has historically been resisted because it felt punitive — a mechanism for extracting more hours rather than improving working conditions. Meridian Talent is explicitly designed against this pattern:

- **The analyst benefits directly**: visibility into their own workload, deal exposure, and skill development
- **Transparency is symmetric**: every analyst can see their own full data; managers see aggregate views first and individual drilldown requires context
- **Wellbeing is a first-class output**: the module surfaces burnout risk, not just productivity metrics
- **Input is minimal**: AI infers the majority of time from MERIDIAN platform activity; manual entry fills the gaps

### Hybrid time inference

MERIDIAN already knows where bankers are spending their time within the platform. Talent makes this explicit:

- Time spent in **Forge** editing a pitch book → attributed to that deal, activity type: `CONTENT_CREATION`
- Time spent in **Pipeline** on a deal record → attributed to that deal, activity type: `DEAL_MANAGEMENT`
- Time spent in **Intelligence** on a client profile → attributed to that client, activity type: `CLIENT_RESEARCH`
- Meetings logged in **Connect** → attributed to client/deal, activity type: `CLIENT_MEETING`
- Time spent in **Credit** on a credit analysis → attributed to that deal, activity type: `CREDIT_ANALYSIS`

For work done outside MERIDIAN (Excel models, email, offline decks), the AI prompts for attribution with a lightweight card — no lengthy timesheets:

> *"You worked in Excel for 2h 40m yesterday evening. What was this for?*
> *[Project Neptune — financial model]  [Project Falcon — valuation]  [Personal / other]*"

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| **IB Analyst** | Log time, view own workload balance, track deal exposure and skill development |
| **IB Associate** | Log time, manage analyst team capacity, surface overload early |
| **VP / Director** | Team capacity dashboard, deal resource planning, productivity analytics |
| **MD / Business Head** | Strategic ROI analytics — deal type, sector, product efficiency; team health |
| **HR / Talent Management** | Analyst development analytics, rotation planning, attrition risk signals |

---

## Key Features

### 1. AI-Inferred Time Log

The foundation of the module — time that writes itself.

**Platform activity inference:**

| MERIDIAN Activity | Inferred Time Attribution | Activity Type |
|-------------------|--------------------------|---------------|
| Editing a Forge document | Deal + document type | `CONTENT_CREATION` |
| Viewing/editing Pipeline deal record | Deal | `DEAL_MANAGEMENT` |
| Running AI generation in Forge | Deal | `CONTENT_CREATION` |
| Time in Intelligence on a company | Client/deal | `CLIENT_RESEARCH` |
| Meeting logged in Connect | Client/deal | `CLIENT_MEETING` |
| Credit analysis in Credit module | Deal | `CREDIT_ANALYSIS` |
| Memory document search | Deal (if linked) or `KNOWLEDGE_MANAGEMENT` | `RESEARCH` |
| Signal feed review | General or sector/client | `MARKET_RESEARCH` |

**Dark time attribution** (work outside MERIDIAN):
- Calendar events not linked to MERIDIAN (e.g., a call logged in Outlook but not in Connect) prompt for attribution
- After-hours device activity (if calendar integration active) surfaced as unattributed time to review
- Weekly "unattributed time" prompt: AI shows the gap between MERIDIAN-tracked time and likely total working time, asks the analyst to fill in the blanks

**Minimum friction design:**
- Analyst reviews AI-inferred log once per day (5 minutes max)
- Corrections via drag-and-drop deal attribution, not form filling
- Bulk confirm: "Looks right — confirm all" for days with no corrections needed
- Mobile-first: daily log review optimised for a 2-minute phone interaction

---

### 2. Activity Type Taxonomy

All time is classified along two dimensions:

**Dimension 1 — Activity type** (what you were doing):

| Activity Type | Description |
|--------------|-------------|
| `CLIENT_MEETING` | Face-to-face or virtual client interaction |
| `INTERNAL_MEETING` | Deal team, management, training meetings |
| `CONTENT_CREATION` | Pitch books, CIMs, memos, presentations |
| `FINANCIAL_MODELLING` | Financial models, valuation analysis |
| `CLIENT_RESEARCH` | Company deep-dives, sector research, briefing prep |
| `MARKET_RESEARCH` | Signal monitoring, comp analysis, industry reading |
| `DEAL_MANAGEMENT` | Pipeline admin, milestone tracking, process management |
| `CREDIT_ANALYSIS` | Credit memos, spreading, covenant work |
| `COMPLIANCE_ADMIN` | Conflict checks, insider list updates, KYC |
| `BUSINESS_DEVELOPMENT` | Pitch preparation, new client research |
| `KNOWLEDGE_MANAGEMENT` | Memory search, document retrieval, precedent research |
| `ADMIN` | Emails, scheduling, non-deal administrative work |
| `PERSONAL_DEVELOPMENT` | Training, reading, mentoring |

**Dimension 2 — Deal / client linkage** (what it was for):
- Linked to a specific deal (from Pipeline)
- Linked to a specific client / coverage relationship (from Intelligence)
- Linked to a sector / coverage activity (market research not tied to one deal)
- Non-deal administrative

---

### 3. Individual Analyst Dashboard

The analyst's own view — what they need to manage their workload and career:

**Workload overview:**
```
┌─────────────────────────────────────────────────┐
│  YOUR WEEK  ·  W/E 28 Feb 2026                  │
│  Total logged: 76h   Inferred: 68h   Manual: 8h │
│  Unattributed: 4h  [Attribute now]              │
├─────────────────────────────────────────────────┤
│  BY DEAL                    BY ACTIVITY TYPE    │
│  Project Neptune  32h  42%  Content      38%    │
│  Project Falcon   18h  24%  Modelling    22%    │
│  Project Orion    12h  16%  Research     15%    │
│  BD / Coverage     8h  11%  Meetings     14%    │
│  Admin             6h   8%  Admin         8%    │
└─────────────────────────────────────────────────┘
```

**Deal exposure tracker:**
- Which deals have I worked on? What was my role and time contribution?
- Skill development log: which activity types have I spent time on over the last 6/12 months?
- Deal type diversity: what mix of M&A, ECM, DCM, LevFin have I touched?

**Career development view:**
- "Based on your time log: you've spent 68% of your time on content creation and 8% on financial modelling. Compared to peer cohort, this is less model-heavy. If you want more modelling experience, flag this to your manager."
- Milestone tracking: years of experience by product type, deal type, client type
- Self-assessment prompts triggered by patterns: "You've worked on 6 pitch books that didn't convert — we can surface what distinguished the ones that did"

**Wellbeing signals:**
- Total hours this week / month vs. peer average and personal baseline
- Time-of-day distribution: how much late-night and weekend work?
- Streak of consecutive high-intensity days flagged
- AI note: "You've worked 10+ hours for 18 consecutive days. Are you getting adequate rest?"

---

### 4. Manager Capacity Dashboard

The VP/Director view — team capacity and deal resource management:

**Team capacity overview:**
```
┌─────────────────────────────────────────────────────────────────┐
│  TEAM CAPACITY  ·  IB COVERAGE EMEA  ·  Week of 24 Feb 2026     │
├────────────────────┬──────────┬──────────┬──────────┬──────────┤
│  Name              │ This Wk  │ Avg 4wk  │ vs Peers │ Capacity │
├────────────────────┼──────────┼──────────┼──────────┼──────────┤
│  A. Johnson (AN2)  │   82h    │   78h    │  +12%    │  LOW  🔴 │
│  B. Patel (AN1)    │   71h    │   68h    │  +2%     │  MED  🟡 │
│  C. Lee (AN2)      │   58h    │   61h    │  -10%    │  HIGH 🟢 │
│  D. Smith (AS1)    │   74h    │   72h    │  +5%     │  MED  🟡 │
└────────────────────┴──────────┴──────────┴──────────┴──────────┘
```

**Capacity definitions:**
- `HIGH` — below 75% of typical; has bandwidth for new work
- `MED` — 75–95% of typical; available for new work with appropriate scope
- `LOW` — above 95% or in high-intensity streak; caution before adding work
- `CRITICAL` — flagged by AI as overload risk; immediate manager conversation prompted

**Deal staffing view:**
- Which analyst is on which deal, with time-to-date and current week allocation
- Unstaffed deals flagged (mandate won but no analyst assigned)
- Staffing conflicts: same analyst across competing simultaneous pitches

**Resource planning:**
- Upcoming milestones across live deals that will require analyst spikes (e.g., "CIM due in 10 days for Project Falcon — estimate 40h analyst time required")
- AI-suggested staffing allocation: "Given current workloads, C. Lee is best placed to pick up the Acme Corp modelling work this week"

**AI team summary (weekly):**
Claude generates a 200-word plain-language summary of the team's activity:
> *"Your team logged 285 total hours this week across 6 active deals. A. Johnson is approaching overload — 82 hours logged against a personal baseline of 75 — driven primarily by Project Neptune which is consuming 52% of her time as the CIM deadline approaches. B. Patel had a lighter week, primarily BD research. C. Lee has significant capacity available this week. Recommend shifting the Project Orion model update from A. Johnson to C. Lee to reduce overload risk ahead of next week's management presentation."*

---

### 5. Business Strategy Analytics

The senior management view — time as a strategic resource to be allocated for maximum return.

**Deal economics: time-weighted P&L:**

For each closed deal (and live deals with time-to-date), MERIDIAN shows:

```
Project Neptune (M&A Sell-Side · Closed Mar 2026)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fee revenue:          $4.2M
Total junior hours:   1,240h  (3 analysts × 14 weeks average)
Implied cost basis:   $186K   (at $150/hour blended junior rate)
Time-weighted margin: 95.5%

Activity breakdown:
  Content creation    42%  (521h)
  Financial modelling 28%  (347h)
  Client meetings     15%  (186h)
  Research            12%  (149h)
  Admin                3%  (37h)

Pitch-to-close:
  Total pitch time:   180h  (prior to mandate)
  Execution time:     1,060h (post-mandate)
  Pitch efficiency:   $23.3K fee per pitch-hour invested
```

**Strategic ROI by deal type / sector / product:**

Which types of work generate the best return on junior analyst time?

```
REVENUE PER ANALYST-HOUR (rolling 12 months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

By Deal Type:
  M&A Sell-Side          $4,100 / hour  ████████████████░
  DCM Execution          $3,600 / hour  ██████████████░░░
  M&A Buy-Side           $2,900 / hour  ████████████░░░░░
  IPO                    $2,700 / hour  ███████████░░░░░░
  Follow-On              $1,900 / hour  ████████░░░░░░░░░
  Pitches (unconverted)    $210 / hour  █░░░░░░░░░░░░░░░░

By Sector:
  Technology             $3,800 / hour  ████████████████░
  Healthcare             $3,200 / hour  █████████████░░░░
  Industrials            $2,100 / hour  ████████░░░░░░░░░
  Real Estate            $1,600 / hour  ██████░░░░░░░░░░░
```

**Strategic questions this answers for Business Heads:**
- Which deal types and sectors deliver the most revenue per analyst-hour? Where should we be doing more?
- What is our pitch-to-mandate conversion rate weighted by hours invested? Where are we burning hours on pitches that never convert?
- Are we deploying senior vs. junior time appropriately across deal types?
- Which deals are consuming disproportionate time relative to fee? Are any systematically unprofitable on an hours basis?
- How does our time efficiency compare across teams and geographies?

**Pitch efficiency analytics:**

Unconverted pitches are the single largest time sink in IB. MERIDIAN makes the economics visible:

- Hours invested per pitch by deal type and sector
- Conversion rate by pitch type, banker, client tier
- AI pattern analysis: "Your unconverted pitches in the Technology sector average 180h and convert at 8%. Healthcare pitches average 95h and convert at 21%. Consider whether the resource investment in Technology pitches is warranted given current win rates."

**Headcount planning:**

Given pipeline and typical hours-per-deal data, project future analyst demand:
- Upcoming deal milestones that will create analyst spikes
- Pipeline-weighted demand forecast for next 30/60/90 days
- Gap analysis: is the current team sized for the expected workload?
- AI recommendation: "Based on current pipeline and conversion probability, you are likely to need 1.5 additional analysts in Q2. If Project Neptune and Project Falcon both move to mandate simultaneously, overload risk is high for the current team."

---

### 6. Wellbeing Monitor

Hours monitoring with a genuine intent to surface and address burnout, not just record it.

**Wellbeing metrics tracked:**

| Metric | Definition | Alert Threshold |
|--------|-----------|----------------|
| Weekly hours | Total hours logged per week | > 85h triggers amber; > 95h triggers red |
| Late-night work | Hours logged after 11pm | > 10h/week in rolling average |
| Weekend work | Hours logged Saturday/Sunday | > 15h/weekend |
| Consecutive intensity | Days of consecutive 12h+ logged | > 10 consecutive days |
| Work-life ratio | Weekend hours as % of total | > 25% in rolling month |

**Wellbeing alerts are visible to:**
- The analyst themselves (always — their own data)
- Their direct manager (aggregated + individual for their reports)
- HR / Talent Management (aggregate only by default; individual on request with justification)
- The analyst can flag their own wellbeing concern directly to HR without going through their manager

**Manager action flow on wellbeing alert:**
1. Alert surfaced in manager capacity dashboard with context (which deals are driving the hours)
2. Manager prompted: "A. Johnson has logged 18 consecutive 12h+ days, primarily on Project Neptune. Consider redistributing the CIM work or having a check-in conversation."
3. Manager records action taken (conversation had, work redistributed, timeline extended)
4. Alert monitors whether hours normalise in following 2 weeks

**Anonymous benchmarking:**
Analysts and managers can see their hours in context of anonymised peer averages:
- "Your team's average this week: 74h. IB EMEA peer average: 71h."
- No individual-level data shared between teams without consent

---

### 7. Skill & Experience Tracker

Uses the time log to build a structured picture of each analyst's deal experience over time — useful for performance reviews, rotation planning, and analyst development conversations.

**Per-analyst experience profile:**

```
A. JOHNSON  ·  Analyst Year 2  ·  IB EMEA Coverage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEAL EXPERIENCE (hours-weighted)
  M&A Sell-Side    38%  ████████████████
  M&A Buy-Side     22%  █████████
  DCM              14%  ██████
  ECM               8%  ███
  LevFin            6%  ██
  General Coverage 12%  █████

SECTOR EXPOSURE
  Technology       52%  ██████████████████████
  Healthcare       31%  █████████████
  Industrials      17%  ███████

ACTIVITY MIX
  Financial modelling  31%
  Content creation     44%
  Client meetings      12%
  Research             10%
  Admin                 3%

DEALS CONTRIBUTED TO: 8 (4 closed, 3 live, 1 withdrawn)
```

**AI development insight:**
> *"Anna has strong M&A sell-side experience and deep Technology sector coverage. Relative gaps vs. typical AN2 profile: limited ECM/DCM exposure and below-average client meeting time (12% vs. peer average 18%). Recommended for rotation into a product team (ECM or DCM) to round out capital markets experience before Associate promotion."*

**Manager performance review support:**
When preparing analyst performance reviews, managers get an AI-drafted data narrative:
> *"In the review period, Anna logged 1,840 hours across 6 deals. She contributed 38% of total analyst hours on Project Neptune, the team's largest mandate this year. Her modelling output per hour is 15% above peer cohort average. She was consistently available for last-minute work with below-average turnaround times on urgent requests. Her hours were in the top quartile of her cohort (average 80h/week) throughout the review period."*

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Platform activity inference | Map MERIDIAN activity to time entries and deal attribution | claude-haiku-4-5 |
| Dark time attribution prompts | Generate contextual suggestions for unattributed time | claude-haiku-4-5 |
| Weekly team summary | Plain-language narrative of team activity and capacity | claude-sonnet-4-6 |
| Overload risk detection | Pattern-match hours data to flag burnout risk | claude-haiku-4-5 |
| Deal economics narrative | Synthesise time-weighted deal P&L into management commentary | claude-sonnet-4-6 |
| Strategic ROI analysis | Interpret deal type / sector efficiency patterns for business heads | claude-sonnet-4-6 |
| Pitch efficiency analysis | Identify high-cost, low-conversion pitch patterns | claude-sonnet-4-6 |
| Skill gap analysis | Compare analyst experience profile to target profile; suggest development actions | claude-sonnet-4-6 |
| Performance review draft | Draft data-backed narrative section for analyst reviews | claude-sonnet-4-6 |
| Headcount demand forecast | Project future analyst demand from live pipeline | claude-sonnet-4-6 |

---

## Data Requirements

### From MERIDIAN modules (primary — inferred automatically)
- Forge: document edit sessions, creation events, AI generation events (with deal linkage)
- Pipeline: deal record views, edit events, stage changes
- Connect: calendar events, meeting logs, task completions
- Intelligence: company profile views, brief generation events
- Credit: credit analysis sessions, spreading events
- Memory: document access and search events

### Manual / Prompted Input
- Analyst daily log review: corrections, dark time attribution, offline work
- Manager: deal staffing assignments (links analyst to deal)
- Manager: notes on capacity decisions and wellbeing conversations

### External Data
- **Calendar system** (O365 / Google): total calendar events including non-MERIDIAN time — used to estimate unattributed working time
- **HR system** (SoR): analyst seniority, team, start date, compensation grade — used for peer benchmarking and review context
- **Finance / Revenue system** (SoR): deal fee data — used for time-weighted P&L

---

## Data Model Additions

### TimeEntry  `MERIDIAN_OWNED`
```typescript
TimeEntry {
  id: UUID
  organizationId: UUID
  userId: UserId
  date: Date
  startTime?: DateTime
  endTime?: DateTime
  durationMinutes: number

  // Attribution
  dealId?: UUID
  companyId?: UUID
  activityType: ActivityType
  description?: string

  // Source
  source: 'INFERRED' | 'MANUAL' | 'CALENDAR_IMPORT'
  inferredFrom?: string     // Module and event type that generated this entry
  confidence?: number       // 0-1 for inferred entries

  // Review
  analystConfirmed: boolean
  confirmedAt?: DateTime
  correctedFrom?: UUID      // If this replaced a prior inferred entry
}
```

### CapacityProfile  `MERIDIAN_OWNED`
```typescript
CapacityProfile {
  id: UUID
  userId: UserId
  weekStartDate: Date

  // Actuals
  totalHours: number
  byActivityType: Record<ActivityType, number>
  byDealId: Record<UUID, number>

  // Computed
  vsPersonalBaseline: number      // % variance from own rolling average
  vsPeerAverage: number           // % variance from peer cohort average
  capacityStatus: 'HIGH' | 'MED' | 'LOW' | 'CRITICAL'
  wellbeingFlags: WellbeingFlag[]

  // AI narrative
  aiSummary?: string              // Generated weekly by Claude
}
```

### DealTimeEconomics  `MERIDIAN_OWNED`
```typescript
DealTimeEconomics {
  id: UUID
  dealId: UUID
  asOfDate: DateTime

  // Time totals
  totalAnalystHours: number
  totalAssociateHours: number
  totalSeniorHours: number        // VP+

  // By activity
  byActivityType: Record<ActivityType, number>

  // Economics (populated when fee data available)
  feeRevenue?: number
  impliedCostBasis?: number       // Based on configured blended rates per grade
  timeWeightedMargin?: number
  revenuePerJuniorHour?: number

  // Pitch tracking
  preMandateHours: number         // Hours before mandate awarded
  postMandateHours: number

  // AI narrative
  aiEconomicsNarrative?: string
}
```

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Pipeline | Deal records are the primary attribution target for time; deal stage data used for pitch vs. execution split; fee data used for deal economics |
| Forge | Document editing sessions infer content creation time with deal linkage |
| Connect | Calendar events infer meeting time; task completion events contribute to deal management time |
| Intelligence | Company profile sessions infer client research time |
| Credit | Credit analysis sessions infer credit work time |
| Memory | Document access events contribute to research time |
| Compliance | Compliance workflow time (conflict checks, insider list updates) attributed to `COMPLIANCE_ADMIN` |

---

## UX Principles for this Module

- **Minimum viable input from analysts** — the AI should do 80%+ of the logging. The daily review should take under 5 minutes. If it feels like a timesheet, it will be abandoned.
- **Benefits must be tangible to the analyst** — the workload balance view, skill tracker, and development insights are features for the analyst, not for management. Lead with these in the analyst UX, not the management analytics.
- **Transparency is non-negotiable** — analysts must be able to see exactly what data is held about them, who can see it, and how it informs any decision. A "my data" view is required.
- **Privacy by default** — individual drilldown for managers requires a context/reason; aggregate views are the default. Wellbeing data is more privacy-sensitive than productivity data and treated accordingly.
- **No gameable metrics** — the system should not create incentives for analysts to inflate hours or attribute time to prestigious deals. Design against Goodhart's Law: the metric should not become the target.
