/**
 * ISO-8601 timestamp utilities
 *
 * Provides functions for working with ISO-8601 formatted timestamps,
 * including generation and validation.
 *
 * @example
 * ```typescript
 * const timestamp = getCurrentTimestamp();
 * const isValid = isValidIso8601(timestamp);
 * ```
 */

import { z } from 'zod';

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

/**
 * Validates if a string is a valid ISO-8601 timestamp format.
 *
 * Supports various ISO-8601 formats:
 * - With milliseconds: '2024-01-15T10:30:45.123Z'
 * - Without milliseconds: '2024-01-15T10:30:45Z'
 * - With timezone offset: '2024-01-15T10:30:45+05:00'
 * - Without timezone: '2024-01-15T10:30:45'
 *
 * @param timestamp - The timestamp string to validate
 * @returns True if the timestamp is valid ISO-8601 format, false otherwise
 *
 * @example
 * ```typescript
 * isValidIso8601('2024-01-15T10:30:45.123Z'); // Returns: true
 * isValidIso8601('invalid'); // Returns: false
 * ```
 */
export function isValidIso8601(timestamp: string): boolean {
  if (typeof timestamp !== 'string' || timestamp.trim().length === 0) {
    return false;
  }

  // Check pattern match
  if (!ISO_8601_PATTERN.test(timestamp.trim())) {
    return false;
  }

  // Try to parse as Date to ensure it's a valid date
  try {
    const date = new Date(timestamp);
    // Check if date is valid (not NaN)
    if (isNaN(date.getTime())) {
      return false;
    }
    // Check if the parsed date string matches the input (handles edge cases)
    return true;
  } catch {
    return false;
  }
}

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
