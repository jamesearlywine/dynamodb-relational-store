
/**
 * Regular expression pattern for ISO-8601 timestamp validation
 * Supports formats with and without timezone
 */
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;


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