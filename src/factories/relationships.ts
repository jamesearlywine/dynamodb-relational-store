/**
 * Relationship record factories
 *
 * Provides factory functions to create ParentChildRelationship and
 * CollectionMembershipRelationship records for the DynamoDB Relational Store.
 *
 * @example
 * ```typescript
 * const parentChild = createParentChildRelationship({
 *   parentUrn: 'urn:pp:System::parent-id',
 *   childUrn: 'urn:pp:System.Account::child-id'
 * });
 *
 * const collectionMember = createCollectionMembershipRelationship({
 *   collectionUrn: 'urn:pp:System.Collection::collection-id',
 *   memberUrn: 'urn:pp:System.Account::member-id',
 *   accountUrn: 'urn:pp:System.Account::account-id'
 * });
 * ```
 */

import type {
  ParentChildRelationshipRecord,
  CollectionMembershipRelationshipRecord,
} from '../types/record-types';
import { validateUrn } from '../utils/urn-validator';
import { generateParentChildKey, generateCollectionMemberKey } from '../utils/key-generation';
import { getCurrentTimestamp } from '../utils/timestamps';

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
  // Validate parent URN
  if (!validateUrn(options.parentUrn)) {
    throw new Error(`Invalid parent URN format: "${options.parentUrn}"`);
  }

  // Validate child URN
  if (!validateUrn(options.childUrn)) {
    throw new Error(`Invalid child URN format: "${options.childUrn}"`);
  }

  // Generate primary and sort keys
  const keys = generateParentChildKey(options.parentUrn, options.childUrn);

  // Get current timestamp
  const now = getCurrentTimestamp();

  // Build the relationship record
  const record: ParentChildRelationshipRecord = {
    ...keys,
    _recordType: 'ParentChildRelationship',
    parentUrn: options.parentUrn,
    childUrn: options.childUrn,
    _createdAt: now,
  };

  // Add account URN if provided
  if (options.accountUrn) {
    if (!validateUrn(options.accountUrn)) {
      throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
    }
    record._accountUrn = options.accountUrn;
  }

  return record;
}

/**
 * Options for creating a CollectionMembershipRelationship record.
 */
export interface CreateCollectionMembershipRelationshipOptions {
  /** Collection resource URN */
  collectionUrn: string;
  /** Member resource URN */
  memberUrn: string;
  /** Account URN - required for account-scoped collections */
  accountUrn: string;
}

/**
 * Creates a CollectionMembershipRelationship record for the DynamoDB Relational Store.
 *
 * Represents a collection membership relationship with:
 * - No cascading delete
 * - Optional authorization conveyance
 * - Cardinality: n:n (many-to-many)
 *
 * @param options - Options for creating the relationship
 * @returns A fully-formed CollectionMembershipRelationshipRecord
 * @throws {Error} If collection, member, or account URNs are invalid or missing
 *
 * @example
 * ```typescript
 * const relationship = createCollectionMembershipRelationship({
 *   collectionUrn: 'urn:pp:System.Collection::collection-id',
 *   memberUrn: 'urn:pp:System.Account::member-id',
 *   accountUrn: 'urn:pp:System.Account::account-id'
 * });
 * ```
 */
export function createCollectionMembershipRelationship(
  options: CreateCollectionMembershipRelationshipOptions
): CollectionMembershipRelationshipRecord {
  // Validate accountUrn is provided (required)
  if (!options.accountUrn || options.accountUrn.trim().length === 0) {
    throw new Error('AccountUrn is required for CollectionMembershipRelationship');
  }

  // Validate collection URN
  if (!validateUrn(options.collectionUrn)) {
    throw new Error(`Invalid collection URN format: "${options.collectionUrn}"`);
  }

  // Validate member URN
  if (!validateUrn(options.memberUrn)) {
    throw new Error(`Invalid member URN format: "${options.memberUrn}"`);
  }

  // Validate account URN
  if (!validateUrn(options.accountUrn)) {
    throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
  }

  // Generate primary and sort keys
  const keys = generateCollectionMemberKey(options.collectionUrn, options.memberUrn);

  // Get current timestamp
  const now = getCurrentTimestamp();

  // Build the relationship record
  const record: CollectionMembershipRelationshipRecord = {
    ...keys,
    _recordType: 'CollectionMemberRelationship',
    collectionUrn: options.collectionUrn,
    memberUrn: options.memberUrn,
    _createdAt: now,
    _accountUrn: options.accountUrn,
  };

  return record;
}

