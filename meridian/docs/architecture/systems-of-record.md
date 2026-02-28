# MERIDIAN — Systems of Record Integration

## Principle

**MERIDIAN does not own core banking data. It reads from it.**

Client accounts, KYC status, contacts, coverage assignments, and activity history are owned by the bank's existing systems of record (SoR). MERIDIAN is the intelligence layer that sits on top of these systems — surfacing, synthesising, and augmenting data — not replacing or duplicating the records beneath.

This has concrete implications:
- The bank's CRM (Salesforce, Dynamics, DealCloud) remains the contact and activity system of truth
- The bank's core banking system (Temenos, Finacle, FIS) remains the account and facility system of truth
- The bank's KYC platform (Encompass, Fenergo) remains the compliance record system of truth
- MERIDIAN *reads* from all of these via APIs; it *writes back* only data it originates (e.g., a new meeting note logged in MERIDIAN is pushed back to the CRM)

---

## Systems Map

```
┌──────────────────────────────────────────────────────────────────────┐
│                     BANK SYSTEMS OF RECORD                           │
│                                                                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Core Banking   │  │   KYC / AML      │  │   CRM            │   │
│  │                 │  │                  │  │                  │   │
│  │ Temenos T24     │  │ Encompass        │  │ Salesforce FSC   │   │
│  │ Finacle         │  │ Fenergo          │  │ MS Dynamics 365  │   │
│  │ FIS             │  │ NICE Actimize    │  │ DealCloud (IB)   │   │
│  │ Finastra        │  │ Refinitiv        │  │ Backstop (Alt)   │   │
│  │                 │  │ World-Check      │  │                  │   │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘   │
│           │                   │                      │              │
└───────────┼───────────────────┼──────────────────────┼─────────────┘
            │                   │                      │
            └───────────────────┼──────────────────────┘
                                │
                   ┌────────────▼────────────┐
                   │  MERIDIAN DATA LAYER     │
                   │  shared/data-layer/      │
                   │                          │
                   │  ┌────────────────────┐  │
                   │  │  Connector Layer   │  │
                   │  │  (per SoR adapter) │  │
                   │  └────────────────────┘  │
                   │  ┌────────────────────┐  │
                   │  │  SoR Cache         │  │
                   │  │  (TTL + invalidate)│  │
                   │  └────────────────────┘  │
                   │  ┌────────────────────┐  │
                   │  │  Write-Back Queue  │  │
                   │  │  (async, retried)  │  │
                   │  └────────────────────┘  │
                   └────────────┬─────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   MERIDIAN MODULES       │
                   │   (Intelligence, etc.)   │
                   └─────────────────────────┘
```

---

## Entity Ownership Classification

Every data entity in MERIDIAN has an ownership class that dictates where the master record lives and how MERIDIAN interacts with it.

| Entity | Owner | MERIDIAN Role | Write-Back |
|--------|-------|---------------|-----------|
| **Client / Legal Entity** | Core Banking | Read + cache | No |
| **Account / Product Holding** | Core Banking | Read + cache | No |
| **Credit Facility** | Core Banking / Credit System | Read + cache | No |
| **KYC Status & Risk Classification** | KYC Platform | Read + cache | Trigger only |
| **KYC Documents** | KYC Platform | Read reference | No |
| **Contact (person)** | CRM | Read + cache | New contacts only |
| **Coverage Assignment** | CRM / Coverage System | Read + cache | No |
| **Activity / Interaction** | CRM | Bi-directional | Yes — MERIDIAN-originated |
| **Deal / Opportunity** | MERIDIAN (Pipeline) | Owned | Optional push to CRM |
| **Document (Forge output)** | MERIDIAN (Memory/Forge) | Owned | No |
| **AI outputs** | MERIDIAN | Owned | No |
| **Signal items** | MERIDIAN (Signal) | Owned | No |
| **EWI scores** | MERIDIAN (Credit) | Owned | No |
| **Meeting briefs** | MERIDIAN (Connect/Intelligence) | Owned | Optional log to CRM |

**Key rule**: For SoR-owned entities, MERIDIAN never mutates the canonical record. It holds a cached projection for performance, clearly stamped with `lastSyncedAt` and `sorId`.

---

## Integration Patterns

### Pattern 1: Read-Through Cache (most SoR-owned entities)

Used for: Client/Account, Contact, Coverage, KYC Status, Credit Facility

```
Request → Check MERIDIAN cache (Redis / Postgres)
              │
              ├── Cache HIT and fresh (< TTL) → Return cached projection
              │
              └── Cache MISS or stale:
                      │
                      ├── Fetch from SoR API
                      ├── Validate and normalise to MERIDIAN schema
                      ├── Store in MERIDIAN cache with lastSyncedAt + TTL
                      └── Return to caller
```

**TTLs by entity:**

| Entity | Default TTL | Notes |
|--------|-------------|-------|
| Client / Legal Entity | 24 hours | Rarely changes; critical changes pushed via webhook |
| Contact | 4 hours | LinkedIn/job title changes are low urgency |
| Coverage Assignment | 1 hour | Coverage changes trigger immediate webhook |
| KYC Status | 1 hour | Expiry approaching triggers refresh |
| Account / Product Holdings | 15 minutes | More dynamic; used for credit exposure views |
| Credit Facility | 30 minutes | Covenant actuals are more real-time sensitive |

---

### Pattern 2: Event-Driven Sync (preferred for change-sensitive entities)

Used for: Coverage changes, KYC status changes, new account openings, facility status changes

SoR publishes events (via webhook, Kafka, or MQ) → MERIDIAN's webhook consumer receives and updates cache:

```
SoR Event:  COVERAGE_CHANGED (clientId, previousOwner, newOwner, effectiveDate)
                │
                ▼
    MERIDIAN Webhook Consumer
                │
                ├── Validate event signature
                ├── Update coverage cache record immediately
                ├── Invalidate related Intelligence views for this client
                ├── Notify affected bankers via Connect notification
                └── Log to audit trail
```

**Supported inbound event types:**

| Event | Source System | MERIDIAN Action |
|-------|--------------|----------------|
| `client.created` | Core Banking / Onboarding | Create client record in cache |
| `client.updated` | Core Banking | Refresh cache |
| `kyc.status_changed` | KYC Platform | Refresh KYC cache, alert if expired |
| `kyc.expiry_approaching` | KYC Platform | Surface in Connect notification |
| `coverage.changed` | CRM | Update coverage, notify new banker |
| `account.opened` | Core Banking | Refresh product holdings cache |
| `facility.amended` | Credit System | Refresh facility cache |
| `contact.updated` | CRM | Refresh contact cache |
| `activity.created` | CRM | Ingest into interaction history |

---

### Pattern 3: Bi-Directional Sync for Activities / Interactions

Activities are the most complex case: the CRM holds historical activities, but MERIDIAN generates new ones (post-meeting AI summaries, logged calls).

**Read flow (inbound):**
```
On startup and on schedule:
  Fetch last N months of activities from CRM API
  → Normalise to Interaction schema
  → Store in MERIDIAN with sorId (CRM record ID) + lastSyncedAt
  → Index in vector store for semantic search (Memory module)
```

**Write-back flow (outbound):**
```
Banker logs meeting in MERIDIAN (or AI auto-generates meeting note):
  1. Store Interaction in MERIDIAN immediately (optimistic)
  2. Enqueue write-back job
  3. Write-back job:
      a. Translate Interaction → CRM activity payload
      b. POST to CRM API
      c. Receive CRM record ID
      d. Update MERIDIAN record with sorId
      e. Mark as synced
  4. On failure:
      a. Retry with exponential backoff (3 attempts)
      b. After max retries: alert ops, mark as sync_failed
      c. Record remains in MERIDIAN; manual re-sync available
```

**Conflict resolution:**
- If CRM record has been modified since MERIDIAN last fetched: CRM wins (CRM is SoR)
- MERIDIAN-originated records can be updated in MERIDIAN; changes queued for write-back

---

### Pattern 4: Trigger-Only Write (KYC initiation)

MERIDIAN never updates KYC data directly. But it can trigger a KYC action in the SoR:

```
MERIDIAN Connect workflow: "Initiate KYC Refresh"
  → POST /kyc-platform/api/v1/cases  (create KYC case)
  → KYC platform handles the process
  → KYC platform webhooks MERIDIAN when complete
  → MERIDIAN updates KYC cache with new status
```

This keeps MERIDIAN in the triggering role; the KYC platform remains the compliance record.

---

## System-by-System Integration Specs

### CRM: Salesforce Financial Services Cloud

**MERIDIAN entities served:** Contact, Coverage Assignment, Activity/Interaction

**Authentication:** OAuth 2.0 Connected App (client credentials flow for service account; delegated flow for write-back on behalf of user)

**Key API operations:**

```typescript
// Read: Contact
GET /services/data/v59.0/sobjects/Contact/{id}
GET /services/data/v59.0/query?q=SELECT+Id,Name,Title,AccountId,...+FROM+Contact+WHERE+AccountId='{clientId}'

// Read: Coverage (custom object or relationship)
GET /services/data/v59.0/query?q=SELECT+Id,OwnerId,Coverage_Banker__c,...+FROM+Account+WHERE+Id='{clientId}'

// Read: Activities
GET /services/data/v59.0/query?q=SELECT+Id,Subject,ActivityDate,Description,...+FROM+Task+WHERE+WhatId='{clientId}'

// Write-back: New Activity
POST /services/data/v59.0/sobjects/Task
Body: { Subject, ActivityDate, Description, WhatId (clientId), WhoId (contactId), Status, OwnerId }

// Write-back: New Contact (if MERIDIAN creates a contact not yet in Salesforce)
POST /services/data/v59.0/sobjects/Contact
```

**Salesforce → MERIDIAN field mapping:**

| Salesforce Field | MERIDIAN Field | Notes |
|-----------------|---------------|-------|
| `Contact.Id` | `sorId` | Salesforce record ID |
| `Contact.FirstName + LastName` | `firstName + lastName` | |
| `Contact.Title` | `title` | |
| `Contact.Email` | `email` | |
| `Contact.Phone` | `phone` | |
| `Contact.AccountId` | `companyId` (via Account.ExternalId) | Joined via Account |
| `Account.OwnerId` | `coverageOwnerId` | Primary RM / banker |
| `Task.Subject` | `summary` | Activity title |
| `Task.Description` | `notes` | Full activity notes |
| `Task.ActivityDate` | `date` | |
| `Task.Type` | `type` | Mapped: Call→CALL, Meeting→MEETING |

---

### CRM: DealCloud (Investment Banking)

Used by IB-focused firms that prefer IB-specific CRM over Salesforce.

**MERIDIAN entities served:** Contact, Deal/Relationship, Activity

**Authentication:** OAuth 2.0 + API key

**Key API operations:**

```typescript
// Read: Contacts (Entities in DealCloud terminology)
GET /api/v2/entities?entityType=Contact&filter=firm.id:{clientId}

// Read: Interactions
GET /api/v2/interactions?firmId={clientId}&since={lastSyncDate}

// Write-back: Log interaction
POST /api/v2/interactions
Body: { firmId, contactIds, date, type, subject, notes, dealId? }

// Read: Coverage / relationship
GET /api/v2/relationships?firmId={clientId}
```

---

### CRM: Microsoft Dynamics 365

**MERIDIAN entities served:** Contact, Account, Activity

**Authentication:** Microsoft Identity Platform (OAuth 2.0 / MSAL); Microsoft Graph API

**Key API operations:**

```typescript
// Read: Contacts
GET /api/data/v9.2/contacts?$filter=_parentcustomerid_value eq '{accountId}'

// Read: Activities
GET /api/data/v9.2/activitypointers?$filter=regardingobjectid_account/accountid eq '{accountId}'

// Write-back: Phone call activity
POST /api/data/v9.2/phonecalls
Body: { subject, description, scheduledstart, actualend, regardingobjectid_account@odata.bind }
```

---

### KYC Platform: Encompass / Fenergo

**MERIDIAN entities served:** KYC Status, Risk Classification, Beneficial Ownership summary, KYC expiry

**Authentication:** OAuth 2.0 service account

**Key API operations:**

```typescript
// Read: KYC profile for client
GET /api/v1/entities/{leiOrClientId}/kyc-profile
Response: { status, riskRating, lastReviewDate, expiryDate, kycOfficer, beneficialOwners }

// Read: KYC case history
GET /api/v1/entities/{leiOrClientId}/cases

// Trigger: Initiate KYC refresh
POST /api/v1/cases
Body: { entityId, caseType: 'PERIODIC_REVIEW', requestedBy, justification }

// Webhook inbound: KYC status change
POST {meridian_webhook_url}/kyc/status-changed
Body: { entityId, previousStatus, newStatus, effectiveDate, caseId }
```

**MERIDIAN KYC projection** (cached, read-only):

```typescript
KycProfile {
  sorId: string           // Encompass/Fenergo entity ID
  companyId: UUID         // MERIDIAN company ID
  status: 'APPROVED' | 'PENDING' | 'EXPIRED' | 'REJECTED' | 'IN_REVIEW'
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEP' | 'SANCTIONED'
  lastReviewDate: DateTime
  expiryDate: DateTime
  daysToExpiry: number    // Computed; triggers alert if < 90
  kycOfficer: string
  lastSyncedAt: DateTime
  // Note: full KYC documents remain in KYC platform — not cached in MERIDIAN
}
```

---

### Core Banking: Temenos T24 / Finacle / FIS

**MERIDIAN entities served:** Client Legal Entity, Account/Product Holdings, Credit Facilities, Balances

**Authentication:** Mutual TLS (mTLS) with service account certificate; REST API or SOAP depending on system version

**Key API operations (Temenos T24 example):**

```typescript
// Read: Customer master
GET /api/v1/customers/{customerId}
Response: { id, legalName, lei, registrationNumber, country, segment, status }

// Read: Product holdings (accounts, facilities)
GET /api/v1/customers/{customerId}/arrangements
Response: [{ arrangementId, productId, productType, currency, startDate, maturityDate, currentBalance, status }]

// Read: Credit exposure
GET /api/v1/customers/{customerId}/credit-exposure
Response: { approvedLimit, utilised, available, facilities: [...] }
```

**MERIDIAN Account projection:**

```typescript
ClientAccount {
  sorId: string            // Core banking customer/arrangement ID
  companyId: UUID          // MERIDIAN company ID (linked by LEI or client reference)
  accountType: 'CURRENT' | 'DEPOSIT' | 'LOAN' | 'REVOLVING_CREDIT' | 'BOND' | 'DERIVATIVES'
  currency: string
  balance?: number         // Current balance / utilisation
  limit?: number           // Approved credit limit
  status: 'ACTIVE' | 'DORMANT' | 'CLOSED'
  openedDate: DateTime
  maturityDate?: DateTime
  lastSyncedAt: DateTime
  // Note: transactions and individual payment records remain in core banking
}
```

---

## Connector Architecture (`shared/data-layer/`)

```
shared/data-layer/
├── connectors/
│   ├── base/
│   │   ├── connector.interface.ts    # ISorConnector interface all adapters implement
│   │   ├── connector-registry.ts    # Runtime registry of configured connectors
│   │   └── errors.ts                # SorConnectionError, SorAuthError, SorNotFoundError
│   │
│   ├── crm/
│   │   ├── salesforce/
│   │   │   ├── client.ts            # Salesforce API client (jsforce or custom)
│   │   │   ├── mappers.ts           # Salesforce ↔ MERIDIAN field mapping
│   │   │   ├── contact.connector.ts
│   │   │   ├── activity.connector.ts
│   │   │   └── index.ts
│   │   ├── dynamics/
│   │   │   ├── client.ts
│   │   │   ├── mappers.ts
│   │   │   └── index.ts
│   │   ├── dealcloud/
│   │   │   └── index.ts
│   │   └── index.ts                 # CRM connector factory: returns correct impl per org config
│   │
│   ├── kyc/
│   │   ├── encompass/
│   │   │   ├── client.ts
│   │   │   ├── mappers.ts
│   │   │   └── index.ts
│   │   ├── fenergo/
│   │   │   └── index.ts
│   │   └── index.ts                 # KYC connector factory
│   │
│   └── core-banking/
│       ├── temenos/
│       │   ├── client.ts
│       │   ├── mappers.ts
│       │   └── index.ts
│       ├── finacle/
│       │   └── index.ts
│       ├── fis/
│       │   └── index.ts
│       └── index.ts                 # Core banking connector factory
│
├── sync/
│   ├── sor-sync.scheduler.ts        # Cron-based background refresh for all TTL-expiring cache
│   ├── webhook-consumer.ts          # Inbound webhook handler + signature verification
│   └── write-back.queue.ts          # Outbound write-back queue (BullMQ / SQS)
│
├── cache/
│   ├── sor-cache.ts                 # Read-through cache logic (Redis + Postgres projection)
│   └── invalidation.ts             # Cache invalidation by entity type, by event
│
└── index.ts                         # Public API for all module services to use
```

### Base Connector Interface

```typescript
// connectors/base/connector.interface.ts

export interface ISorConnector<TProjection> {
  /** Fetch a single entity by its SoR identifier */
  fetchOne(sorId: string): Promise<TProjection>;

  /** Fetch multiple entities for a given parent (e.g., contacts for a company) */
  fetchMany(params: FetchManyParams): Promise<TProjection[]>;

  /** Write back a MERIDIAN-originated record to the SoR (if supported) */
  writeBack?(record: WriteBackPayload): Promise<WriteBackResult>;

  /** Whether this connector supports real-time webhooks */
  supportsWebhooks: boolean;

  /** Health check — is the SoR reachable and auth valid? */
  healthCheck(): Promise<ConnectorHealth>;
}

export interface ConnectorHealth {
  status: 'healthy' | 'degraded' | 'unreachable';
  latencyMs: number;
  lastSuccessAt: DateTime;
  message?: string;
}

export interface WriteBackResult {
  sorId: string;        // ID assigned by SoR
  status: 'created' | 'updated' | 'duplicate';
  sorUrl?: string;      // Deep link to the record in the SoR (e.g., Salesforce URL)
}
```

### Cache Layer

```typescript
// cache/sor-cache.ts

export async function getWithCache<T>(
  entityType: SorEntityType,   // 'CONTACT' | 'COVERAGE' | 'KYC_PROFILE' | ...
  sorId: string,
  orgId: string,
  fetcher: () => Promise<T>,   // Calls the appropriate connector
): Promise<CachedProjection<T>> {

  const cacheKey = `sor:${orgId}:${entityType}:${sorId}`;
  const cached = await redis.get(cacheKey);
  const ttl = SOR_TTL_CONFIG[entityType];

  if (cached) {
    const parsed = JSON.parse(cached) as CachedProjection<T>;
    if (Date.now() - parsed.cachedAt < ttl) {
      return parsed;   // Cache HIT
    }
  }

  // Cache MISS or stale: fetch from SoR
  const fresh = await fetcher();
  const projection: CachedProjection<T> = {
    data: fresh,
    cachedAt: Date.now(),
    ttlMs: ttl,
  };

  await redis.setex(cacheKey, ttl / 1000, JSON.stringify(projection));
  await db.sorProjection.upsert({
    where: { entityType_sorId_orgId: { entityType, sorId, orgId } },
    update: { data: fresh, lastSyncedAt: new Date() },
    create: { entityType, sorId, orgId, data: fresh, lastSyncedAt: new Date() },
  });

  return projection;
}
```

---

## Data Sovereignty and Governance

### What MERIDIAN Stores (and Why)

MERIDIAN stores projections — thin copies of SoR data — for two reasons:
1. **Performance**: Avoid SoR API latency on every page load
2. **Resilience**: Continue functioning if a SoR is temporarily unavailable

Projections are clearly distinguished from MERIDIAN-originated data:

```typescript
// Every SoR-owned cached entity includes:
{
  sorId: string;          // The canonical identifier in the SoR
  sorSystem: SorSystem;   // 'SALESFORCE' | 'DYNAMICS' | 'ENCOMPASS' | 'TEMENOS' | ...
  lastSyncedAt: DateTime; // When MERIDIAN last refreshed from SoR
  syncStatus: 'SYNCED' | 'STALE' | 'SYNC_FAILED';
  // ...entity fields...
}
```

### SoR Credential Storage

SoR API credentials (client IDs, secrets, certificates) are:
- Stored exclusively in the institution's cloud KMS (AWS KMS / Azure Key Vault)
- Never logged — masked in all audit and error logs
- Rotatable without downtime (connector supports credential refresh mid-operation)
- Scoped to minimum required permissions per SoR (read-only where write-back is not needed)

### Stale Data Surfacing

MERIDIAN surfaces data freshness to users for SoR-owned entities:

```
Last synced from Salesforce: 47 minutes ago  [Refresh]
```

For critical data (KYC status, credit limits) shown in decision contexts, a warning is surfaced when data is older than a threshold, and a one-click manual refresh is available.

---

## Connector Configuration per Institution

Each MERIDIAN deployment is configured with the institution's specific SoR connectivity:

```typescript
// Organisation-level SoR config (stored in org settings, encrypted)
interface OrgSorConfig {
  crm: {
    system: 'SALESFORCE' | 'DYNAMICS' | 'DEALCLOUD' | 'NONE';
    config: SalesforceConfig | DynamicsConfig | DealCloudConfig;
  };
  kyc: {
    system: 'ENCOMPASS' | 'FENERGO' | 'ACTIMIZE' | 'MANUAL' | 'NONE';
    config: KycSystemConfig;
  };
  coreBanking: {
    system: 'TEMENOS' | 'FINACLE' | 'FIS' | 'FINASTRA' | 'NONE';
    config: CoreBankingConfig;
  };
  syncConfig: {
    enableWebhooks: boolean;
    scheduledSyncCronExpression: string;   // e.g., '0 */4 * * *' (every 4 hours)
    writeBackEnabled: boolean;
    writeBackEntities: SorEntityType[];    // Which entities MERIDIAN is allowed to write back
  };
}
```

Institutions that have no CRM, or where MERIDIAN is the first structured system being deployed, can configure `system: 'NONE'` — in which case MERIDIAN acts as the primary record for those entities with no sync.

---

## Failure Modes and Resilience

| Scenario | MERIDIAN Behaviour |
|----------|-------------------|
| SoR API unreachable | Serve stale cache with staleness warning; queue sync for retry |
| SoR auth failure | Surface ops alert; serve stale cache; notify admin |
| Write-back failure | Retry 3× with backoff; queue for manual re-sync; mark record `sync_failed` |
| SoR returns corrupt data | Reject update, serve previous cache, log incident |
| SoR data deleted (contact removed from CRM) | Mark MERIDIAN projection as `sor_deleted`; preserve for historical context; surface warning to user |
| SoR schema change (field renamed/removed) | Mapper throws schema error; connector health check degrades; ops alert |

All SoR connectivity failures are surfaced in a **Connector Health Dashboard** accessible to platform administrators, showing per-SoR status, last successful sync, error counts, and write-back queue depth.
