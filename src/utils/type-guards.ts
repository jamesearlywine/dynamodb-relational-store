/**
 * Type guard functions for DynamoDB records
 *
 * Provides runtime type checking functions to narrow TypeScript union types
 * to specific record types. These functions enable safe type narrowing in
 * conditional blocks.
 *
 * @example
 * ```typescript
 * function processRecord(record: DynamoDBRecord) {
 *   if (isResourceRecord(record)) {
 *     // TypeScript knows record is ResourceRecord here
 *     console.log(record._resourceType);
 *   }
 * }
 * ```
 */

import type {
  DynamoDBRecord,
  ResourceRecord,
  ParentChildRelationshipRecord,
  CollectionMembershipRelationshipRecord,
  UniqueKeyValueRecord,
} from '../types/record-types';

/**
 * Type guard to check if a record is a ResourceRecord.
 *
 * @param record - The record to check
 * @returns True if the record is a ResourceRecord
 *
 * @example
 * ```typescript
 * if (isResourceRecord(record)) {
 *   // record is narrowed to ResourceRecord
 *   const resourceType = record._resourceType;
 * }
 * ```
 */
export function isResourceRecord(record: DynamoDBRecord): record is ResourceRecord {
  return record._recordType === 'Resource';
}

/**
 * Type guard to check if a record is a ParentChildRelationshipRecord.
 *
 * @param record - The record to check
 * @returns True if the record is a ParentChildRelationshipRecord
 *
 * @example
 * ```typescript
 * if (isParentChildRelationshipRecord(record)) {
 *   // record is narrowed to ParentChildRelationshipRecord
 *   const parentUrn = record.parentUrn;
 * }
 * ```
 */
export function isParentChildRelationshipRecord(
  record: DynamoDBRecord
): record is ParentChildRelationshipRecord {
  return record._recordType === 'ParentChildRelationship';
}

/**
 * Type guard to check if a record is a CollectionMembershipRelationshipRecord.
 *
 * @param record - The record to check
 * @returns True if the record is a CollectionMembershipRelationshipRecord
 *
 * @example
 * ```typescript
 * if (isCollectionMembershipRelationshipRecord(record)) {
 *   // record is narrowed to CollectionMembershipRelationshipRecord
 *   const collectionUrn = record.collectionUrn;
 * }
 * ```
 */
export function isCollectionMembershipRelationshipRecord(
  record: DynamoDBRecord
): record is CollectionMembershipRelationshipRecord {
  return record._recordType === 'CollectionMemberRelationship';
}

/**
 * Type guard to check if a record is a UniqueKeyValueRecord.
 *
 * @param record - The record to check
 * @returns True if the record is a UniqueKeyValueRecord
 *
 * @example
 * ```typescript
 * if (isUniqueKeyValueRecord(record)) {
 *   // record is narrowed to UniqueKeyValueRecord
 *   const key = record.key;
 * }
 * ```
 */
export function isUniqueKeyValueRecord(record: DynamoDBRecord): record is UniqueKeyValueRecord {
  return record._recordType === 'UniqueKeyValue';
}

