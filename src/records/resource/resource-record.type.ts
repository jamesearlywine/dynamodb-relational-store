/**
 * Resource record representing a primary entity in the system.
 *
 * PK Format: "Resource#{urn}"
 * SK Format: "Resource#{urn}"
 */
export interface ResourceRecord {
  /** Primary key - Format: "Resource#{urn}" */
  PK: string;
  /** Sort key - Format: "Resource#{urn}" */
  SK: string;
  /** Record type identifier */
  _recordType: "Resource";
  /** Resource type classification - Example: "System.Account.JobCollection.Job" */
  _resourceType: string;
  /** UUID v7 for time-sorting */
  _id: string;
  /** ProcessProof URN format - Format: "urn:processproof:{ResourceType}::{ID}" */
  _urn: string;
  /** Schema version for service-layer mapping as data contracts evolve */
  _schemaVersion: number;
  /** Creation timestamp in ISO-8601 format */
  _createdAt: string;
  /** Last update timestamp in ISO-8601 format */
  _updatedAt: string;
  /** Optional account URN for account-scoped resources (required for AccountResources index) */
  _accountUrn?: string;
  /** Additional resource-specific attributes */
  [key: string]: unknown;
}
