/**
 * Regular expression pattern for ISO-8601 timestamp validation
 * Supports formats with and without timezone
 */
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;

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




