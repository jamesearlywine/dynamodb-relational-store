import { z } from 'zod';
import { UniqueKeyValueRecord } from './unique-key-value-record.type';
import { urnSchema } from '../../keys/urn-validator';
import { timestampSchema } from '../../timestamps/timestamps';
import { primaryKeySchema } from '../../keys/key-generation';

/**
 * Zod schema for validating UniqueKeyValueRecord
 *
 * @example
 * ```typescript
 * const result = UniqueKeyValueSchema.safeParse(record);
 * if (result.success) {
 *   // result.data is typed as UniqueKeyValueRecord
 * }
 * ```
 */
export const UniqueKeyValueSchema: z.ZodType<UniqueKeyValueRecord> = z.object({
  PK: primaryKeySchema,
  SK: primaryKeySchema,
  _recordType: z.literal('UniqueKeyValue'),
  _resourceType: z.string().min(1),
  key: z.string().min(1),
  value: z.string().min(1),
  associatedRecordUrn: urnSchema.optional(),
  _createdAt: timestampSchema,
  _updatedAt: timestampSchema,
});