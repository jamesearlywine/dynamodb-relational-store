/**
 * DynamoDB Relational Store - Public API
 *
 * This is the main entry point for the DynamoDB Relational Store library.
 * It exports all types, factory functions, and utility functions.
 *
 * @example
 * ```typescript
 * import { createResource, createUrn, generateUuidV7 } from '@processproof/dynamodb-relational-store';
 *
 * const resource = createResource({
 *   resourceType: 'System.Account',
 *   schemaVersion: 1
 * });
 * ```
 */

// Export all types
export * from './types';

// Export all factory functions
export * from './factories/resource';
export * from './factories/relationships';
export * from './factories/unique-key-value';

// Export all utility functions
export * from './utils/urn-validator';
export * from './utils/uuid-v7';
export * from './utils/timestamps';
export * from './utils/key-generation';
export * from './utils/type-guards';

