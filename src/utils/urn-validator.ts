/**
 * URN validation and manipulation utilities
 *
 * Provides functions to parse, create, and validate ProcessProof URNs.
 * URN format: urn:{domain}:{resourceType}::{resourceId}
 *
 * @example
 * ```typescript
 * const urn = createUrn('pp', 'System.Account', '01955556-3cd2-7df2-b839-693fa6fbd505');
 * const parsed = parseUrn(urn);
 * const isValid = validateUrn(urn);
 * ```
 */

import type { ParsedUrn, Urn } from '../types/urn';

/**
 * Regular expression pattern for URN format validation
 * Matches: urn:{domain}:{resourceType}::{resourceId}
 * Uses * instead of + to allow empty strings, which are then validated separately
 */
const URN_PATTERN = /^urn:([^:]*):([^:]*)::([^:]*)$/;

/**
 * Regular expression pattern for UUID v7 validation
 * UUID v7 format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
 */
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Parses a URN string into its components.
 *
 * @param urn - The URN string to parse
 * @returns Parsed URN object with domain, resourceType, and resourceId
 * @throws {Error} If the URN format is invalid
 *
 * @example
 * ```typescript
 * const parsed = parseUrn('urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505');
 * // Returns: { domain: 'pp', resourceType: 'System.Account', resourceId: '01955556-3cd2-7df2-b839-693fa6fbd505' }
 * ```
 */
export function parseUrn(urn: string): ParsedUrn {
  if (typeof urn !== 'string' || urn.trim().length === 0) {
    throw new Error('URN must be a non-empty string');
  }

  const match = urn.match(URN_PATTERN);
  if (!match) {
    throw new Error(
      `Invalid URN format: "${urn}". Expected format: urn:{domain}:{resourceType}::{resourceId}`
    );
  }

  const [, domain, resourceType, resourceId] = match;

  if (!domain || domain.trim().length === 0) {
    throw new Error(`Invalid URN: domain cannot be empty in "${urn}"`);
  }

  if (!resourceType || resourceType.trim().length === 0) {
    throw new Error(`Invalid URN: resourceType cannot be empty in "${urn}"`);
  }

  if (!resourceId || resourceId.trim().length === 0) {
    throw new Error(`Invalid URN: resourceId cannot be empty in "${urn}"`);
  }

  return {
    domain: domain.trim(),
    resourceType: resourceType.trim(),
    resourceId: resourceId.trim(),
  };
}

/**
 * Creates a URN string from its components.
 *
 * @param domain - The domain identifier (e.g., 'pp')
 * @param resourceType - The resource type (e.g., 'System.Account')
 * @param resourceId - The resource ID (UUID v7 format)
 * @returns The constructed URN string
 * @throws {Error} If any component is invalid
 *
 * @example
 * ```typescript
 * const urn = createUrn('pp', 'System.Account', '01955556-3cd2-7df2-b839-693fa6fbd505');
 * // Returns: 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505'
 * ```
 */
export function createUrn(domain: string, resourceType: string, resourceId: string): Urn {
  if (typeof domain !== 'string' || domain.trim().length === 0) {
    throw new Error('Domain must be a non-empty string');
  }

  if (typeof resourceType !== 'string' || resourceType.trim().length === 0) {
    throw new Error('ResourceType must be a non-empty string');
  }

  if (typeof resourceId !== 'string' || resourceId.trim().length === 0) {
    throw new Error('ResourceId must be a non-empty string');
  }

  // Validate resourceId is UUID v7 format
  if (!UUID_V7_PATTERN.test(resourceId.trim())) {
    throw new Error(
      `Invalid resourceId format: "${resourceId}". Expected UUID v7 format (xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx)`
    );
  }

  return `urn:${domain.trim()}:${resourceType.trim()}::${resourceId.trim()}`;
}

/**
 * Validates a URN string format.
 *
 * @param urn - The URN string to validate
 * @returns True if the URN is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = validateUrn('urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505');
 * // Returns: true
 * ```
 */
export function validateUrn(urn: string): boolean {
  if (typeof urn !== 'string' || urn.trim().length === 0) {
    return false;
  }

  try {
    const parsed = parseUrn(urn);

    // Validate domain is non-empty
    if (!parsed.domain || parsed.domain.trim().length === 0) {
      return false;
    }

    // Validate resourceType is non-empty
    if (!parsed.resourceType || parsed.resourceType.trim().length === 0) {
      return false;
    }

    // Validate resourceId is UUID v7 format
    if (!UUID_V7_PATTERN.test(parsed.resourceId)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

