# shared/data-layer

The data layer is MERIDIAN's integration infrastructure. It mediates all communication with bank systems of record and external data sources, providing the rest of the platform with a clean, typed interface regardless of what sits underneath.

## Architecture

```
shared/data-layer/
├── connectors/
│   ├── base/
│   │   ├── connector.interface.ts    # ISorConnector<TProjection> — all adapters implement this
│   │   ├── connector-registry.ts    # Runtime registry of org-configured connectors
│   │   └── errors.ts                # SorConnectionError, SorAuthError, SorNotFoundError, SorSchemaError
│   │
│   ├── crm/
│   │   ├── salesforce/
│   │   │   ├── client.ts            # Salesforce REST API client (OAuth 2.0)
│   │   │   ├── mappers.ts           # Salesforce fields ↔ MERIDIAN Contact/Interaction schema
│   │   │   ├── contact.connector.ts # ISorConnector<Contact> implementation
│   │   │   ├── activity.connector.ts # ISorConnector<Interaction> with write-back
│   │   │   └── index.ts
│   │   ├── dynamics/
│   │   │   ├── client.ts            # Microsoft Graph API / Dataverse client
│   │   │   ├── mappers.ts
│   │   │   └── index.ts
│   │   ├── dealcloud/
│   │   │   └── index.ts             # DealCloud REST API adapter
│   │   └── index.ts                 # CRM factory: returns correct impl per org config
│   │
│   ├── kyc/
│   │   ├── encompass/
│   │   │   ├── client.ts
│   │   │   ├── mappers.ts           # Encompass entity ↔ KycProfile projection
│   │   │   └── index.ts
│   │   ├── fenergo/
│   │   │   └── index.ts
│   │   └── index.ts                 # KYC connector factory
│   │
│   └── core-banking/
│       ├── temenos/
│       │   ├── client.ts            # Temenos T24/Transact REST API (or SOAP for older installs)
│       │   ├── mappers.ts           # Temenos arrangement ↔ ClientAccount projection
│       │   └── index.ts
│       ├── finacle/
│       │   └── index.ts
│       ├── fis/
│       │   └── index.ts
│       └── index.ts                 # Core banking connector factory
│
├── sync/
│   ├── sor-sync.scheduler.ts        # Cron: refresh stale/TTL-expired cache entries in background
│   ├── webhook-consumer.ts          # Inbound webhook handler + HMAC signature verification
│   └── write-back.queue.ts          # Outbound queue for MERIDIAN-originated records (BullMQ / SQS)
│
├── cache/
│   ├── sor-cache.ts                 # Read-through cache logic (Redis + Postgres projection store)
│   └── invalidation.ts             # Event-driven cache invalidation by entity + event type
│
└── index.ts                         # Public API: getSorConnector(), getWithCache(), enqueueWriteBack()
```

## Usage by Module Services

Module services **never** call SoR APIs directly. They use the data layer:

```typescript
import { getWithCache, getSorConnector } from '@meridian/data-layer';

// Read a contact — transparently cached
const contact = await getWithCache('CONTACT', sorContactId, orgId, () =>
  getSorConnector('crm', orgId).fetchOne(sorContactId)
);

// Write back a new interaction to CRM
await enqueueWriteBack('INTERACTION', interaction, orgId);

// Read KYC profile
const kyc = await getWithCache('KYC_PROFILE', companyLei, orgId, () =>
  getSorConnector('kyc', orgId).fetchOne(companyLei)
);
```

## Configuration

Each org has a `SorConfig` in org settings (see [systems-of-record.md](../../docs/architecture/systems-of-record.md)):

```typescript
{
  crm: { system: 'SALESFORCE', config: { instanceUrl, clientId, clientSecret } },
  kyc: { system: 'ENCOMPASS', config: { apiUrl, apiKey } },
  coreBanking: { system: 'TEMENOS', config: { baseUrl, cert, privateKey } },
  syncConfig: {
    enableWebhooks: true,
    scheduledSyncCron: '0 */4 * * *',
    writeBackEnabled: true,
    writeBackEntities: ['INTERACTION'],
  }
}
```

Credentials are never stored in config files — resolved from KMS at runtime.

## Connector Health

All connectors expose a `healthCheck()` method. A `/admin/connectors/health` endpoint aggregates status across all configured connectors for a given org, surfacing connectivity issues before they impact bankers.
