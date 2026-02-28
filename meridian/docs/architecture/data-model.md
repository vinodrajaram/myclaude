# MERIDIAN — Core Data Model

## Overview

The MERIDIAN data model is built around the central entities of banking: Companies, Contacts, Deals, Relationships, Documents, and Market Data. Each module extends these core entities with module-specific data without duplicating the core.

### Data Ownership Model

Not all entities are owned by MERIDIAN. Core banking data — client accounts, KYC status, contacts, coverage assignments, and activity history — lives in the bank's systems of record. MERIDIAN holds **projections** of that data (thin cached copies with a `sorId` reference) and reads from those systems via APIs.

See [systems-of-record.md](systems-of-record.md) for the full integration architecture.

| Ownership Class | Description | Examples |
|----------------|-------------|---------|
| `SOR_READONLY` | Owned by bank SoR; MERIDIAN caches read-only | Client account, KYC status, Contact |
| `SOR_BIDIRECTIONAL` | Owned by bank SoR; MERIDIAN writes back originated records | Activity/Interaction |
| `SOR_TRIGGER` | Owned by SoR; MERIDIAN can trigger actions but not mutate data | KYC initiation |
| `MERIDIAN_OWNED` | Created and mastered in MERIDIAN | Deal, Document, Signal, EWI score |
| `MERIDIAN_WITH_PUSHBACK` | MERIDIAN-mastered; optionally pushed to CRM as reference | Deal/Opportunity |

Every entity schema below is annotated with its ownership class.

---

## Core Entities

### Organization (Institution)
The top-level multi-tenant unit. Each bank is an Organization.

```typescript
Organization {
  id: UUID
  name: string
  type: 'investment_bank' | 'corporate_bank' | 'universal_bank'
  settings: OrganizationSettings
  modules: EnabledModule[]
  createdAt: DateTime
}
```

### User
A banker on the platform.

```typescript
User {
  id: UUID
  organizationId: UUID
  email: string
  name: string
  role: UserRole           // ANALYST | ASSOCIATE | VP | DIRECTOR | MD | RM | CREDIT_ANALYST | ...
  seniority: Seniority     // JUNIOR | MID | SENIOR | EXECUTIVE
  coverageGroups: string[] // Sector or geography coverage assignments
  isWallCrossed: boolean   // MNPI wall-crossing status (per restricted company)
  permissions: Permission[]
  preferences: UserPreferences
}
```

### ClientAccount  `SOR_READONLY`
A legal entity and its product holdings at the bank. Owned by core banking (Temenos, Finacle, FIS). MERIDIAN holds a cached projection keyed on `sorId`.

```typescript
ClientAccount {
  // SoR identity
  sorId: string              // Core banking customer / arrangement ID
  sorSystem: 'TEMENOS' | 'FINACLE' | 'FIS' | 'FINASTRA'
  lastSyncedAt: DateTime
  syncStatus: 'SYNCED' | 'STALE' | 'SYNC_FAILED'

  // MERIDIAN linkage
  id: UUID
  organizationId: UUID
  companyId: UUID            // Linked to MERIDIAN Company via LEI / client reference

  // Projected fields from SoR
  accountType: 'CURRENT' | 'DEPOSIT' | 'LOAN' | 'REVOLVING_CREDIT' | 'BOND' | 'DERIVATIVES'
  currency: string
  balance?: number           // Current balance or utilisation
  limit?: number             // Approved credit limit
  status: 'ACTIVE' | 'DORMANT' | 'CLOSED'
  openedDate: DateTime
  maturityDate?: DateTime

  // Note: Individual transactions remain in core banking — not cached in MERIDIAN
}
```

### KycProfile  `SOR_READONLY + SOR_TRIGGER`
KYC/AML status for a client. Owned by the KYC platform (Encompass, Fenergo, NICE Actimize). MERIDIAN surfaces status and expiry but never modifies the KYC record directly. MERIDIAN may trigger a new KYC case via API.

```typescript
KycProfile {
  // SoR identity
  sorId: string              // KYC platform entity ID
  sorSystem: 'ENCOMPASS' | 'FENERGO' | 'ACTIMIZE' | 'WORLDCHECK'
  lastSyncedAt: DateTime
  syncStatus: 'SYNCED' | 'STALE' | 'SYNC_FAILED'

  // MERIDIAN linkage
  id: UUID
  organizationId: UUID
  companyId: UUID

  // Projected fields
  status: 'APPROVED' | 'PENDING' | 'EXPIRED' | 'REJECTED' | 'IN_REVIEW'
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEP' | 'SANCTIONED'
  lastReviewDate: DateTime
  expiryDate: DateTime
  daysToExpiry: number       // Computed; < 90 triggers Connect alert
  kycOfficer: string

  // Note: KYC documents, beneficial ownership details, and screening records
  // remain in the KYC platform. MERIDIAN links to the SoR URL for deep access.
  sorDeepLink?: string
}
```

### Company  `MERIDIAN_OWNED` (enriched from SoR + external data)
A client or prospect company. The central entity around which all intelligence aggregates. The Company master record is built and owned by MERIDIAN, enriched from external data and linked to SoR records via `clientAccountIds` and `kycProfileId`.

```typescript
Company {
  id: UUID
  organizationId: UUID
  name: string
  legalName: string
  ticker?: string
  isin?: string
  lei?: string              // Legal Entity Identifier — primary linkage key to SoR
  sector: string
  subSector: string
  country: string
  region: string
  currency: string
  companyType: 'PUBLIC' | 'PRIVATE' | 'SOVEREIGN' | 'FINANCIAL_INSTITUTION'
  creditRating?: CreditRating
  isRestricted: boolean     // On restricted list (MNPI)
  relationshipTier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'PROSPECT'
  lastUpdated: DateTime

  // SoR linkages (populated during onboarding / data integration)
  clientAccountIds: string[] // ClientAccount.id values (core banking relationships)
  kycProfileId?: UUID        // KycProfile.id (KYC platform record)

  // Relations
  contacts: Contact[]        // Projected from CRM (see Contact entity)
  coverage: CoverageAssignment[] // Projected from CRM
  deals: Deal[]
  financials: CompanyFinancials[]
  creditProfile?: CreditProfile
  documents: Document[]
  newsItems: NewsItem[]
}
```

### Contact  `SOR_READONLY`
An individual at a client or prospect company. Owned by the bank's CRM (Salesforce FSC, Dynamics 365, DealCloud). MERIDIAN holds a projection updated via API sync and webhook events.

```typescript
Contact {
  // SoR identity
  sorId: string              // CRM record ID (Salesforce Contact.Id, etc.)
  sorSystem: 'SALESFORCE' | 'DYNAMICS' | 'DEALCLOUD' | 'BACKSTOP'
  lastSyncedAt: DateTime
  syncStatus: 'SYNCED' | 'STALE' | 'SYNC_FAILED' | 'SOR_DELETED'

  // MERIDIAN fields
  id: UUID
  organizationId: UUID
  companyId: UUID

  // Projected from CRM
  firstName: string
  lastName: string
  title: string
  seniority: 'C_SUITE' | 'SVP' | 'VP' | 'DIRECTOR' | 'MANAGER'
  email?: string
  phone?: string

  // MERIDIAN-computed (from interaction history)
  lastInteraction?: DateTime
  interactionCount: number
  isMeetingContact: boolean

  // Note: private notes added in MERIDIAN stored on MeridianContactNote
  // (MERIDIAN_OWNED), not written back to CRM
}
```

### CoverageAssignment  `SOR_READONLY`
Maps which banker(s) cover a given company. Owned by the CRM or internal coverage management system. MERIDIAN projects this to power Intelligence module relationship attribution and routing.

```typescript
CoverageAssignment {
  // SoR identity
  sorId: string
  sorSystem: 'SALESFORCE' | 'DYNAMICS' | 'INTERNAL_COVERAGE_DB'
  lastSyncedAt: DateTime

  // MERIDIAN fields
  id: UUID
  organizationId: UUID
  companyId: UUID
  userId: UserId             // The covering banker

  // Coverage details
  coverageType: 'PRIMARY_RM' | 'SECONDARY_RM' | 'COVERAGE_BANKER' | 'PRODUCT_BANKER' | 'CREDIT_ANALYST'
  product?: string           // For product bankers: M&A | DCM | ECM | LEVFIN | FX | CASH_MGMT
  effectiveDate: DateTime
  endDate?: DateTime         // Null = currently active
  region?: string
  sector?: string
}
```

### Interaction  `SOR_BIDIRECTIONAL`
Any client touchpoint: meeting, call, email, note. Historical interactions are projected from the CRM. New interactions originated in MERIDIAN are written back to the CRM (with configurable opt-out per org).

```typescript
Interaction {
  // SoR identity (null for MERIDIAN-originated until write-back completes)
  sorId?: string             // CRM activity/task ID after write-back
  sorSystem?: 'SALESFORCE' | 'DYNAMICS' | 'DEALCLOUD'
  lastSyncedAt?: DateTime
  syncStatus: 'MERIDIAN_ONLY' | 'SYNCED' | 'WRITE_BACK_PENDING' | 'WRITE_BACK_FAILED' | 'SOR_SOURCED'

  // MERIDIAN fields
  id: UUID
  organizationId: UUID
  companyId: UUID
  contactIds: UUID[]
  userId: UUID               // Banker who logged interaction
  origin: 'MERIDIAN' | 'CRM_SYNC' | 'CALENDAR_IMPORT'

  // Interaction data
  type: 'MEETING' | 'CALL' | 'EMAIL' | 'NOTE' | 'CONFERENCE'
  date: DateTime
  duration?: number          // Minutes
  summary: string
  aiSummary?: string         // AI-generated summary — stored in MERIDIAN only, not written back
  actionItems: ActionItem[]
  dealId?: UUID
  isConfidential: boolean    // Confidential interactions not written back to shared CRM
}
```

### Deal  `MERIDIAN_OWNED` (optional push to CRM as Opportunity)
A deal opportunity from origination through close. MERIDIAN is the system of record for the deal pipeline. Optionally synced to the CRM as an Opportunity record for visibility, but the canonical data lives in MERIDIAN.

```typescript
Deal {
  id: UUID
  organizationId: UUID
  companyId: UUID
  name: string
  type: DealType             // MA_BUYSIDE | MA_SELLSIDE | IPO | FOLLOW_ON | BOND | LOAN | ...
  stage: DealStage           // IDEA | PITCHED | MANDATE | EXECUTION | CLOSED | LOST
  value?: number
  currency: string
  estimatedFee?: number
  probability: number        // 0-100
  targetClose?: DateTime
  mandateDate?: DateTime
  closeDate?: DateTime
  leadBanker: UserId
  dealTeam: UserId[]
  products: string[]
  status: 'ACTIVE' | 'ON_HOLD' | 'CLOSED_WON' | 'CLOSED_LOST'
  notes: string

  // Optional CRM sync (pushback)
  crmOpportunityId?: string  // Salesforce Opportunity.Id if pushed to CRM
  crmSyncEnabled: boolean

  // Relations
  pitches: Pitch[]
  documents: Document[]
  milestones: DealMilestone[]
  insiderList?: InsiderList  // Deal insider list for MAR/regulatory compliance
  creditFacility?: CreditFacility
}
```

### InsiderList  `MERIDIAN_OWNED`
A deal-level insider list. Records all individuals (bankers and third parties) who have been granted access to material non-public information (MNPI) about a specific deal. Required for regulatory compliance under EU Market Abuse Regulation (MAR) Article 18, FCA DTR, and equivalent SEC obligations.

MERIDIAN is the system of record for insider lists. The list is immutable once a record is written — deletions are logical (endDate set), never physical. Every change is audit-logged.

```typescript
InsiderList {
  id: UUID
  organizationId: UUID
  dealId: UUID               // The deal this list belongs to
  dealCodeName: string       // Internal codename (e.g., "Project Falcon") — MNPI codename
  status: 'OPEN' | 'CLOSED' // Closed when deal is announced/abandoned
  openedAt: DateTime
  closedAt?: DateTime
  complianceOwnerId: UserId  // Compliance officer responsible for this list
  lastReviewDate?: DateTime
  // Relations
  insiders: InsiderRecord[]
  exportHistory: InsiderListExport[]
}
```

### InsiderRecord  `MERIDIAN_OWNED`
An individual entry on a deal's insider list. Records the person, their role, the reason they were granted access, when access was granted and (if applicable) revoked.

MAR Article 18 requires: full name, date of birth, professional telephone number, company and personal telephone, function and reason for inclusion, date the person obtained MNPI, date the person ceased to be an insider.

```typescript
InsiderRecord {
  id: UUID
  insiderListId: UUID
  dealId: UUID

  // Person identity
  personType: 'INTERNAL_BANKER' | 'EXTERNAL_ADVISOR' | 'EXTERNAL_COUNTERPARTY' | 'SERVICE_PROVIDER'
  userId?: UserId            // If internal banker — links to MERIDIAN user
  // For external persons (not MERIDIAN users):
  externalName?: string
  externalEmployer?: string
  externalTitle?: string
  externalEmail?: string
  externalPhone?: string
  externalDateOfBirth?: Date // Required for MAR compliance for external persons

  // Access record
  role: string               // e.g., 'Lead Banker', 'External Legal Counsel', 'Financial Advisor'
  reasonForAccess: string    // Why this person needs MNPI access
  accessGrantedAt: DateTime  // Date/time MNPI was first shared
  accessRevokedAt?: DateTime // Date/time access ended (null = still active)
  grantedBy: UserId          // Which MERIDIAN user added this person to the list
  revokedBy?: UserId

  // Acknowledgement
  acknowledgementRequired: boolean
  acknowledgedAt?: DateTime  // Datetime insider acknowledged their obligations
  acknowledgementMethod?: 'IN_APP' | 'EMAIL' | 'PAPER'

  // Audit
  createdAt: DateTime
  updatedAt: DateTime
  // Note: records are never hard-deleted — revokedAt is set instead
}
```

### InsiderListExport  `MERIDIAN_OWNED`
A record of every time an insider list was exported (for regulatory submission or review). Exports are immutable snapshots.

```typescript
InsiderListExport {
  id: UUID
  insiderListId: UUID
  exportedAt: DateTime
  exportedBy: UserId
  reason: string             // 'REGULATORY_REQUEST' | 'INTERNAL_REVIEW' | 'DEAL_CLOSE'
  format: 'CSV' | 'PDF' | 'ESMA_XML'  // ESMA XML for EU MAR submissions
  recipientDetails?: string  // If submitted to regulator, record to whom
  snapshotHash: string       // SHA-256 of export content — tamper detection
}
```

### ConflictCheck  `MERIDIAN_OWNED`
A conflict of interest clearance request. Initiated by a banker when creating a new deal or engagement. Contains the AI-generated findings and the IBC's final determination.

```typescript
ConflictCheck {
  id: UUID
  organizationId: UUID
  dealId?: UUID              // Linked deal (if triggered from Pipeline deal creation)
  status: 'PENDING_AI' | 'PENDING_IBC' | 'CLEARED' | 'CONDITIONALLY_CLEARED' | 'BLOCKED' | 'WITHDRAWN'

  // Engagement scope (what the banker is proposing)
  proposedClientId?: UUID    // MERIDIAN company ID of the primary client
  proposedCounterparties: UUID[]  // Other parties in the transaction
  dealType: string
  product: string
  proposedDealTeam: UserId[]
  engagementDescription: string

  // Workflow
  requestedBy: UserId
  requestedAt: DateTime
  ibcOwnerId?: UserId        // IBC assigned to review
  assignedAt?: DateTime
  decidedAt?: DateTime
  decisionBy?: UserId        // IBC who made the final determination

  // Decision
  overallDecision?: 'CLEARED' | 'CONDITIONALLY_CLEARED' | 'BLOCKED'
  decisionRationale?: string
  conditions?: ConflictCondition[]
  appealable: boolean        // Whether a BLOCKED decision can be appealed to Line 2

  // Relations
  findings: ConflictFinding[]
  personalDisclosures: PersonalConflictDisclosure[]
  auditLog: ConflictAuditEntry[]
}
```

### ConflictFinding  `MERIDIAN_OWNED`
A single potential conflict identified by the AI search within a ConflictCheck. The IBC reviews each finding individually before making the overall determination.

```typescript
ConflictFinding {
  id: UUID
  conflictCheckId: UUID

  // AI-generated finding
  conflictType: 'MANDATE_CONFLICT' | 'COUNTERPARTY_CONFLICT' | 'PRINCIPAL_CONFLICT' | 'ROLE_CONFLICT' | 'PERSONAL_CONFLICT'
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'
  description: string        // AI-written plain-language description of the conflict
  evidence: ConflictEvidence[]  // Source records that triggered this finding (deals, mandates, relationships)
  aiSuggestedResolution: 'DECLINE' | 'ERECT_WALL' | 'DISCLOSE_TO_CLIENT' | 'RECUSE_BANKER' | 'CLEAR'
  aiConfidence: number       // 0-1 confidence score for this finding

  // IBC determination on this specific finding
  ibcDetermination?: 'ACCEPTED' | 'DISMISSED' | 'ESCALATED'
  ibcNotes?: string          // IBC reasoning (required for ACCEPTED or ESCALATED)
  determinedBy?: UserId
  determinedAt?: DateTime
}

interface ConflictEvidence {
  entityType: 'DEAL' | 'CLIENT_RELATIONSHIP' | 'MANDATE' | 'ADVISORY_ENGAGEMENT' | 'PERSONAL_DISCLOSURE'
  entityId: string
  entityName: string         // Human-readable name of the source
  relevance: string          // AI explanation of why this is relevant evidence
}

interface ConflictCondition {
  id: UUID
  description: string        // e.g., "Chinese wall to be erected between DCM desk and advisory team"
  conditionType: 'CHINESE_WALL' | 'CLIENT_DISCLOSURE' | 'BANKER_RECUSAL' | 'SCOPE_LIMITATION' | 'PERIODIC_REVIEW'
  enforcedInMeridian: boolean
  reviewFrequencyDays?: number
  nextReviewDate?: DateTime
  status: 'ACTIVE' | 'BREACHED' | 'LIFTED'
  liftedAt?: DateTime
  liftedBy?: UserId
}
```

### PersonalConflictDisclosure  `MERIDIAN_OWNED`
A banker's self-declared personal interest that may be relevant to deals they join. Maintained in a register by the IBC. Cross-referenced automatically when a banker is added to a deal team.

```typescript
PersonalConflictDisclosure {
  id: UUID
  organizationId: UUID
  disclosingUserId: UserId   // The banker making the disclosure
  ibcReviewerId?: UserId     // IBC who reviewed this disclosure

  disclosureType:
    | 'PERSONAL_SHAREHOLDING'    // Personal stake in a public or private company
    | 'FAMILY_RELATIONSHIP'      // Spouse, parent, child, etc. at a counterparty
    | 'PRIOR_EMPLOYMENT'         // Former employer involved in deals
    | 'OUTSIDE_BUSINESS_INTEREST'// Directorship, advisory role outside the bank
    | 'OTHER'

  // Details
  description: string
  companyId?: UUID           // If disclosure relates to a specific MERIDIAN company
  companyName?: string       // If company not yet in MERIDIAN
  relationshipDescription?: string
  estimatedValue?: number    // For shareholdings
  currency?: string

  // Status
  status: 'ACTIVE' | 'EXPIRED' | 'WITHDRAWN' | 'UNDER_REVIEW'
  disclosedAt: DateTime
  reviewedAt?: DateTime
  ibcNotes?: string
  expiryDate: DateTime       // Disclosures require periodic renewal (default: annual)
  renewalReminderSentAt?: DateTime
}
```

### Interaction  (see above for full schema)
Any client touchpoint: meeting, call, email, note.

### Document
Any file stored in the platform.

```typescript
Document {
  id: UUID
  organizationId: UUID
  name: string
  type: DocumentType         // PITCH_BOOK | CIM | CREDIT_MEMO | BRIEFING_NOTE | MODEL | ...
  companyId?: UUID
  dealId?: UUID
  createdBy: UserId
  version: number
  storageKey: string         // S3/blob storage key
  vectorIndexed: boolean     // Whether embedded for semantic search
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED'
  accessList?: UserId[]      // If restricted, who can access
  createdAt: DateTime
  updatedAt: DateTime
  metadata: DocumentMetadata
}
```

---

## Module-Specific Entities

### CompanyFinancials (Intelligence + Credit)
```typescript
CompanyFinancials {
  id: UUID
  companyId: UUID
  period: string             // '2024A', '2025E', '2025Q1', etc.
  periodType: 'ANNUAL' | 'QUARTERLY' | 'LTM'
  source: 'BLOOMBERG' | 'FACTSET' | 'MANUAL' | 'AI_EXTRACTED'
  revenue?: number
  ebitda?: number
  ebitdaMargin?: number
  netIncome?: number
  totalDebt?: number
  netDebt?: number
  cashAndEquivalents?: number
  totalAssets?: number
  equity?: number
  leverage?: number          // Net Debt / EBITDA
  interestCoverage?: number
  currency: string
  updatedAt: DateTime
}
```

### CreditProfile (Credit module)
```typescript
CreditProfile {
  id: UUID
  companyId: UUID
  internalRating?: string
  externalRating?: CreditRating
  ratingOutlook: 'STABLE' | 'POSITIVE' | 'NEGATIVE' | 'WATCH'
  pd?: number                // Probability of default (%)
  lgd?: number               // Loss given default (%)
  creditLimit?: number
  currentExposure?: number
  facilityIds: UUID[]
  ewiScore?: number          // Early Warning Indicator score (0-100, lower is better)
  ewiTrend: 'IMPROVING' | 'STABLE' | 'DETERIORATING'
  lastReviewDate?: DateTime
  nextReviewDate?: DateTime
  reviewCycle: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY'
  creditOfficer: UserId
}
```

### CreditFacility (Credit module)
```typescript
CreditFacility {
  id: UUID
  companyId: UUID
  creditProfileId: UUID
  facilityType: string       // REVOLVING_CREDIT | TERM_LOAN_A | TERM_LOAN_B | BOND | ...
  currency: string
  originalAmount: number
  outstandingAmount: number
  maturityDate: DateTime
  interestRate: string       // "SOFR + 250bps"
  purpose: string
  covenants: Covenant[]
  status: 'CURRENT' | 'WAIVER_REQUESTED' | 'BREACH' | 'MATURED'
}
```

### Covenant (Credit module)
```typescript
Covenant {
  id: UUID
  facilityId: UUID
  name: string               // e.g., "Net Leverage Ratio"
  type: 'FINANCIAL' | 'INFORMATION' | 'AFFIRMATIVE' | 'NEGATIVE'
  threshold: number
  thresholdType: 'MAX' | 'MIN'
  testFrequency: 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'
  currentValue?: number
  lastTestDate?: DateTime
  nextTestDate?: DateTime
  status: 'COMPLIANT' | 'HEADROOM_TIGHT' | 'WAIVER_ACTIVE' | 'BREACH'
  headroom?: number          // % headroom to covenant level
  waivers: CovenantWaiver[]
}
```

### SignalItem (Signal module)
```typescript
SignalItem {
  id: UUID
  type: 'NEWS' | 'FILING' | 'EARNINGS' | 'RATING_ACTION' | 'MA_ANNOUNCEMENT' | 'MARKET_DATA'
  companyId?: UUID
  sector?: string
  title: string
  summary: string
  aiSummary?: string         // AI-synthesized relevance summary
  source: string
  sourceUrl?: string
  publishedAt: DateTime
  relevanceScore: number     // 0-1, AI-scored relevance to user's coverage
  tags: string[]
  isTriggerEvent: boolean    // Signals potential deal opportunity
  isRead: boolean
  isSaved: boolean
}
```

### MarketDataSnapshot (Signal module)
```typescript
MarketDataSnapshot {
  id: UUID
  type: 'EQUITY' | 'CREDIT_SPREAD' | 'INTEREST_RATE' | 'FX' | 'COMMODITY'
  identifier: string         // Ticker, ISIN, index name
  value: number
  currency: string
  change1d?: number
  change1w?: number
  change1m?: number
  timestamp: DateTime
  source: string
}
```

### TimeEntry  `MERIDIAN_OWNED`  (Talent module)
A single logged unit of time, either AI-inferred from MERIDIAN platform activity or manually entered by the analyst. Confirmed by the analyst during their daily review.

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
  dealId?: UUID              // Linked deal (from Pipeline)
  companyId?: UUID           // Linked client (if not deal-specific)
  activityType: ActivityType // See taxonomy in module spec
  description?: string

  // Provenance
  source: 'INFERRED' | 'MANUAL' | 'CALENDAR_IMPORT'
  inferredFrom?: string      // e.g., 'forge.document_edit:doc_abc' — source event
  inferenceConfidence?: number  // 0-1 for INFERRED entries

  // Analyst review
  analystConfirmed: boolean
  confirmedAt?: DateTime
  correctedFromId?: UUID     // Points to the inferred entry this corrected/replaced
}
```

### CapacityProfile  `MERIDIAN_OWNED`  (Talent module)
A weekly rollup of a banker's time, computed from TimeEntry records. Generated every Monday for the prior week. Includes AI narrative and wellbeing flags.

```typescript
CapacityProfile {
  id: UUID
  userId: UserId
  weekStartDate: Date        // Monday of the week

  // Totals
  totalHours: number
  confirmedHours: number     // Hours reviewed and confirmed by analyst
  inferredUnconfirmedHours: number

  // Breakdowns
  byActivityType: Record<ActivityType, number>  // Hours per activity type
  byDealId: Record<UUID, number>                // Hours per deal

  // Benchmarking (computed at snapshot time)
  personalBaselineHours: number  // Rolling 8-week average for this user
  peerAverageHours: number       // Cohort average for same role/seniority
  vsPersonalBaseline: number     // % variance
  vsPeerAverage: number

  // Status
  capacityStatus: 'HIGH' | 'MED' | 'LOW' | 'CRITICAL'
  wellbeingFlags: WellbeingFlag[]

  // AI narrative (generated weekly)
  aiTeamSummary?: string     // For manager — about the team
  aiPersonalSummary?: string // For the analyst — about themselves
}

type WellbeingFlag =
  | 'HOURS_AMBER'              // > 85h this week
  | 'HOURS_RED'                // > 95h this week
  | 'LATE_NIGHT_PATTERN'       // > 10h after 11pm this week
  | 'WEEKEND_INTENSITY'        // > 15h weekend this week
  | 'CONSECUTIVE_INTENSITY'    // 10+ consecutive 12h+ days
```

### DealTimeEconomics  `MERIDIAN_OWNED`  (Talent module)
Aggregated time and economic data for a single deal, updated as time entries are confirmed. Used for deal-level ROI analytics and business strategy reporting.

```typescript
DealTimeEconomics {
  id: UUID
  dealId: UUID
  asOfDate: DateTime         // Snapshot timestamp

  // Time totals by seniority
  analystHours: number
  associateHours: number
  vpDirectorHours: number
  mdHours: number
  totalHours: number

  // Activity breakdown (across all contributors)
  byActivityType: Record<ActivityType, number>

  // Pitch vs. execution split
  preMandateHours: number
  postMandateHours: number

  // Deal economics (populated when fee data available via SoR integration)
  feeRevenue?: number
  currency?: string
  impliedJuniorCostBasis?: number  // Based on org-configured blended rates
  timeWeightedMargin?: number      // (feeRevenue - costBasis) / feeRevenue
  revenuePerJuniorHour?: number    // feeRevenue / (analystHours + associateHours)

  // AI narrative
  aiEconomicsNarrative?: string
}
```

---

## Data Relationships Diagram

```
Organization
    │
    ├── Users ──────────────────────────────────────┐
    │                                                │
    ├── Companies ──────────────────────────────┐    │
    │       │                                   │    │
    │       ├── Contacts ◄──── Interactions ◄───┼────┤
    │       │                                   │    │
    │       ├── Deals ──────────────────────────┼────┤
    │       │       │                           │    │
    │       │       └── Pitches                 │    │
    │       │                                   │    │
    │       ├── CompanyFinancials               │    │
    │       │                                   │    │
    │       ├── CreditProfile                   │    │
    │       │       └── CreditFacilities        │    │
    │       │               └── Covenants       │    │
    │       │                                   │    │
    │       ├── Documents ◄──────────────────────┘    │
    │       │                                         │
    │       └── SignalItems                           │
    │                                                 │
    └── ────────────────────────────────────────────┘
```

---

## Database Technology

### Primary Database: PostgreSQL
- All core entities
- Prisma ORM for type-safe queries
- Per-module schema namespaces
- Row-level security for multi-tenant isolation

### Cache Layer: Redis
- Session data
- Frequently accessed company profiles
- Rate limit counters
- Real-time notification delivery

### Vector Database: pgvector (or Pinecone)
- Document embeddings for semantic search
- Company profile embeddings for similarity
- Precedent transaction embeddings

### Time-Series: PostgreSQL (with TimescaleDB extension)
- Market data snapshots
- EWI score history
- Covenant value history

---

## Data Residency and Retention

| Data Type | Retention | Residency |
|-----------|-----------|-----------|
| Client financial data | 7 years | Configurable (EU/US/APAC) |
| Deal records | 10 years | Org's primary region |
| AI audit logs | 7 years | Org's primary region |
| Documents | Configurable | Org's primary region |
| Market data snapshots | 1 year (rolling) | Any region |
| Session data | 24 hours | Any region |
