/**
 * Base interface for all Systems of Record connectors.
 * Every CRM, KYC, and core banking adapter implements this.
 */

export type SorSystem =
  | 'SALESFORCE'
  | 'DYNAMICS'
  | 'DEALCLOUD'
  | 'BACKSTOP'
  | 'ENCOMPASS'
  | 'FENERGO'
  | 'ACTIMIZE'
  | 'WORLDCHECK'
  | 'TEMENOS'
  | 'FINACLE'
  | 'FIS'
  | 'FINASTRA';

export type SorEntityType =
  | 'CONTACT'
  | 'COVERAGE_ASSIGNMENT'
  | 'INTERACTION'
  | 'KYC_PROFILE'
  | 'CLIENT_ACCOUNT';

export interface FetchManyParams {
  parentSorId: string;   // e.g., company/account ID in SoR
  since?: Date;          // For incremental sync: only fetch records modified after this date
  limit?: number;
  offset?: number;
}

export interface WriteBackPayload {
  entityType: SorEntityType;
  meridianId: string;    // MERIDIAN record ID (for correlation)
  data: Record<string, unknown>;
  idempotencyKey: string; // Prevents duplicate writes on retry
}

export interface WriteBackResult {
  sorId: string;
  status: 'created' | 'updated' | 'duplicate';
  sorUrl?: string;       // Deep link to the record in the SoR UI
}

export interface ConnectorHealth {
  status: 'healthy' | 'degraded' | 'unreachable';
  latencyMs: number;
  lastSuccessAt: Date | null;
  message?: string;
}

export interface ISorConnector<TProjection> {
  readonly system: SorSystem;
  readonly entityType: SorEntityType;

  /** Fetch a single entity by its SoR-native identifier */
  fetchOne(sorId: string): Promise<TProjection>;

  /** Fetch multiple entities belonging to a parent (e.g., all contacts for a company) */
  fetchMany(params: FetchManyParams): Promise<TProjection[]>;

  /**
   * Write back a MERIDIAN-originated record to the SoR.
   * Only implemented by connectors for SOR_BIDIRECTIONAL entities (e.g., Interaction).
   * Throws UnsupportedOperationError for SOR_READONLY connectors.
   */
  writeBack?(payload: WriteBackPayload): Promise<WriteBackResult>;

  /** Whether this SoR supports inbound webhook push for change events */
  readonly supportsWebhooks: boolean;

  /** Liveness and auth check — used by health dashboard */
  healthCheck(): Promise<ConnectorHealth>;
}
