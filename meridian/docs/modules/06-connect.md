# Module 06: Meridian Connect — Workflow & Communications

## Purpose

Meridian Connect is the operational fabric of the platform — the layer that makes everything happen smoothly. It handles meeting intelligence, task management, approval workflows, CRM auto-logging, notifications, and conflict clearance. It removes the operational friction that bankers experience every day and ensures nothing falls through the cracks.

The defining question Connect answers: **"What do I need to do next, and have I done everything I need to do?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| IB Associate | Task management, deal team coordination, meeting management |
| VP / Director | Meeting prep and follow-up, approval management, CRM discipline |
| RM (Corporate Banking) | Client communication logging, annual review workflows |
| Credit Analyst | Credit application workflow, approval submission |
| Operations / Middle Office | Deal workflow visibility, KYC and onboarding coordination |
| **In-Business Compliance (IBC)** | **Primary user of conflict clearance, compliance dashboard, wall crossing management** |
| Compliance Officer (Line 2) | Audit trail access, policy oversight, regulatory reporting |

---

## Key Features

### 1. Meeting Intelligence

**Pre-meeting:**
- Automatic detection of upcoming meetings from calendar integration (O365/Google Calendar)
- Meeting brief auto-generated 24 hours before (sourced from Intelligence module)
- Pre-meeting checklist: materials ready, open items from last meeting, contacts confirmed
- One-click to launch Intelligence module for deeper prep

**During meeting:**
- Mobile-optimized meeting view: company info, contacts, agenda, open items
- Quick note capture (voice or text) for in-meeting actions

**Post-meeting:**
- AI-drafted meeting summary from notes and/or transcript (if recording permitted)
- Action items extracted and converted to tasks
- Auto-prompt to log to CRM (or auto-logged if email/calendar integration active)
- Follow-up reminders set automatically

---

### 2. Task & Action Management

Personal and team task management linked to deals and clients:

- **Task creation**: Manual or auto-created from meeting follow-ups, deal milestones, alerts
- **Context linking**: Every task linked to a deal, company, or contact
- **Priority management**: Priority levels with due dates
- **Deal team tasks**: Assign tasks to deal team members; visibility across the team
- **Completion tracking**: Track task completion rates; escalate overdue items
- **Smart suggestions**: AI surfaces high-priority tasks based on deal urgency and deadline proximity

**Views:**
- My tasks (personal view)
- Deal team tasks (all tasks on a specific deal)
- Client tasks (all outstanding items for a client relationship)
- Overdue / at-risk dashboard

---

### 3. Approval Workflows

Structured, auditable approval chains for:

- **Credit applications**: Submit → Credit Analyst QC → Credit Officer review → Credit Committee (if required)
- **Pitch approval**: Deal pitch → Conflicts check → Senior sign-off → Go/No-go
- **Wall crossing requests**: Banker request → Compliance review → Approved/Denied with reason
- **Client onboarding**: KYC package submitted → Compliance review → AML check → Approved
- **Deal expense approval**: Expense submitted → Line manager → Finance

**Workflow features:**
- Configurable approval chains per workflow type and deal size
- SLA tracking: how long each step takes; escalation if SLA exceeded
- Comments at each approval stage
- Full audit trail with timestamps and approver identity
- Mobile-optimized approval actions (approve/reject/request info on mobile)

---

### 4. CRM Auto-Logging

The most-resisted task in banking — automated:

**Auto-capture sources:**
- **Calendar integration**: Meetings with client contacts auto-logged with attendees, date, and duration
- **Email integration** (optional): Emails to/from client contacts auto-logged with subject (not body, for privacy)
- **Manual quick-log**: Voice-to-text or structured form for rapid manual logging

**CRM record contents:**
- Date, duration, type (meeting/call/email/conference)
- Contacts present
- AI-generated summary (from notes or transcript)
- Deal linkage
- Action items extracted

**Quality controls:**
- Banker reviews and approves AI summary before final logging
- Private notes field (not synced to shared CRM)
- Compliance-accessible audit trail

---

### 5. Notification Hub

Smart, context-aware notification system:

**Notification types:**
- **Deal alerts**: Stage change, mandate won/lost, action item overdue
- **Credit alerts**: Covenant headroom breach, EWI deterioration, rating action
- **Relationship alerts**: Client trigger event, health score drops
- **Market signals**: High-priority signal items from Signal module
- **Workflow alerts**: Approval pending, approval decision received
- **Team alerts**: Colleague assigned a task to you, mentioned you in a note

**Delivery channels:**
- In-app notification center
- Email digest (configurable: immediate, hourly, daily summary)
- Mobile push notification (configurable by alert priority)

**Smart filtering:**
- Priority-scored notifications — not all alerts are equal
- Quiet hours configuration
- Do-not-disturb during scheduled meetings

---

### 6. Calendar Integration

Native integration with institutional calendar systems:

- **O365 / Microsoft Exchange**: Two-way sync of calendar events
- **Google Calendar**: Two-way sync
- **Meeting enrichment**: Detected client meetings auto-enriched with company and contact data from Intelligence
- **Deal timeline sync**: Deal milestones from Pipeline synced to relevant deal team members' calendars
- **Conference tracking**: Conference schedules imported; banker's conference schedule linked to client meetings

---

### 7. Audit Trail (Compliance)

Compliance-accessible record of all client-facing activity:

- Complete log of all client interactions (meeting, call, email, note)
- Document access log: who accessed which client document, when
- AI generation log: every piece of AI-generated content created, with prompt and output
- Wall crossing log: all approved and denied wall crossing requests
- Approval decisions: all approval workflow events with approver identity
- Conflict clearance decisions: full history of all conflict checks, AI findings, and IBC decisions

**Compliance features:**
- Search and filter audit trail by user, client, date, event type
- Export audit trail to CSV or PDF for regulatory examination
- Immutable records — cannot be edited or deleted
- Full text search across interaction notes

---

### 8. AI-Enabled Conflict Clearance

The conflict clearance process is the compliance gateway before a banker can formally engage with a new mandate or share confidential deal information with a client. Today it is a largely manual, questionnaire-driven process prone to missed conflicts. MERIDIAN makes it AI-powered, structured, and auditable.

**Primary persona:** In-Business Compliance Officer (IBC). Bankers initiate; IBCs adjudicate.

---

#### What Is a Conflict of Interest in Banking?

MERIDIAN handles five categories of conflict:

| Conflict Type | Description | Example |
|--------------|-------------|---------|
| **Mandate conflict** | Bank has an active advisory or financing mandate for a party that conflicts with the proposed engagement | Bank is advising Company A on a potential acquisition; Company B (a competing bidder) now wants to engage the bank |
| **Counterparty conflict** | A party on one side of the proposed deal is a current advisory client on the other side | Bank advised Target Co last year on strategy; now advising an acquirer targeting them |
| **Principal conflict** | Bank holds a proprietary position in a company involved in the proposed transaction | Bank's balance sheet holds equity or debt in the target company |
| **Role conflict** | Bank would be acting in incompatible capacities simultaneously | Acting as financial advisor to both buyer and seller in the same deal |
| **Personal conflict** | A member of the proposed deal team has a personal financial, relational, or prior employment connection to a party in the deal | Analyst owns shares in the target; banker's spouse is CFO of a counterparty |

---

#### AI Conflict Check — How It Works

When a banker creates a new deal or requests conflict clearance, MERIDIAN's AI runs a structured conflict search across the entire platform:

**Step 1 — Scope definition**
The banker defines the engagement:
- Proposed client / counterparty
- Deal type and product
- Other parties (counterparty, target, acquirer, co-investors, advisors)
- Proposed deal team

**Step 2 — AI conflict search**

Claude searches across:

| Search Scope | What It Looks For |
|-------------|------------------|
| Active deals (Pipeline) | Any deal where a proposed party appears on either side |
| Closed deals (Memory) | Advisory and financing relationships for any party in the last [configurable] years |
| Client relationships (Intelligence) | All relationship tiers and historical mandates for each party |
| Coverage assignments | Which bankers cover which companies — surface coverage overlap conflicts |
| Insider lists | Whether any proposed team member is already an insider on a conflicting deal |
| Personal disclosures | Cross-reference deal team against personal conflict disclosures on file |
| CRM history | Past interactions and mandates via SoR connector |

**Step 3 — Conflict report generation**

Claude generates a structured conflict report with:

- **Summary**: "X potential conflicts identified. Y require IBC review. Z are informational only."
- **Conflict records**: For each potential conflict, a structured finding:
  - Conflict type and severity (`HIGH` / `MEDIUM` / `LOW` / `INFORMATIONAL`)
  - Description of the conflict: what it is, which parties are involved
  - Source evidence: which deal, mandate, or relationship triggered this flag
  - Suggested resolution: `DECLINE` | `ERECT_WALL` | `DISCLOSE_TO_CLIENT` | `RECUSE_BANKER` | `CLEAR`
- **Clear findings**: Things explicitly checked and found clean — documented absence of conflict matters as much as presence

**Step 4 — IBC review and decision**

The IBC reviews the AI report:
- AI findings are presented as candidates, never as decisions
- IBC can accept a finding, dismiss it with reason, or escalate to Line 2 Compliance
- For each finding: IBC records the determination and conditions (if any)
- Final decision: `CLEARED` | `CONDITIONALLY_CLEARED` | `BLOCKED`

**Step 5 — Conditions enforcement**

If conditionally cleared:
- Conditions recorded on the conflict check (e.g., "Chinese wall between DCM team and advisory team")
- MERIDIAN enforces conditions at the data access layer (same mechanism as MNPI walls)
- IBC receives notifications if conditions appear to be breached
- Conditions reviewed at configurable intervals (e.g., every 30 days on live mandates)

---

#### Conflict Clearance Workflow

```
Banker creates deal / requests engagement
          │
          ▼
  Conflict check triggered automatically
  (or manually initiated by banker or IBC)
          │
          ▼
  AI runs conflict search (< 30 seconds)
          │
          ▼
  AI Conflict Report generated
  → Banker sees: "X items flagged — under IBC review"
  → IBC sees: full report in Compliance Dashboard
          │
          ▼
  IBC reviews report
  ├── Dismiss finding (with reason)
  ├── Escalate finding to Line 2 Compliance
  └── Make determination per finding
          │
          ▼
  IBC records overall decision:
  CLEARED / CONDITIONALLY_CLEARED / BLOCKED
          │
     ┌────┴────────────────────┐
     ▼                         ▼
  CLEARED                   BLOCKED
  Banker proceeds;          Deal record blocked;
  IBC decision logged       Banker notified with reason;
  in audit trail            appeal process available
     │
  CONDITIONALLY_CLEARED
  Conditions attached to deal;
  enforced in MERIDIAN;
  monitored by IBC
```

---

#### IBC Compliance Dashboard

The dedicated view for In-Business Compliance Officers:

**Pending queue:**
- All conflict checks awaiting IBC review, sorted by submission time and deal stage
- SLA indicator: how long since submitted (escalation after configurable threshold, default 24 hours business hours)
- Quick-action panel: review report, clear, block, escalate — without leaving the dashboard

**Active mandates monitoring:**
- All deals currently in execution with open conflict conditions
- Condition status: are walls in place, are team assignments respecting conditions?
- Alerts when conditions appear breached

**Conflict check history:**
- Full history of all conflict checks: cleared, conditionally cleared, blocked
- Searchable by party name, deal, banker, date, decision
- Each record links to the full AI report and IBC decision rationale

**Personal disclosure register:**
- All personal conflict disclosures on file from deal team members
- Expiry tracking (disclosures require renewal)
- Outstanding disclosure requests

**Wall crossing management:**
- Active wall crossings: who is crossed on which deal, when does access expire
- Pending wall crossing requests awaiting IBC approval
- History of all wall crossing decisions

---

#### Personal Conflict Disclosures

Bankers are required to disclose personal conflicts before joining a deal team. MERIDIAN provides:

- **Disclosure form**: Banker self-declares personal interests (shareholdings, family relationships, prior employment) relevant to the proposed deal
- **Disclosure registry**: IBC maintains a structured register of all active disclosures
- **Pre-populated**: For personal shareholdings, MERIDIAN can integrate with the institution's personal account dealing system to pre-populate known holdings
- **Annual refresh**: Disclosures require periodic renewal; MERIDIAN tracks expiry and sends reminders
- **Conflict cross-reference**: When a banker is added to a deal team, MERIDIAN automatically checks their disclosure register against the deal parties

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Meeting summary | Draft post-meeting summary from notes/transcript | claude-sonnet-4-6 |
| Action item extraction | Extract action items from meeting notes | claude-haiku-4-5 |
| Priority suggestion | Suggest task priorities based on deal urgency | claude-haiku-4-5 |
| Pre-meeting brief | Sourced from Intelligence module | claude-sonnet-4-6 |
| Follow-up reminder copy | Generate friendly follow-up message drafts | claude-haiku-4-5 |
| Workflow SLA summary | Synthesize workflow bottlenecks for management | claude-haiku-4-5 |
| **AI conflict search** | **Scan all deals, mandates, relationships, and personal disclosures for potential conflicts** | **claude-sonnet-4-6** |
| **Conflict report generation** | **Produce structured conflict findings with severity, evidence, and resolution suggestions** | **claude-sonnet-4-6** |
| **Conflict finding summary** | **Translate conflict report into plain-language brief for IBC** | **claude-haiku-4-5** |

---

## Data Requirements

### Internal Data
- User calendars (via calendar integration)
- Deal and client records (from Pipeline and Intelligence)
- Contact records (from Intelligence)
- User and team structure (from org configuration)

### Integrations Required
- **Calendar**: O365 (Microsoft Graph API) or Google Calendar API
- **Email** (optional): O365 / Gmail — metadata only, not message body
- **CRM** (optional): Salesforce, Microsoft Dynamics — bi-directional sync
- **Document management** (optional): SharePoint, Box — document link sync

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Meeting brief sourced from Intelligence; interaction logs update client relationship score |
| Pipeline | Deal milestones generate tasks; deal stage changes trigger notifications |
| Forge | Document completion triggers share/approval workflow in Connect |
| Credit | Credit applications flow through Connect approval workflow |
| Signal | High-priority signals generate Connect notifications |
| Memory | Meeting notes and summaries stored in Memory for searchability |
