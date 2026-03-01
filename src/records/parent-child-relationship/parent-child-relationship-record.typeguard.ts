import { DynamoDBRecord } from '../dynamodb-record.type';
import { ParentChildRelationshipRecord } from './parent-child-relationship-record.type';
import { ParentChildRelationshipSchema } from './parent-child-relationship-record.schema';

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
