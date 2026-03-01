import { z } from 'zod';
import { ParentChildRelationshipRecord } from './parent-child-relationship-record.type';
import { urnSchema } from '../../keys/urn-validator';
import { timestampSchema } from '../../timestamps/timestamps';
import { primaryKeySchema } from '../../keys/key-generation';

/**
 * Zod schema for validating ParentChildRelationshipRecord
 *
 * @example
 * ```typescript
 * const result = ParentChildRelationshipSchema.safeParse(record);
 * if (result.success) {
 *   // result.data is typed as ParentChildRelationshipRecord
 * }
 * ```
 */
export const ParentChildRelationshipSchema: z.ZodType<ParentChildRelationshipRecord> = z.object({
  PK: primaryKeySchema,
  SK: primaryKeySchema,
  _recordType: z.literal('ParentChildRelationship'),
  parentUrn: urnSchema,
  childUrn: urnSchema,
  _createdAt: timestampSchema,
  _accountUrn: urnSchema.optional(),
});
