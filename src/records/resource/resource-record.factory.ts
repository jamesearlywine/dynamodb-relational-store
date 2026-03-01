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
 *   accountUrn: 'urn:processproof:System.Account::parent-id',
 *   attributes: { name: 'My Account' }
 * });
 * ```
 */

import type { ResourceRecord } from './resource-record.type';
import { generateUuidV7 } from '../../keys/uuid-v7';
import { createUrn, validateUrn } from '../../keys/urn-validator';
import { generateResourceKey } from '../../keys/key-generation';
import { getCurrentTimestamp } from '../../timestamps/timestamps';

/**
 * Options for creating a Resource record.
 */
export interface CreateResourceOptions {
  /** Resource type classification - Example: "System.Account.JobCollection.Job" */
  resourceType: string;
  /** Schema version for service-layer mapping as data contracts evolve */
  schemaVersion: number;
  /** Optional resource ID - will generate UUID v7 if not provided */
  id?: string;
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
 *   accountUrn: 'urn:processproof:System::parent-id',
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

  const id = options.id ?? generateUuidV7();

  if (options.id) {
    const uuidV7Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV7Pattern.test(id)) {
      throw new Error(`Invalid ID format: "${id}". Expected UUID v7 format.`);
    }
  }

  const urn = createUrn('pp', options.resourceType.trim(), id);

  if (!validateUrn(urn)) {
    throw new Error(`Failed to create valid URN: "${urn}"`);
  }

  const keys = generateResourceKey(urn);
  const now = getCurrentTimestamp();

  const record: ResourceRecord = {
    ...keys,
    _recordType: 'Resource',
    _resourceType: options.resourceType.trim(),
    _id: id,
    _urn: urn,
    _schemaVersion: options.schemaVersion,
    _createdAt: now,
    _updatedAt: now,
  };

  if (options.accountUrn) {
    if (!validateUrn(options.accountUrn)) {
      throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
    }
    record._accountUrn = options.accountUrn;
  }

  if (options.attributes) {
    Object.assign(record, options.attributes);
  }

  return record;
}
