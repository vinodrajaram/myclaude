# Module 02: Meridian Pipeline — Deal Origination

## Purpose

Meridian Pipeline is the deal lifecycle management system — from first idea through mandate close. It replaces the combination of spreadsheet trackers, CRM dashboards, and email threads that currently constitute "deal management" at most banks.

The defining question Pipeline answers: **"What's in my pipeline, what's moving, and what needs attention?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| MD / Director | Pipeline health, revenue forecast, mandate pipeline |
| VP | Day-to-day deal management, pitch tracking, mandate coordination |
| Coverage Banker | Full origination lifecycle, cross-product pipeline |
| Product Banker | Product-specific pipeline, execution tracking |
| Business Head | Franchise-level pipeline, revenue attribution, market share |
| RM (Corporate Banking) | Lending and product pipeline, annual review-triggered opportunities |

---

## Key Features

### 1. Deal Pipeline Board

Visual Kanban and list views of all deals across stages:

```
IDEA → PITCHED → MANDATE AWARDED → EXECUTION → CLOSED WON / CLOSED LOST
```

For each deal card:
- Company name, deal type, estimated value/fee
- Stage and stage duration (how long it's been in this stage)
- Lead banker and deal team
- Probability of success
- Next action required + due date
- AI-suggested next step

**Color coding:**
- Green: On track
- Amber: Stale (no activity in 7+ days for active stage)
- Red: At risk / overdue action

**Filtering:** By banker, sector, product, deal type, stage, date range, company.

---

### 2. Pitch Tracking

End-to-end tracking of every pitch made to clients:

- **Pitch record**: Date, client, contact, product, materials linked
- **Response tracking**: Pending / Progressing / Won / Lost with reason
- **Follow-up management**: Auto-reminders when no response after configurable period
- **Win/loss analysis**: Aggregate win rates, loss reasons, competitive losses

**Key metric surfaced**: Pitch-to-mandate conversion rate by banker, by product, by sector.

---

### 3. Mandate Management

Once a mandate is awarded, Pipeline manages the execution lifecycle:

- **Mandate checklist**: Customizable milestones for each deal type (e.g., IB M&A: NDA → process letter → first round → final → close)
- **Regulatory milestones**: Filings, clearances, regulatory approvals tracked
- **Fee economics**: Estimated fee, success fee, retainer — tracked to close
- **Document links**: All transaction documents accessible from deal record
- **Deal team**: Role assignments with clarity on who owns what
- **Timeline view**: Gantt-style execution timeline

---

### 4. Pipeline Analytics

Management and self-service analytics:

**Individual Banker View:**
- Pipeline value by stage
- Win rate (last 12 months)
- Average deal velocity (days in each stage)
- Revenue closed YTD

**Team / Coverage Group View:**
- Aggregate pipeline by banker
- Revenue forecast (weighted by probability)
- Deal activity vs. prior period
- Bandwidth assessment (deals per banker)

**Business Head View:**
- Franchise pipeline, wallet share estimates
- League table simulator
- Revenue by product, by sector, by client tier
- Market share trend

**AI layer**: Claude generates a weekly "Pipeline Intelligence Brief" that narrates key pipeline movements, stale deals requiring attention, and revenue forecast commentary.

---

### 5. AI Deal Idea Generation

Surface relevant deal opportunities that bankers might not be actively tracking:

- **Trigger-based ideas**: When Signal detects an M&A trigger for a covered company, Pipeline generates a deal idea record automatically
- **Financial event ideas**: Refinancing needs detected from credit module data (leverage, maturity wall)
- **Market window ideas**: When ECM or DCM market conditions are favorable for a client, an idea is surfaced

Each AI-generated idea includes:
- Rationale (why this is a relevant opportunity now)
- Product recommendation (M&A, ECM, DCM, etc.)
- Estimated economics
- Priority score
- One-click to open in Forge for pitch book generation

---

### 6. Cross-Product Coordination

For coverage bankers managing relationships across IB, DCM, ECM, and other products:

- **Single client view**: All active products and live deals in one place per client
- **Conflict detection**: Alert when multiple bankers are pursuing the same client for the same product
- **Wallet share tracking**: Which products has this client used? With us or with competitors?
- **Revenue attribution**: Track which coverage banker receives credit for each product deal

---

### 7. League Table Positioning

For IB teams that track competitive position:

- **League table simulator**: Add a deal to the pipeline and see simulated impact on league table rank
- **Real-time league table tracking**: Current rank by product, sector, geography
- **Competitive analysis**: Which banks are winning the deals we're losing?

---

### 8. Deal Insider List Management

**Regulatory requirement.** Any deal involving MNPI triggers a legal obligation to maintain an insider list. MERIDIAN provides structured insider list management within the Pipeline module, covering EU MAR Article 18, FCA DTR, and equivalent obligations in other jurisdictions.

**When a deal reaches MANDATE stage** (or earlier, from the point MNPI is first shared), the banker is prompted to open a formal insider list. This list records every person — internal and external — who has been granted access to the deal's confidential information.

#### Opening an Insider List

On mandate or first MNPI event:
1. Banker opens an insider list via the deal record
2. MERIDIAN auto-populates the deal team (all users on the deal record) as initial insiders
3. Banker sets the deal codename (e.g., "Project Falcon") and assigns a compliance owner
4. Compliance officer receives notification and acknowledges ownership

#### Adding and Removing Insiders

**Adding an insider:**
- Search for internal users (bankers, analysts, legal, compliance) — found in MERIDIAN user directory
- Add external persons (law firm counsel, financial advisors, target management) manually
- For each: capture role, reason for access, and date MNPI was first shared
- Insider receives an in-app or email acknowledgement request (configurable)
- Record is timestamped and immutable once saved

**Removing an insider:**
- Banker or compliance officer records the revocation date
- Record preserved with `accessRevokedAt` — never deleted
- Insider's access to restricted deal data revoked in MERIDIAN simultaneously

**Fields captured per insider** (aligned to MAR Article 18 template):
- Full name
- Role and reason for MNPI access
- Employer / firm
- Direct telephone (professional)
- Date MNPI was first disclosed to this person
- Date access ended (if revoked)
- For external individuals: date of birth (required under MAR)
- Acknowledgement status and date

#### Insider List Compliance Controls

- **Access restriction**: The insider list itself is `RESTRICTED` classification — visible only to deal team, compliance, and senior management. Not surfaced to the wider organisation.
- **Automatic deal access control**: Being on the insider list does not grant platform access; being removed from it triggers a review of the person's deal data access.
- **Acknowledgement tracking**: Lists with unacknowledged insiders flagged for follow-up. Compliance officer sees outstanding acknowledgements across all live deals.
- **Restricted list sync**: When a deal is in execution and the company is placed on the restricted list, all active insiders are flagged.
- **Audit trail**: Every add, remove, and modification to the insider list is immutably logged with user, timestamp, and reason.

#### Regulatory Export

Insider lists can be exported at any time:
- **CSV**: Standard table format for internal use and legal review
- **PDF**: Formatted for submission to legal counsel or compliance archival
- **ESMA XML**: Structured XML format compliant with ESMA Technical Standards for MAR Article 18 submissions to regulators (e.g., FCA, BaFin, AMF)

Each export is logged in `InsiderListExport` with a SHA-256 hash of the content for tamper detection.

#### Lifecycle

```
Deal created
    │
    ▼
MNPI first shared → Insider list OPENED
    │
    ├── Insiders added / removed as deal progresses
    │
    └── Deal announced or abandoned → Insider list CLOSED
              │
              └── Archived with deal record for 5+ years (regulatory retention)
```

**Compliance officer dashboard** (separate from Pipeline board): Shows all open insider lists across the organisation, outstanding acknowledgements, lists approaching review deadlines, and closed lists pending archival.

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Deal idea generation | Surface opportunities from triggers + market data | claude-sonnet-4-6 |
| Pipeline brief | Weekly narrative of pipeline movements | claude-sonnet-4-6 |
| Next action suggestion | Suggest what to do next on stale deals | claude-haiku-4-5 |
| Win/loss narrative | Synthesize patterns from win/loss data | claude-sonnet-4-6 |
| Revenue forecast commentary | Explain forecast range with risks | claude-haiku-4-5 |
| Mandate checklist generation | Generate custom checklist from deal type | claude-haiku-4-5 |

---

## Data Requirements

### Internal Data
- Deal records (current and historical)
- User assignments and coverage structure
- Revenue and fee data (from finance systems if integrated)
- Client relationship data (from Intelligence module)
- Document library (from Memory module)

### External Data
- League table data (Refinitiv, Dealogic)
- Announced M&A transactions (deal comps for positioning)
- Market conditions (Signal module feeds)

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Deal ideas linked to client profiles; company data populates deal records |
| Forge | "Generate pitch book" from any deal launches Forge with deal context |
| Signal | Trigger events auto-create deal ideas in Pipeline |
| Credit | Lending deals link to credit facilities; credit appetite feeds opportunity generation |
| Connect | Deal milestones generate tasks; meeting notes linked to deal |
| Memory | Past transaction comps and precedents surfaced in deal context |

---

## UX Principles for this Module

- **Action-first**: Every deal should have a clear "next action" surfaced immediately
- **Staleness visible**: Time-in-stage indicators make stale deals impossible to miss
- **One-click to create**: Creating a deal record from a Signal trigger or a client profile should be a single action
- **Analytics accessible**: Pipeline analytics shouldn't require navigating away — contextual analytics on the board view
