/**
 * DynamoDB key generation utilities
 *
 * Provides functions to generate primary keys and index keys for all record types
 * according to the Single Table Design schema specifications.
 *
 * @example
 * ```typescript
 * const resourceKey = generateResourceKey('urn:pp:System.Account::123');
 * const invertedKey = generateInvertedIndexKey(record);
 * ```
 */

import type {
  DynamoDBRecord,
  ResourceRecord,
  ParentChildRelationshipRecord,
  CollectionMembershipRelationshipRecord,
  UniqueKeyValueRecord,
} from '../types/record-types';
import type {
  PrimaryKey,
  InvertedIndexKey,
  ResourcesByAccountIndexKey,
} from '../types/indexes';
import { validateUrn } from './urn-validator';

/**
 * Generates a primary key for a Resource record.
 *
 * Format: PK: "Resource#{urn}", SK: "Resource#{urn}"
 *
 * @param urn - The resource URN
 * @returns Primary key object with PK and SK
 * @throws {Error} If the URN is invalid
 *
 * @example
 * ```typescript
 * const key = generateResourceKey('urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505');
 * // Returns: { PK: 'Resource#urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505', SK: 'Resource#urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505' }
 * ```
 */
export function generateResourceKey(urn: string): PrimaryKey {
  if (!validateUrn(urn)) {
    throw new Error(`Invalid URN format: "${urn}"`);
  }

  return {
    PK: `Resource#${urn}`,
    SK: `Resource#${urn}`,
  };
}

/**
 * Generates a primary key for a ParentChildRelationship record.
 *
 * Format: PK: "Parent#{parentUrn}", SK: "Child#{childUrn}"
 *
 * @param parentUrn - The parent resource URN
 * @param childUrn - The child resource URN
 * @returns Primary key object with PK and SK
 * @throws {Error} If either URN is invalid
 *
 * @example
 * ```typescript
 * const key = generateParentChildKey(
 *   'urn:pp:System::parent-id',
 *   'urn:pp:System.Account::child-id'
 * );
 * // Returns: { PK: 'Parent#urn:pp:System::parent-id', SK: 'Child#urn:pp:System.Account::child-id' }
 * ```
 */
export function generateParentChildKey(parentUrn: string, childUrn: string): PrimaryKey {
  if (!validateUrn(parentUrn)) {
    throw new Error(`Invalid parent URN format: "${parentUrn}"`);
  }

  if (!validateUrn(childUrn)) {
    throw new Error(`Invalid child URN format: "${childUrn}"`);
  }

  return {
    PK: `Parent#${parentUrn}`,
    SK: `Child#${childUrn}`,
  };
}

/**
 * Generates a primary key for a CollectionMembershipRelationship record.
 *
 * Format: PK: "Collection#{collectionUrn}", SK: "Member#{memberUrn}"
 *
 * @param collectionUrn - The collection resource URN
 * @param memberUrn - The member resource URN
 * @returns Primary key object with PK and SK
 * @throws {Error} If either URN is invalid
 *
 * @example
 * ```typescript
 * const key = generateCollectionMemberKey(
 *   'urn:pp:System.Collection::collection-id',
 *   'urn:pp:System.Account::member-id'
 * );
 * // Returns: { PK: 'Collection#urn:pp:System.Collection::collection-id', SK: 'Member#urn:pp:System.Account::member-id' }
 * ```
 */
export function generateCollectionMemberKey(collectionUrn: string, memberUrn: string): PrimaryKey {
  if (!validateUrn(collectionUrn)) {
    throw new Error(`Invalid collection URN format: "${collectionUrn}"`);
  }

  if (!validateUrn(memberUrn)) {
    throw new Error(`Invalid member URN format: "${memberUrn}"`);
  }

  return {
    PK: `Collection#${collectionUrn}`,
    SK: `Member#${memberUrn}`,
  };
}

/**
 * Generates a primary key for a UniqueKeyValue record.
 *
 * Format: PK: "UniqueKeyValue#{resourceType}#{key}#{value}", SK: "UniqueKeyValue#{resourceType}#{key}"
 *
 * @param resourceType - The resource type (e.g., 'System.User')
 * @param key - The property name (e.g., 'emailAddress')
 * @param value - The unique value (e.g., 'user@example.com')
 * @returns Primary key object with PK and SK
 * @throws {Error} If any parameter is empty
 *
 * @example
 * ```typescript
 * const key = generateUniqueKeyValueKey('System.User', 'emailAddress', 'user@example.com');
 * // Returns: { PK: 'UniqueKeyValue#System.User#emailAddress#user@example.com', SK: 'UniqueKeyValue#System.User#emailAddress' }
 * ```
 */
export function generateUniqueKeyValueKey(
  resourceType: string,
  key: string,
  value: string
): PrimaryKey {
  if (!resourceType || resourceType.trim().length === 0) {
    throw new Error('ResourceType cannot be empty');
  }

  if (!key || key.trim().length === 0) {
    throw new Error('Key cannot be empty');
  }

  if (!value || value.trim().length === 0) {
    throw new Error('Value cannot be empty');
  }

  return {
    PK: `UniqueKeyValue#${resourceType.trim()}#${key.trim()}#${value.trim()}`,
    SK: `UniqueKeyValue#${resourceType.trim()}#${key.trim()}`,
  };
}

/**
 * Generates an inverted index key (GSI1) from a record.
 *
 * Format: GSI1PK: record.SK, GSI1SK: record.PK
 * This enables reverse lookups by swapping the primary key components.
 *
 * @param record - The DynamoDB record
 * @returns Inverted index key object with GSI1PK and GSI1SK
 *
 * @example
 * ```typescript
 * const invertedKey = generateInvertedIndexKey(resourceRecord);
 * // Returns: { GSI1PK: record.SK, GSI1SK: record.PK }
 * ```
 */
export function generateInvertedIndexKey(record: DynamoDBRecord): InvertedIndexKey {
  return {
    GSI1PK: record.SK,
    GSI1SK: record.PK,
  };
}

/**
 * Generates a ResourcesByAccountIndex key (GSI2) for account-scoped queries.
 *
 * Format: GSI2PK: accountUrn, GSI2SK: urn
 * This is a sparse index - only includes records with _accountUrn populated.
 *
 * @param accountUrn - The account URN
 * @param urn - The resource URN
 * @returns ResourcesByAccountIndex key object with GSI2PK and GSI2SK
 * @throws {Error} If either URN is invalid
 *
 * @example
 * ```typescript
 * const key = generateAccountIndexKey(
 *   'urn:pp:System.Account::account-id',
 *   'urn:pp:System.Account.Job::job-id'
 * );
 * // Returns: { GSI2PK: 'urn:pp:System.Account::account-id', GSI2SK: 'urn:pp:System.Account.Job::job-id' }
 * ```
 */
export function generateAccountIndexKey(accountUrn: string, urn: string): ResourcesByAccountIndexKey {
  if (!validateUrn(accountUrn)) {
    throw new Error(`Invalid account URN format: "${accountUrn}"`);
  }

  if (!validateUrn(urn)) {
    throw new Error(`Invalid URN format: "${urn}"`);
  }

  return {
    GSI2PK: accountUrn,
    GSI2SK: urn,
  };
}

