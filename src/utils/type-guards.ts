/**
 * Type guard functions for DynamoDB records
 *
 * Provides runtime type checking functions to narrow TypeScript union types
 * to specific record types. These functions enable safe type narrowing in
 * conditional blocks. Type guards leverage Zod validation for comprehensive
 * runtime type checking.
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
import { ResourceSchema } from '../factories/resource';
import {
  ParentChildRelationshipSchema,
  CollectionMembershipRelationshipSchema,
} from '../factories/relationship';
import { UniqueKeyValueSchema } from '../factories/unique-key-value';

/**
 * Type guard to check if a record is a ResourceRecord.
 *
 * Uses Zod validation to ensure the record structure is valid.
 *
 * @param record - The record to check
 * @returns True if the record is a valid ResourceRecord
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
  if (record._recordType !== 'Resource') {
    return false;
  }
  return ResourceSchema.safeParse(record).success;
}

/**
 * Type guard to check if a record is a ParentChildRelationshipRecord.
 *
 * Uses Zod validation to ensure the record structure is valid.
 *
 * @param record - The record to check
 * @returns True if the record is a valid ParentChildRelationshipRecord
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
  if (record._recordType !== 'ParentChildRelationship') {
    return false;
  }
  return ParentChildRelationshipSchema.safeParse(record).success;
}

/**
 * Type guard to check if a record is a CollectionMembershipRelationshipRecord.
 *
 * Uses Zod validation to ensure the record structure is valid.
 *
 * @param record - The record to check
 * @returns True if the record is a valid CollectionMembershipRelationshipRecord
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
  if (record._recordType !== 'CollectionMemberRelationship') {
    return false;
  }
  return CollectionMembershipRelationshipSchema.safeParse(record).success;
}

/**
 * Type guard to check if a record is a UniqueKeyValueRecord.
 *
 * Uses Zod validation to ensure the record structure is valid.
 *
 * @param record - The record to check
 * @returns True if the record is a valid UniqueKeyValueRecord
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
  if (record._recordType !== 'UniqueKeyValue') {
    return false;
  }
  return UniqueKeyValueSchema.safeParse(record).success;
}

