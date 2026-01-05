/**
 * Resource record factory
 *
 * Provides factory function to create Resource records for the DynamoDB Relational Store.
 *
 * @example
 * ```typescript
 * const resource = createResource({
 *   resourceType: 'System.Account',
 *   schemaVersion: 1,
 *   accountUrn: 'urn:pp:System.Account::parent-id',
 *   attributes: { name: 'My Account' }
 * });
 * ```
 */

import type { ResourceRecord } from '../types/record-types';
import { generateUuidV7 } from '../utils/uuid-v7';
import { createUrn, validateUrn } from '../utils/urn-validator';
import { generateResourceKey } from '../utils/key-generation';
import { getCurrentTimestamp } from '../utils/timestamps';

/**
 * Options for creating a Resource record.
 */
export interface CreateResourceOptions {
  /** Resource type classification - Example: "System.Account.JobCollection.Job" */
  resourceType: string;
  /** Optional resource ID - will generate UUID v7 if not provided */
  id?: string;
  /** Schema version for service-layer mapping as data contracts evolve */
  schemaVersion: number;
  /** Optional account URN for account-scoped resources */
  accountUrn?: string;
  /** Additional resource-specific attributes */
  attributes?: Record<string, unknown>;
}

/**
 * Creates a Resource record for the DynamoDB Relational Store.
 *
 * Generates all required fields including:
 * - UUID v7 ID (if not provided)
 * - ProcessProof URN
 * - Primary and sort keys
 * - Timestamps
 *
 * @param options - Options for creating the resource
 * @returns A fully-formed ResourceRecord
 * @throws {Error} If resourceType is empty or invalid
 *
 * @example
 * ```typescript
 * // Create resource with auto-generated ID
 * const resource = createResource({
 *   resourceType: 'System.Account',
 *   schemaVersion: 1
 * });
 *
 * // Create resource with specific ID
 * const resourceWithId = createResource({
 *   resourceType: 'System.Account',
 *   id: '01955556-3cd2-7df2-b839-693fa6fbd505',
 *   schemaVersion: 1,
 *   accountUrn: 'urn:pp:System::parent-id',
 *   attributes: { name: 'My Account' }
 * });
 * ```
 */
export function createResource(options: CreateResourceOptions): ResourceRecord {
  if (!options.resourceType || options.resourceType.trim().length === 0) {
    throw new Error('ResourceType cannot be empty');
  }

  if (typeof options.schemaVersion !== 'number' || options.schemaVersion < 1) {
    throw new Error('SchemaVersion must be a positive number');
  }

  // Generate UUID v7 if id not provided
  const id = options.id || generateUuidV7();

  // Validate id is UUID v7 format if provided
  if (options.id) {
    const uuidV7Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV7Pattern.test(id)) {
      throw new Error(`Invalid ID format: "${id}". Expected UUID v7 format.`);
    }
  }

  // Construct URN (assuming 'pp' domain for ProcessProof)
  const urn = createUrn('pp', options.resourceType.trim(), id);

  // Validate URN format
  if (!validateUrn(urn)) {
    throw new Error(`Failed to create valid URN: "${urn}"`);
  }

  // Generate primary and sort keys
  const keys = generateResourceKey(urn);

  // Get current timestamp
  const now = getCurrentTimestamp();

  // Build the resource record
  const record: ResourceRecord = {
    ...keys,
    _recordType: 'Resource',
    _resourceType: options.resourceType.trim(),
    _id: id,
    urn,
    _schemaVersion: options.schemaVersion,
    _createdAt: now,
    _updatedAt: now,
  };

  // Add account URN if provided
  if (options.accountUrn) {
    if (!validateUrn(options.accountUrn)) {
      throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
    }
    record._accountUrn = options.accountUrn;
  }

  // Merge additional attributes
  if (options.attributes) {
    Object.assign(record, options.attributes);
  }

  return record;
}

