/**
 * Parent-child relationship record factory
 *
 * Provides factory function to create ParentChildRelationship records for the DynamoDB Relational Store.
 *
 * @example
 * ```typescript
 * const relationship = createParentChildRelationship({
 *   parentUrn: 'urn:pp:System::parent-id',
 *   childUrn: 'urn:pp:System.Account::child-id'
 * });
 * ```
 */

import type { ParentChildRelationshipRecord } from './parent-child-relationship-record.type';
import { validateUrn } from '../../keys/urn-validator';
import { generateParentChildKey } from '../../keys/key-generation';
import { getCurrentTimestamp } from '../../timestamps/timestamps';

/**
 * Options for creating a ParentChildRelationship record.
 */
export interface CreateParentChildRelationshipOptions {
  /** Parent resource URN */
  parentUrn: string;
  /** Child resource URN */
  childUrn: string;
  /** Optional account URN for account-scoped relationships */
  accountUrn?: string;
}

/**
 * Creates a ParentChildRelationship record for the DynamoDB Relational Store.
 *
 * Represents a hierarchical parent-child relationship with:
 * - Cascading DELETE: Deleting a parent resource includes deleting child resources
 * - Cascading authorization: Permission grants to a parent resource apply to child resources
 * - Cardinality: 1:n (one parent to many children)
 *
 * @param options - Options for creating the relationship
 * @returns A fully-formed ParentChildRelationshipRecord
 * @throws {Error} If parent or child URNs are invalid
 *
 * @example
 * ```typescript
 * const relationship = createParentChildRelationship({
 *   parentUrn: 'urn:pp:System::parent-id',
 *   childUrn: 'urn:pp:System.Account::child-id',
 *   accountUrn: 'urn:pp:System.Account::account-id'
 * });
 * ```
 */
export function createParentChildRelationship(
  options: CreateParentChildRelationshipOptions
): ParentChildRelationshipRecord {
  if (!validateUrn(options.parentUrn)) {
    throw new Error(`Invalid parent URN format: "${options.parentUrn}"`);
  }

  if (!validateUrn(options.childUrn)) {
    throw new Error(`Invalid child URN format: "${options.childUrn}"`);
  }

  const keys = generateParentChildKey(options.parentUrn, options.childUrn);
  const now = getCurrentTimestamp();

  const record: ParentChildRelationshipRecord = {
    ...keys,
    _recordType: 'ParentChildRelationship',
    parentUrn: options.parentUrn,
    childUrn: options.childUrn,
    _createdAt: now,
  };

  if (options.accountUrn) {
    if (!validateUrn(options.accountUrn)) {
      throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
    }
    record._accountUrn = options.accountUrn;
  }

  return record;
}
