/**
 * Gets the current timestamp in ISO-8601 format.
 *
 * Returns a timezone-aware timestamp in ISO-8601 format.
 * Format: YYYY-MM-DDTHH:mm:ss.sssZ (e.g., '2024-01-15T10:30:45.123Z')
 *
 * @returns Current timestamp as ISO-8601 string
 *
 * @example
 * ```typescript
 * const timestamp = getCurrentTimestamp();
 * // Returns: '2024-01-15T10:30:45.123Z'
 * ```
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export { timestampSchema } from './timestamp.schema';

