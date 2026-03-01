import { DynamoDBRecord } from '../dynamodb-record.type';
import { CollectionMembershipRelationshipRecord } from './collection-membership-relationship-record.type';
import { CollectionMembershipRelationshipSchema } from './collection-membership-relationship-record.schema';

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
