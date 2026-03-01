import { DynamoDBRecord } from '../dynamodb-record.type';
import { ResourceRecord } from './resource-record.type';
import { ResourceSchema } from './resource-record.schema';

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
