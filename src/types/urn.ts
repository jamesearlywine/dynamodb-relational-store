/**
 * URN type definitions and utilities
 *
 * ProcessProof uses the following URN format for resource identification:
 * urn:{domain}:{resourceType}::{resourceId}
 *
 * Example: urn:pp:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505
 */

/**
 * ProcessProof URN format string.
 * Format: "urn:{domain}:{resourceType}::{resourceId}"
 */
export type Urn = string;

/**
 * Parsed URN structure
 */
export interface ParsedUrn {
  /** Domain identifier - Example: "pp" */
  domain: string;
  /** Resource type - Example: "System.Account.JobCollection.Job" */
  resourceType: string;
  /** Resource ID (UUID v7) */
  resourceId: string;
}

