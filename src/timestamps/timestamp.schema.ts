import { isValidIso8601 } from "./timestamps";

/**
 * Zod schema for validating ISO-8601 timestamp strings
 *
 * Uses the existing `isValidIso8601()` function for validation.
 *
 * @example
 * ```typescript
 * const result = timestampSchema.safeParse('2024-01-15T10:30:45.123Z');
 * if (result.success) {
 *   // result.data is a valid ISO-8601 timestamp
 * }
 * ```
 */
export const timestampSchema = z.string().refine(isValidIso8601, {
  message: 'Invalid timestamp format. Expected ISO-8601 format',
});