import { DynamoDBRecord } from "../dynamodb-record.type";
import { UniqueKeyValueRecord } from "./unique-key-value-record.type";
import { UniqueKeyValueSchema } from "./unique-key-value-record.schema";

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
