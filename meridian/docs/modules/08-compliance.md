# Module 08: Meridian Compliance — In-Business Compliance Center

## Purpose

Meridian Compliance is the operational command center for In-Business Compliance Officers (IBCs) and their Line 2 counterparts. It brings together every compliance workflow that touches the front office — conflict clearance, insider list oversight, wall crossing management, restricted list maintenance, conduct risk monitoring, personal disclosure registers, and regulatory reporting — into a single, AI-augmented interface.

Today this work lives in a combination of email chains, Excel spreadsheets, paper forms, and shared drives. MERIDIAN replaces all of it with structured, auditable, AI-assisted workflows.

The defining question Compliance answers: **"Is the business clean, and can I prove it?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| **In-Business Compliance Officer (IBC)** | **Primary daily user across all features** |
| Risk & Compliance Officer (Line 2) | Oversight, escalation review, regulatory reporting, policy governance |
| MD / Business Head | Compliance posture of their franchise; conflicts affecting strategic deals |
| VP / Director | Submitting conflict requests; monitoring clearance status on live deals |
| IB Analyst / Associate | Submitting personal disclosures; requesting wall crossings |
| Operations / Middle Office | KYC and onboarding workflow status |

---

## Key Features

### 1. IBC Operations Dashboard

The home screen for the IBC — a live summary of everything that needs attention:

```
┌─────────────────────────────────────────────────────────────┐
│  COMPLIANCE DASHBOARD                     Business: IB EMEA  │
├──────────────┬───────────────┬────────────┬─────────────────┤
│  Conflict    │  Insider      │  Wall      │  Disclosures    │
│  Checks      │  Lists        │  Crossings │  Register       │
│              │               │            │                 │
│  7 PENDING   │  3 REQUIRING  │  2 PENDING │  4 EXPIRING     │
│  2 OVERDUE   │  ATTENTION    │  APPROVAL  │  THIS MONTH     │
└──────────────┴───────────────┴────────────┴─────────────────┘
```

**Pending queue:**
- All items awaiting IBC action, sorted by urgency and SLA status
- SLA countdown: conflict checks auto-escalate after 24 business hours; wall crossings after 4 hours
- One-click to open and act on each item without leaving the dashboard

**At-risk items:**
- Conflict conditions approaching review date
- Insider lists with unacknowledged insiders > 48 hours
- Personal disclosures expiring in next 30 days
- Wall crossings expiring in next 7 days
- Active deals without a conflict check on record

**Compliance health summary:**
- Rolling 30-day metrics: checks completed, clear rate, average turnaround time
- Open condition count by type (Chinese walls, disclosures, recusals)
- Active insider lists and aggregate insider count

---

### 2. Conflict Clearance Center

The primary IBC workflow. All conflict check requests across the business land here.

#### Incoming Queue

- All pending conflict checks submitted by bankers
- Sorted by submission time with SLA indicator
- Filterable by: deal type, submitting banker, status, severity of AI findings

**Quick-action cards:**

```
┌────────────────────────────────────────────────────────┐
│  Project Neptune — M&A Sell-Side         ⏱ 3h 22m ago  │
│  Submitted by: J. Smith (VP, IB Coverage)              │
│  Client: Acme Industrial Holdings                       │
│  AI Findings: 2 HIGH · 1 MEDIUM · 3 INFORMATIONAL      │
│  [Review Report]  [Assign to Me]  [Escalate]           │
└────────────────────────────────────────────────────────┘
```

#### AI Conflict Report Review

Full structured review interface for each conflict check:

**Engagement summary panel:**
- Proposed client, counterparties, deal type, product
- Proposed deal team with personal disclosure status per member

**AI findings panel:**

Each AI-identified finding is presented as a card:

```
┌─────────────────────────────────────────── HIGH ───────────────┐
│  MANDATE CONFLICT                                               │
│                                                                 │
│  Acme Industrial Holdings is the target in this proposed        │
│  sell-side advisory. The bank is currently acting as financial  │
│  advisor to Meridian Capital Partners (a registered bidder      │
│  in the same process) under mandate "Project Orion"            │
│  (opened 14 Feb 2026, Lead: M. Chen, IB M&A).                  │
│                                                                 │
│  Source evidence: Pipeline Deal #deal_9xk · Open mandate       │
│  AI Suggestion: DECLINE or ERECT_WALL with full separation      │
│  AI Confidence: 0.94                                           │
│                                                                 │
│  IBC Determination:  [Accept]  [Dismiss ▾]  [Escalate to L2]  │
│  Notes: ________________________________________________       │
└────────────────────────────────────────────────────────────────┘
```

**IBC decision workflow:**
1. Review each finding; record acceptance, dismissal with reason, or escalation
2. Specify any conditions for conditionally cleared checks
3. Record overall determination: `CLEARED` / `CONDITIONALLY_CLEARED` / `BLOCKED`
4. Write decision rationale (required for BLOCKED; strongly encouraged for all)
5. Notify submitting banker — automatic notification on decision

**Escalation to Line 2:**
- Any finding can be escalated from IBC to Line 2 Compliance for a binding determination
- Escalated items move to Line 2 queue with full AI report and IBC notes attached
- Line 2 decision flows back to MERIDIAN and is recorded against the check

#### Conditions Management

For conditionally cleared deals, the IBC defines and tracks conditions:

| Condition Type | MERIDIAN Enforcement | Review Frequency |
|---------------|---------------------|-----------------|
| `CHINESE_WALL` | Access restriction enforced at data layer | Ongoing (automatic breach detection) |
| `CLIENT_DISCLOSURE` | IBC records that client has been informed | On deal close |
| `BANKER_RECUSAL` | Named banker removed from deal team; blocked from deal data | Ongoing |
| `SCOPE_LIMITATION` | Deal record annotated; no automated enforcement | Periodic IBC review |
| `PERIODIC_REVIEW` | Condition review task auto-created at specified interval | Per-condition schedule |

**Condition breach detection:**
- For `CHINESE_WALL` conditions: access control layer blocks cross-wall data access and fires an immediate alert to the IBC
- For `BANKER_RECUSAL`: any access by the recused banker to deal data triggers an alert
- Breach records are created and linked to the condition, with full audit trail

#### Conflict History

Full register of all past conflict checks, searchable and filterable:
- By party name (client, counterparty, target)
- By deal, banker, decision, date range
- Each record links to the full AI report, all IBC notes, and the final determination
- Export to CSV or PDF for regulatory inspection

---

### 3. Insider List Oversight

The IBC's cross-portfolio view of all deal insider lists. Complements the deal-level view available to bankers in Pipeline.

**Portfolio insider list view:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ACTIVE INSIDER LISTS                              IB EMEA  ·  Live  │
├──────────────────────────────┬────────┬──────┬──────────┬────────────┤
│  Deal Codename               │ Status │ #    │ Unack'd  │ Last Upd.  │
├──────────────────────────────┼────────┼──────┼──────────┼────────────┤
│  Project Falcon              │ OPEN   │  14  │    2     │ 2h ago     │
│  Project Neptune             │ OPEN   │   8  │    0     │ 1d ago     │
│  Project Titan               │ OPEN   │  22  │    5     ⚠│ 3d ago     │
│  Project Orion               │ CLOSED │  11  │    —     │ 5d ago     │
└──────────────────────────────┴────────┴──────┴──────────┴────────────┘
```

**IBC alerts from insider lists:**
- Unacknowledged insiders > 48 hours → flag on the list
- Insider added without compliance notification (if workflow bypassed)
- Person added to two conflicting deal lists simultaneously
- Insider list not opened when a deal moves to mandate stage

**AI gap detection:**
Claude cross-references the insider list against the deal team, wall crossing history, and document access logs to identify people who appear to have accessed deal information but are not on the insider list:

> *"3 members of the Leveraged Finance team accessed Project Falcon deal documents in the last 7 days but are not on the insider list. Review whether they should be added."*

IBC can add them with one click or dismiss with a documented reason.

**Regulatory export:**
- ESMA XML export (MAR Article 18 compliant) for any list
- PDF snapshot for internal archival
- All exports logged with IBC identity, timestamp, and SHA-256 content hash

---

### 4. Chinese Wall & Wall Crossing Management

Structured management of information barriers and the process for crossing them.

#### Erecting a Wall

Walls are created by the IBC — either as a conflict condition (auto-created from a conflict decision) or manually:

- **Wall definition**: Specify which individuals or teams are on each side of the wall
- **Scope**: Per-deal wall (most common) or standing wall between business units
- **Data enforcement**: MERIDIAN applies access restrictions at the data layer immediately on creation
- **Duration**: Time-bound (deal wall expires on announcement/abandonment) or standing (ongoing)

#### Wall Crossing Requests

When a banker needs to access information on the other side of a wall:

```
Wall Crossing Request Flow:
  Banker submits request → reason, duration, data needed
         │
         ▼
  IBC reviews request
  → Check: is there a legitimate business need?
  → Check: does the crossing create a new conflict? (AI checks for additional conflicts)
         │
    ┌────┴────────┐
    ▼             ▼
  APPROVE       DENY
  → Time-limited access (configurable: 1–90 days)
  → Notified to both sides of the wall
  → Access expires automatically
  → Logged with all details
```

**Crossing register:**
- All active crossings: who, which wall, duration, business justification, approving IBC
- Expiry tracking with 7-day advance reminder to IBC
- Full history of approved, denied, and expired crossings

---

### 5. Restricted List Management

The IBC maintains the institution's restricted list — companies on which the bank holds MNPI and whose data should be access-controlled across MERIDIAN.

**Restricted list operations:**
- Add a company to the restricted list: specify reason, date, responsible banker
- Remove a company: record date and reason (typically on public announcement)
- Temporary restriction: auto-expires on a set date (e.g., for a time-limited MNPI window)

**Downstream effects (automatic on add):**
- All MERIDIAN modules block unwall-crossed access to the company's data immediately
- Bankers with the company in their coverage universe are notified
- Any pending conflict checks involving this company are flagged to the IBC
- Any open insider lists for deals involving this company are surfaced

**Restricted list audit trail:**
- Every add/remove/change to the restricted list is logged with user, timestamp, and reason
- Attempted accesses to restricted companies are logged (permitted if wall-crossed, blocked otherwise)
- IBC can pull a report of all restricted list access events for any time period

**AI monitoring:**
Claude monitors for events that may imply a company should be added to the restricted list:
- A banker's deal record moves to `MANDATE` stage for a company currently not restricted
- Signal module detects market-sensitive news about a company that the bank appears to be advising
- Multiple bankers access the same company's deal data within a short time window

IBC receives an alert: *"Activity patterns suggest Project Falcon counterparty (Acme Corp) may need to be reviewed for restricted list addition."*

---

### 6. Personal Conflict Disclosure Register

The IBC maintains all personal conflict disclosures from bankers in the business line.

**Disclosure register view:**

| Banker | Type | Company/Person | Declared | Expires | Status |
|--------|------|---------------|---------|---------|--------|
| A. Johnson | Shareholding | TechCo plc | 14 Jan | 14 Jan 2027 | ACTIVE |
| B. Patel | Prior Employment | Acme Corp | 2 Nov | 2 Nov 2026 | ACTIVE |
| C. Lee | Family Relationship | Meridian Capital | 5 Feb | 5 Feb 2027 | UNDER REVIEW |

**IBC actions per disclosure:**
- Review and acknowledge receipt
- Flag a disclosure as requiring recusal review if it is proximate to a live deal
- Set disclosure as `ACTIVE` or `REQUIRES_RECUSAL`
- Request additional information from the disclosing banker

**Automatic deal-team conflict check:**
When any banker is added to a deal team in Pipeline, MERIDIAN checks their active disclosures against all deal parties:
- Match found → IBC is notified with specific finding
- No match → logged as "disclosure check passed" against the deal team addition

**Renewal management:**
- Disclosures expire annually (configurable)
- 60-day advance renewal reminder to banker
- 30-day escalation to IBC if banker has not renewed
- Expired disclosures visible in IBC register with "EXPIRED" status; do not drop off

---

### 7. Conduct Risk Monitoring

AI-powered monitoring of platform activity for conduct risk signals. Not a surveillance tool in the communications-monitoring sense — MERIDIAN monitors structured platform data (deal access patterns, information flows, workflow anomalies) to surface potential policy violations before they become regulatory issues.

#### What MERIDIAN Monitors

**Information flow anomalies:**
- Banker accesses MNPI-classified data for a company they have no declared mandate on
- Banker is on an insider list for a deal and concurrently accessing data for a counterparty
- A banker wall-crossed on Deal A accesses data about Deal B's counterparty without authorisation
- Rapid, broad access to deal data by someone not on the deal team (potential information leak)

**Workflow compliance signals:**
- Deal moves to `MANDATE` stage with no conflict check on record → alert
- Banker added to deal team and has no personal disclosure status checked → alert
- Insider list not opened within [configurable] days of mandate stage → alert
- Conflict condition review date missed → alert to IBC

**Team consistency signals:**
- Same individual on opposing sides of a wall for two deals simultaneously
- Deal team member whose recusal condition is no longer being respected (accessing scoped data)
- Multiple conflict checks with recurring unresolved findings for the same banker or client

#### AI Risk Narrative

Weekly (or on-demand): Claude synthesises platform activity data into a plain-language conduct risk summary for the IBC:

> *"This week, 3 conduct risk signals were flagged. Two are resolved (wall crossing expired and renewed; personal disclosure refreshed). One is open: Analyst R. Kim accessed Project Neptune deal documents on 26 Feb despite not appearing on the insider list. The access was logged and the banker is not wall-crossed on a conflicting deal, but they have not been added to the insider list. Recommended action: review whether R. Kim should be added to the Project Neptune insider list or whether access was inadvertent."*

**Escalation:** IBC can escalate any conduct risk finding to Line 2 Compliance. Finding, evidence, and IBC notes are transferred. Line 2 decision flows back into the compliance record.

---

### 8. Policy Library & Regulatory Q&A

A searchable library of internal compliance policies and external regulatory guidance, with an AI Q&A interface.

#### Policy Library

- **Internal policies**: Conflicts of interest policy, MNPI / restricted list procedure, personal account dealing rules, wall crossing protocol, insider list maintenance procedure, gift and entertainment policy
- **Regulatory guidance**: Relevant extracts from MiFID II, MAR, FCA Handbook, FINRA rules — plain-language summaries with links to source
- **Bulletins**: IBC-authored policy updates, regulatory change briefings, practice notes
- **FAQs**: Common banker questions with IBC-approved answers

All policy documents are versioned, searchable, and linked to the capabilities that enforce them in MERIDIAN.

#### AI Regulatory Q&A

Bankers and IBCs can ask compliance questions in natural language. Claude searches the policy library and answers with citations:

> **Banker:** *"Can I share the Project Neptune teaser with a potential investor before conflict clearance is complete?"*
>
> **MERIDIAN Compliance:** *"No — per the Conflicts of Interest Policy (§4.2), no confidential deal materials may be shared with external parties until a conflict check has been completed and a clearance decision recorded. The conflict check for Project Neptune is currently 'Pending IBC Review'. You should wait for the IBC determination before sharing any materials. If the situation is time-sensitive, contact your IBC directly to expedite review."*

**Source attribution:** every answer cites the specific policy section and version. If Claude cannot find a definitive answer in the policy library, it directs the banker to their IBC rather than speculating.

**Compliance intent — not legal advice:** The Q&A clearly states that responses are based on MERIDIAN's policy library and do not constitute legal advice. Bankers are directed to their IBC for judgment calls.

#### Policy Change Management

When a regulation changes or the internal policy is updated:
- IBC or Line 2 updates the policy document in the library
- Affected bankers receive a notification with a summary of what changed
- AI generates a plain-language "what this means for you" brief per role
- Previous version archived; links to superseded versions preserved for audit

---

### 9. Regulatory Reporting & Export

Structured export capabilities for all compliance records, designed for regulatory examinations and internal audit.

#### Exports Available

| Report | Audience | Format | Trigger |
|--------|---------|--------|---------|
| Insider list (per deal) | Regulator / internal audit | ESMA XML, PDF, CSV | On demand / deal close |
| Conflict check register | Internal audit / regulator | CSV, PDF | On demand / periodic |
| Wall crossing history | Internal audit / regulator | CSV | On demand |
| Restricted list history | Internal audit / regulator | CSV, PDF | On demand |
| Personal disclosure register | Internal audit | CSV | On demand |
| Conduct risk findings log | Internal audit / Line 2 | CSV | On demand |
| AI generation audit log | Internal audit / regulator | CSV | On demand |
| Compliance activity summary | Business Head / Line 2 | PDF dashboard | Monthly |

All exports:
- Timestamped and attributed to the IBC who generated them
- SHA-256 hash of content stored for tamper detection
- Logged in the compliance audit trail

#### Regulatory Examination Pack

For a formal regulatory examination, the IBC can generate a pre-packaged compliance evidence pack:
- Select date range and in-scope deals / bankers / events
- MERIDIAN assembles all relevant records: insider lists, conflict checks, wall crossings, AI audit logs, access logs
- Packaged as a structured PDF with index and tabbed sections
- Signed with institution's digital seal

---

### 10. Certification & Regulatory Status Tracker

Compliance visibility into the regulatory and professional certification status of all bankers in the business line. Ensures bankers hold the approvals they need to do their jobs.

**Tracked certifications and registrations:**

| Certification | Jurisdiction | Governing Body |
|--------------|-------------|---------------|
| FCA Authorised Individual / Controlled Function | UK | FCA (via FCA Register) |
| Senior Manager Function (SMF) | UK | FCA |
| FINRA Series 7, 63, 79, etc. | US | FINRA |
| CFA Charter | Global | CFA Institute |
| AML Training completion | All | Internal policy |
| Annual Compliance Attestation | All | Internal policy |

**Per-banker compliance record:**
- Certifications held, expiry dates, renewal status
- Annual attestation completion (has banker confirmed they've read the conflicts policy, AML policy, etc.)
- Outstanding training requirements

**IBC view:**
- Business-line summary: who is current vs. expired vs. due for renewal
- Alerts: 90/30/7 days before any certification expiry
- Missing attestations: bankers who haven't completed annual compliance sign-off
- Export for Line 2 oversight reporting

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Conflict search | Scan all deals, mandates, relationships, CRM history, personal disclosures for potential conflicts | claude-sonnet-4-6 |
| Conflict report generation | Produce structured findings with severity, evidence, and resolution suggestions | claude-sonnet-4-6 |
| Insider list gap detection | Cross-reference deal data access logs vs. insider list — identify unlisted persons | claude-sonnet-4-6 |
| Restricted list trigger detection | Identify activity patterns suggesting a company should be considered for restricted list | claude-haiku-4-5 |
| Conduct risk narrative | Weekly plain-language synthesis of conduct risk signals and open items | claude-sonnet-4-6 |
| Policy Q&A | Answer compliance questions against the policy library with source citations | claude-sonnet-4-6 |
| Policy change brief | Summarise regulatory changes and their practical implications per role | claude-sonnet-4-6 |
| Examination pack assembly | Collate and structure compliance evidence records for a regulatory examination | claude-opus-4-6 |
| Annual compliance summary | Draft narrative sections of the annual compliance report | claude-sonnet-4-6 |
| Condition review brief | Summarise the status of all active conflict conditions for IBC review | claude-haiku-4-5 |

---

## Data Requirements

### MERIDIAN-Internal Data (primary sources)
- All ConflictCheck and ConflictFinding records (Pipeline + Compliance)
- All InsiderList and InsiderRecord records (Pipeline)
- All PersonalConflictDisclosure records
- Wall crossing records and restricted list (security layer)
- Deal and mandate records from Pipeline (full history)
- CRM interaction and coverage data (via data-layer connectors)
- AI generation audit logs (ai-core)
- Data access audit logs (all modules)

### External / Integrated Data
- **Personal account dealing system** (bank SoR): pre-populate personal shareholdings for disclosure register
- **FCA Register / FINRA BrokerCheck** (public API): validate and refresh certification status
- **Internal HR system**: banker role, team, and reporting line for coverage scope
- **Regulatory databases**: MAR/MiFID regulatory guidance for policy library (manual import + AI summary)

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Pipeline | Conflict checks triggered at deal creation; insider lists managed per deal; mandate data is the primary source for conflict searches |
| Connect | Conflict clearance and wall crossing workflows surface in Connect approval queues for IBC; conduct risk alerts delivered via Connect notification hub |
| Intelligence | Client relationship landscape provides context for conflict search; restricted list applied to company data access |
| Memory | Policy library stored in Memory for semantic search; past conflict decisions searchable as precedent; compliance documentation stored in document vault |
| Signal | Credit and M&A events that may require restricted list updates surfaced to Compliance via Signal |
| Credit | Credit Officer decisions and RBAC for credit access feed into compliance data picture |
| All modules | Compliance enforces data classification, RBAC, and audit logging across the entire platform |

---

## UX Principles for this Module

- **IBC is a power user, not a casual one** — the dashboard must handle high information density without cognitive overload. Summaries first; detail on demand.
- **Every action auditable** — the IBC must be able to demonstrate what they did and why. Every decision includes a mandatory or strongly prompted notes field. The UI should make writing a rationale feel natural, not bureaucratic.
- **Zero ambiguity on AI outputs** — AI findings are clearly presented as "AI identified" not "compliance determined". The IBC owns the decision. The AI owns the research.
- **SLA visibility everywhere** — compliance workflows have real deadlines. Every pending item shows elapsed time and SLA status prominently.
- **Exportable at any moment** — the IBC should never have to prepare for an audit. Any view in the module should be one click from a clean, formatted export.
- **Mobile for approvals** — wall crossing approvals and urgent conflict clearances should be actionable from mobile, with the AI summary accessible before the IBC decides.
