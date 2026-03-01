import { z } from 'zod';
import { CollectionMembershipRelationshipRecord } from './collection-membership-relationship-record.type';
import { urnSchema } from '../../keys/urn-validator';
import { timestampSchema } from '../../timestamps/timestamps';
import { primaryKeySchema } from '../../keys/key-generation';

/**
 * Zod schema for validating CollectionMembershipRelationshipRecord
 *
 * @example
 * ```typescript
 * const result = CollectionMembershipRelationshipSchema.safeParse(record);
 * if (result.success) {
 *   // result.data is typed as CollectionMembershipRelationshipRecord
 * }
 * ```
 */
export const CollectionMembershipRelationshipSchema: z.ZodType<CollectionMembershipRelationshipRecord> =
  z.object({
    PK: primaryKeySchema,
    SK: primaryKeySchema,
    _recordType: z.literal('CollectionMemberRelationship'),
    collectionUrn: urnSchema,
    memberUrn: urnSchema,
    _createdAt: timestampSchema,
    _accountUrn: urnSchema,
  });
