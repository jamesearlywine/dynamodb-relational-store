/**
 * UniqueKeyValue record factory
 *
 * Provides factory function to create UniqueKeyValue records for enforcing
 * uniqueness constraints on resource properties in the DynamoDB Relational Store.
 *
 * @example
 * ```typescript
 * const uniqueKey = createUniqueKeyValue({
 *   resourceType: 'System.User',
 *   key: 'emailAddress',
 *   value: 'user@example.com',
 *   associatedRecordUrn: 'urn:pp:System.User::user-id'
 * });
 * ```
 */

import type { UniqueKeyValueRecord } from '../types/record-types';
import { generateUniqueKeyValueKey } from '../utils/key-generation';
import { getCurrentTimestamp } from '../utils/timestamps';
import { validateUrn } from '../utils/urn-validator';

/**
 * Options for creating a UniqueKeyValue record.
 */
export interface CreateUniqueKeyValueOptions {
  /** Resource type for which uniqueness is enforced - Example: "System.User" */
  resourceType: string;
  /** Property name - Example: "emailAddress" */
  key: string;
  /** Unique value - Example: "someone@somewhere.com" */
  value: string;
  /** Optional URN of the record where the unique value exists */
  associatedRecordUrn?: string;
}

/**
 * Creates a UniqueKeyValue record for the DynamoDB Relational Store.
 *
 * Used to enforce uniqueness constraints on resource properties.
 * Format:
 * - PK: "UniqueKeyValue#{resourceType}#{key}#{value}"
 * - SK: "UniqueKeyValue#{resourceType}#{key}"
 *
 * @param options - Options for creating the unique key value record
 * @returns A fully-formed UniqueKeyValueRecord
 * @throws {Error} If resourceType, key, or value is empty, or if associatedRecordUrn is invalid
 *
 * @example
 * ```typescript
 * // Create unique key value without associated record
 * const uniqueKey = createUniqueKeyValue({
 *   resourceType: 'System.User',
 *   key: 'emailAddress',
 *   value: 'user@example.com'
 * });
 *
 * // Create unique key value with associated record
 * const uniqueKeyWithRecord = createUniqueKeyValue({
 *   resourceType: 'System.User',
 *   key: 'emailAddress',
 *   value: 'user@example.com',
 *   associatedRecordUrn: 'urn:pp:System.User::01955556-3cd2-7df2-b839-693fa6fbd505'
 * });
 * ```
 */
export function createUniqueKeyValue(
  options: CreateUniqueKeyValueOptions
): UniqueKeyValueRecord {
  if (!options.resourceType || options.resourceType.trim().length === 0) {
    throw new Error('ResourceType cannot be empty');
  }

  if (!options.key || options.key.trim().length === 0) {
    throw new Error('Key cannot be empty');
  }

  if (!options.value || options.value.trim().length === 0) {
    throw new Error('Value cannot be empty');
  }

  // Validate associatedRecordUrn if provided
  if (options.associatedRecordUrn) {
    if (!validateUrn(options.associatedRecordUrn)) {
      throw new Error(
        `Invalid associatedRecordUrn format: "${options.associatedRecordUrn}"`
      );
    }
  }

  // Generate primary and sort keys
  const keys = generateUniqueKeyValueKey(
    options.resourceType.trim(),
    options.key.trim(),
    options.value.trim()
  );

  // Get current timestamp
  const now = getCurrentTimestamp();

  // Build the unique key value record
  const record: UniqueKeyValueRecord = {
    ...keys,
    _recordType: 'UniqueKeyValue',
    _resourceType: options.resourceType.trim(),
    key: options.key.trim(),
    value: options.value.trim(),
    _createdAt: now,
    _updatedAt: now,
  };

  // Add associated record URN if provided
  if (options.associatedRecordUrn) {
    record.associatedRecordUrn = options.associatedRecordUrn;
  }

  return record;
}

