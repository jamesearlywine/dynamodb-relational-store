/**
 * Collection-membership relationship record factory
 *
 * Provides factory function to create CollectionMembershipRelationship records for the DynamoDB Relational Store.
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

import type { CollectionMembershipRelationshipRecord } from './collection-membership-relationship-record.type';
import { validateUrn } from '../../keys/urn-validator';
import { generateCollectionMemberKey } from '../../keys/key-generation';
import { getCurrentTimestamp } from '../../timestamps/timestamps';

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
  if (!options.accountUrn || options.accountUrn.trim().length === 0) {
    throw new Error('AccountUrn is required for CollectionMembershipRelationship');
  }

  if (!validateUrn(options.collectionUrn)) {
    throw new Error(`Invalid collection URN format: "${options.collectionUrn}"`);
  }

  if (!validateUrn(options.memberUrn)) {
    throw new Error(`Invalid member URN format: "${options.memberUrn}"`);
  }

  if (!validateUrn(options.accountUrn)) {
    throw new Error(`Invalid accountUrn format: "${options.accountUrn}"`);
  }

  const keys = generateCollectionMemberKey(options.collectionUrn, options.memberUrn);
  const now = getCurrentTimestamp();

  return {
    ...keys,
    _recordType: 'CollectionMemberRelationship',
    collectionUrn: options.collectionUrn,
    memberUrn: options.memberUrn,
    _createdAt: now,
    _accountUrn: options.accountUrn,
  };
}
