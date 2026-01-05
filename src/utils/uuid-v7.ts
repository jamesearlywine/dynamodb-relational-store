/**
 * UUID v7 generation utility
 *
 * UUID v7 is a time-ordered UUID that includes a timestamp component,
 * making it suitable for chronological sorting while maintaining uniqueness.
 *
 * Uses the @kripod/uuidv7 library for RFC-compliant UUID v7 generation.
 *
 * @example
 * ```typescript
 * const id = generateUuidV7();
 * // Returns a UUID v7 string like: '01955556-3cd2-7df2-b839-693fa6fbd505'
 * ```
 */

import { uuidv7 } from '@kripod/uuidv7';

/**
 * Generates a UUID v7 (time-ordered UUID).
 *
 * UUID v7 format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
 * - First 48 bits: Unix timestamp in milliseconds
 * - Next 12 bits: Random
 * - Version (4 bits): 7
 * - Variant (2 bits): 10
 * - Remaining 62 bits: Random
 *
 * This function uses the @kripod/uuidv7 library which provides RFC-compliant
 * UUID v7 generation with proper time-ordering and cryptographic randomness.
 *
 * @returns A UUID v7 string
 *
 * @example
 * ```typescript
 * const id = generateUuidV7();
 * // Multiple calls will generate UUIDs that sort chronologically
 * ```
 */
export function generateUuidV7(): string {
  return uuidv7();
}

