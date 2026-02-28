# MERIDIAN — Security & Compliance

## Overview

MERIDIAN operates in one of the most regulated industries in the world. Security and compliance are not features — they are foundational requirements that shape every architectural decision. This document covers the security model, compliance controls, and data governance framework.

---

## Regulatory Context

MERIDIAN must support compliance with:

| Regulation | Jurisdiction | Scope |
|-----------|-------------|-------|
| MiFID II / MAR | EU/UK | Market abuse prevention, MNPI controls, transaction reporting |
| Dodd-Frank | US | Trade reporting, swap data |
| GDPR / UK GDPR | EU/UK | Personal data handling, right to erasure, data residency |
| CCPA | California/US | Consumer data rights |
| SEC Regulation | US | Broker-dealer obligations, supervision requirements |
| FCA Regulations | UK | Conduct risk, Senior Managers Regime |
| SOX | US (listed) | Financial reporting controls |
| Bank-specific | All | Internal policies: Chinese walls, restricted lists, MNPI procedures |

---

## Authentication & Identity

### SSO Integration
- MERIDIAN integrates with institutional IdP via SAML 2.0 or OAuth 2.0 / OIDC
- Supported providers: Okta, Microsoft Entra ID (Azure AD), Ping Identity, ForgeRock
- Users are provisioned/deprovisioned automatically via SCIM 2.0
- No local password storage — authentication delegated entirely to institutional IdP
- MFA enforced at IdP level (typically hardware tokens or Authenticator apps)

### Session Management
- JWT-based sessions with short expiry (1 hour active session)
- Refresh token rotation with absolute max session of 8 hours
- Concurrent session detection with configurable policy (block or alert)
- Inactivity timeout: configurable (default 30 minutes)
- All sessions invalidated on password change or security event

---

## Authorization — Role-Based Access Control (RBAC)

### Role Hierarchy

```
SYSTEM_ADMIN
    └── ORG_ADMIN
            ├── BUSINESS_HEAD
            │       ├── MANAGING_DIRECTOR
            │       │       ├── DIRECTOR
            │       │       │       ├── VP
            │       │       │       │       ├── ASSOCIATE
            │       │       │       │       └── ANALYST
            │       │       ├── SENIOR_RM
            │       │       └── RM
            ├── CREDIT_OFFICER
            │       └── CREDIT_ANALYST
            ├── COMPLIANCE_OFFICER
            └── OPS_MIDDLE_OFFICE
```

### Permission Model

Permissions are defined at three levels:
1. **Module access** — can a role access this module at all?
2. **Feature access** — can a role use this specific feature within a module?
3. **Data access** — can a role see this specific piece of data?

Data access is the most granular and critical level — it governs Chinese walls and MNPI controls.

### Permission Matrix (Abbreviated)

| Role | Intelligence | Pipeline | Forge | Signal | Credit | Connect | Memory |
|------|-------------|---------|-------|--------|--------|---------|--------|
| MD | Full | Full | Full | Full | View | Full | Full |
| VP/Director | Full | Full | Full | Full | View | Full | Full |
| Associate | Full | Full | Full | Full | No | Full | Full |
| Analyst | View | View | Full | View | No | Limited | Full |
| RM | Full | Full | Limited | Full | Full | Full | Full |
| Credit Analyst | View | View | Full | View | Full | Limited | Full |
| Credit Officer | View | View | View | Full | Full | Limited | Full |
| Compliance | Audit | Audit | Audit | Audit | Audit | Full | Audit |

---

## Chinese Walls & MNPI Controls

### Architecture

Chinese walls are enforced at the **database query layer**, not at the application or UI layer. This ensures that:
1. Code bugs cannot inadvertently expose restricted data
2. API calls for restricted data are rejected regardless of front-end state
3. Audit logs capture every access attempt, permitted or denied

### Restricted List Integration

```typescript
// Enforcement at query level
async function getCompanyData(companyId: string, userId: string): Promise<Company> {
  const user = await getUser(userId);
  const company = await db.company.findUnique({ where: { id: companyId } });

  if (company.isRestricted) {
    const wallCrossing = await db.wallCrossing.findFirst({
      where: { userId, companyId, status: 'ACTIVE' }
    });

    if (!wallCrossing) {
      await auditLog.logBlockedAccess({ userId, companyId, reason: 'RESTRICTED_LIST' });
      throw new ForbiddenError('Company is on restricted list. Wall crossing required.');
    }
  }

  await auditLog.logDataAccess({ userId, companyId, dataType: 'COMPANY_PROFILE' });
  return company;
}
```

### Wall Crossing Workflow

1. Banker requests wall crossing via Compliance module
2. Compliance officer reviews and approves/denies
3. Approved crossing grants time-limited access (configurable: 30 days default)
4. Wall crossing logged with approver, justification, and expiry
5. All data accessed during wall-crossed period flagged in audit trail
6. Automatic alert to compliance when wall-crossed banker accesses sensitive data

### Information Barriers

For banks with multiple conflicting businesses (e.g., advisory + principal investing):
- User groups can be assigned to separate "walls"
- Users in different walls cannot see each other's deal data
- Shared data (e.g., public company profiles) accessible to all
- Private data (e.g., deal terms, private financial data) siloed by wall

---

## Data Classification

Every piece of data in MERIDIAN is classified:

| Class | Description | Examples | Controls |
|-------|-------------|---------|---------|
| **PUBLIC** | Publicly available data | Public company filings, published news | No restrictions |
| **INTERNAL** | Internal to the institution | Deal pipeline, internal ratings | Auth required |
| **CONFIDENTIAL** | Sensitive business data | Client materials, credit files | RBAC + audit log |
| **RESTRICTED** | MNPI or legally sensitive | M&A target data, non-public financials | Wall crossing + enhanced audit |

---

## Audit Trail

Every significant action in MERIDIAN generates an audit record:

### Events Logged

| Event Category | Examples |
|---------------|---------|
| Authentication | Login, logout, session expiry, failed login |
| Data Access | Company profile viewed, deal data accessed, document opened |
| AI Generation | Prompt sent, content generated, model used, tokens consumed |
| Data Modification | Contact updated, deal stage changed, covenant value entered |
| Document Operations | Document uploaded, downloaded, shared, deleted |
| Wall Crossings | Request submitted, approved, denied, expired |
| Restricted List | Company added/removed, access attempted, blocked |
| Admin Actions | User created, role changed, module enabled |

### Audit Record Structure

```typescript
interface AuditRecord {
  id: UUID
  timestamp: DateTime        // Immutable, server-generated
  organizationId: UUID
  userId: UUID
  userRole: UserRole
  sessionId: string
  ipAddress: string          // Client IP (hashed for GDPR)
  eventType: AuditEventType
  entityType: string         // 'COMPANY' | 'DEAL' | 'DOCUMENT' | ...
  entityId: UUID
  action: string             // 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT'
  outcome: 'SUCCESS' | 'DENIED' | 'ERROR'
  denialReason?: string
  metadata: Record<string, unknown>
  // For AI events:
  aiModel?: string
  aiPromptId?: string
  aiTokensUsed?: number
}
```

### Audit Trail Guarantees

- **Immutability**: Audit records are append-only. No update or delete operations.
- **Retention**: 7-year minimum retention (configurable to longer for specific jurisdictions)
- **Tamper detection**: Records hash-chained; any modification detectable
- **Exportable**: Full audit exports in structured format for regulatory examination
- **Real-time**: Sub-second audit logging; not async (audit failure blocks the operation)

---

## Data Encryption

### In Transit
- TLS 1.3 for all API communication
- HSTS enforced on all web endpoints
- Certificate pinning for mobile app
- No downgrade to TLS 1.2 or below

### At Rest
- AES-256 encryption for all stored data (cloud KMS managed)
- Field-level encryption for PII (name, email, phone) using institution-specific keys
- Document storage encrypted with per-document keys
- Database encryption at rest (cloud-native, PostgreSQL TDE)
- Key rotation: automated annual rotation, emergency rotation capability

### Key Management
- Keys stored in cloud KMS (AWS KMS / Azure Key Vault)
- Keys never leave KMS — all encryption/decryption via KMS API
- Key access logged and audited
- Institution can bring their own key (BYOK) for highest-sensitivity deployments

---

## Data Residency

MERIDIAN supports three deployment models:

1. **Multi-tenant SaaS**: Data in shared infrastructure, logically isolated by organization
2. **Single-tenant VPC**: Dedicated infrastructure within MERIDIAN's cloud, org-specific resources
3. **On-premises / Private Cloud**: Deployed entirely within institution's own infrastructure

Data residency regions supported: EU-West, US-East, US-West, UK, Singapore (APAC).

All processing (including AI calls) occurs within the chosen region. Data never transits outside the region without explicit configuration.

---

## GDPR Compliance

### Personal Data Handling

MERIDIAN processes the following personal data:
- Banker user profiles (employees of the institution — B2B relationship)
- Contact profiles (third-party individuals at client companies)
- Communication logs (interactions with contacts)

### GDPR Controls

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | B2B legitimate interest + contractual necessity |
| Right of access | Admin export tool for user's own data |
| Right to erasure | Erasure pipeline (replaces PII with anonymized records, preserves deal structure) |
| Data minimization | Only data necessary for banking workflow is collected |
| Privacy by design | Data classification at collection, minimal data retention defaults |
| Data breach | Detection tooling + 72-hour notification workflow |
| DPA | Standard contractual clauses with institution |

---

## Conflict of Interest Management

### Regulatory Basis

Conflict of interest management is a core obligation across all major financial services jurisdictions:

| Regulation | Jurisdiction | Obligation |
|-----------|-------------|-----------|
| **MiFID II Article 23** | EU / EEA | Firms must identify, manage, and disclose conflicts of interest. Must maintain and operate effective organisational and administrative arrangements. |
| **FCA COBS 6.3 / SYSC 10** | UK | Investment firms must identify and manage conflicts; maintain a conflicts of interest policy and register. |
| **SEC Rule 10b-5 / FINRA 3110** | US | Supervisory obligations require firms to have procedures to identify and manage conflicts in connection with investment banking and research. |
| **FCA Senior Managers Regime** | UK | SMF holders are personally accountable for conflicts management within their business line. |
| **Bank internal policy** | All | All major institutions have their own conflicts policy — MERIDIAN supports the workflow, not just the record-keeping. |

### MERIDIAN's Role in Conflict Management

MERIDIAN does not make conflict decisions — that is always a human (IBC) judgment. MERIDIAN:
1. **Automates the search**: AI scans across all deals, mandates, relationships, and disclosures — work that previously took hours of manual cross-referencing
2. **Structures the record**: Every check, finding, and decision is a typed, versioned, auditable record
3. **Enforces approved conditions**: When a conflict is conditionally cleared (e.g., "erect a Chinese wall"), MERIDIAN can enforce access controls at the data layer rather than relying on manual process
4. **Maintains the register**: IBC has a live, searchable register of all conflict decisions — no more Word documents or email chains

### Conflict Decision Immutability

Conflict check records and individual findings are immutable:
- Records are never edited or deleted after an IBC determination is made
- Amendments are additive: a new determination supersedes the old but the old record is preserved
- Every field change is audit-logged with user and timestamp
- The AI-generated findings within a check are preserved even if the IBC dismisses them — the dismissal reason is added, not the finding removed

### Condition Enforcement

When a ConflictCondition of type `CHINESE_WALL` is recorded:
- MERIDIAN applies the same data access restriction mechanism used for MNPI/restricted list controls
- The bankers on each side of the wall cannot see each other's deal data for the scoped engagement
- Enforcement is at the database query layer, not the UI layer
- Condition breaches (attempted access across the wall) are flagged immediately to the IBC and logged in the audit trail
- Conditions can only be lifted by an IBC with appropriate permissions; lifting is logged and requires a reason

### Personal Conflict Disclosures

Personal conflict disclosures are stored in the `PersonalConflictDisclosure` register:
- **Classification**: `CONFIDENTIAL` — visible to the disclosing banker, their IBC, and Line 2 Compliance. Not visible to other deal team members.
- **Retention**: Disclosures retained for 7 years after expiry (aligned with FCA SYSC 10 requirements)
- **Integration with deal team assignment**: When any banker is added to a deal in Pipeline, MERIDIAN automatically checks their active disclosures against the deal parties. If a match is found, the IBC is notified and the banker is flagged for recusal review.

### Conflicts Register Export

MERIDIAN supports export of the conflicts register for:
- **Regulatory inspection**: Full export of all conflict checks, findings, and decisions in a specified period
- **Internal audit**: Structured CSV/PDF export for internal compliance review
- **Annual reporting**: Aggregate statistics for annual compliance reports (number of checks, clear rate, blocked engagements, most common conflict types)

---

## Deal Insider List Management

### Regulatory Basis

MERIDIAN's insider list capability is designed to satisfy:

| Regulation | Jurisdiction | Requirement |
|-----------|-------------|-------------|
| **MAR Article 18** | EU / EEA | Issuers and persons acting on their behalf must maintain insider lists. Format prescribed by ESMA Technical Standards (Commission Implementing Regulation 2016/347). |
| **FCA DTR 2.8** | UK | UK equivalent of MAR Article 18 post-Brexit; maintained insider lists required. |
| **SEC Rule 10b-5 / FINRA** | US | MNPI controls and supervision requirements; while US rules don't mandate a specific list format, documented access controls are required by supervision obligations. |
| **Bank internal policy** | All | Most institutions require their own deal confidentiality tracking regardless of jurisdiction. |

### What MERIDIAN Captures

For every deal where MNPI is shared, MERIDIAN maintains a structured insider list capturing:

- **Person identity**: Full name, employer, role, direct telephone, and (for external persons) date of birth — per the ESMA prescribed fields
- **Access record**: Date MNPI was first shared; date access ended (if revoked); the banker who granted access
- **Reason**: Why this person required access to confidential information
- **Acknowledgement**: Whether the insider has acknowledged their legal obligations

### Data Controls for Insider Lists

Insider lists are among the most sensitive records in MERIDIAN:

- **Classification**: `RESTRICTED` — the highest data classification
- **Access**: Limited to deal team members currently on the list, compliance officers, and senior management with explicit permission
- **Non-discoverable**: Insider lists are excluded from general Memory module search. Access is only via the Pipeline module directly or compliance admin views
- **Immutability**: Records are never deleted. Access revocation is recorded as `accessRevokedAt`; the historical record is permanent
- **Separate audit log**: Insider list events (adds, removals, exports, acknowledgements) logged in a dedicated, immutable audit table separate from general audit logs
- **Export tamper detection**: Every export hash-signed (SHA-256); the stored hash enables verification that an exported list was not modified after export

### Acknowledgement Workflow

Where an institution's compliance policy requires insiders to acknowledge their obligations:
1. MERIDIAN sends an in-app notification and configurable email to the insider
2. Insider acknowledges via in-app click with timestamp recorded
3. Compliance officer sees acknowledgement status per insider on the list dashboard
4. Unacknowledged insiders flagged after configurable grace period (default 48 hours)
5. For external parties without MERIDIAN access: manual acknowledgement recorded by compliance officer

### Insider List Retention

Insider lists are retained for a minimum of **5 years** from the date the list is closed (per MAR Article 18(5)). MERIDIAN enforces this retention floor; deletion is blocked until the retention period has elapsed. Retention is configurable upward for institutions with longer requirements.

### ESMA XML Export

For EU/UK institutions subject to MAR, MERIDIAN generates regulator-ready ESMA XML exports:
- Conforms to Commission Implementing Regulation (EU) 2016/347 Annex I format
- Captures all required fields including date of birth for external persons
- Export is logged and hash-signed
- Can be submitted directly to the relevant NCA (FCA, BaFin, AMF, etc.) upon regulatory request

---

## Penetration Testing & Security Reviews

- Annual third-party penetration test
- Quarterly automated vulnerability scanning
- Static code analysis in CI/CD pipeline (Snyk, Semgrep)
- Dependency vulnerability monitoring with auto-PRs (Dependabot)
- Security review gate in the pull request process
- Bug bounty program for responsible disclosure

---

## Incident Response

1. **Detection**: Automated alerting via SIEM integration (Datadog, Splunk)
2. **Classification**: P0 (data breach), P1 (service impact), P2 (security concern)
3. **Containment**: Automated session invalidation, API key rotation on P0
4. **Notification**: Compliance team notified within 1 hour; regulatory notification per local law
5. **Investigation**: Forensic audit trail preserved
6. **Remediation**: Root cause analysis, control improvement
7. **Post-mortem**: Documented, shared with affected institutions
