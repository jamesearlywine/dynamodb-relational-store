import { z } from 'zod';
import { ResourceRecord } from './resource-record.type';
import { urnSchema } from '../../keys/urn-validator';
import { timestampSchema } from '../../timestamps/timestamps';
import { primaryKeySchema } from '../../keys/key-generation';

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Zod schema for validating ResourceRecord
 *
 * @example
 * ```typescript
 * const result = ResourceSchema.safeParse(record);
 * if (result.success) {
 *   // result.data is typed as ResourceRecord
 * }
 * ```
 */
export const ResourceSchema: z.ZodType<ResourceRecord> = z.object({
  PK: primaryKeySchema,
  SK: primaryKeySchema,
  _recordType: z.literal('Resource'),
  _resourceType: z.string().min(1),
  _schemaVersion: z.number().int().positive(),
  _id: z.string().regex(UUID_V7_PATTERN),
  _urn: urnSchema,
  _createdAt: timestampSchema,
  _updatedAt: timestampSchema,
  _accountUrn: urnSchema.optional(),
}).passthrough();
