/**
 * Index key type definitions for DynamoDB indexes
 *
 * The DynamoDB table uses multiple indexes to support efficient query patterns.
 * See specs/SCHEMA.md for detailed index specifications.
 */

/**
 * Primary key structure for the default table index.
 */
export interface PrimaryKey {
  /** Primary key */
  PK: string;
  /** Sort key */
  SK: string;
}

/**
 * Inverted index key structure (GSI1).
 *
 * Enables reverse lookups and bidirectional queries by swapping PK and SK.
 * GSI1PK maps to SK from primary index
 * GSI1SK maps to PK from primary index
 */
export interface InvertedIndexKey {
  /** Global Secondary Index 1 Primary Key - Maps to SK from primary index */
  GSI1PK: string;
  /** Global Secondary Index 1 Sort Key - Maps to PK from primary index */
  GSI1SK: string;
}

/**
 * Resources by Account index key structure (GSI2 - Sparse Index).
 *
 * Enables efficient querying of all resources belonging to a specific account.
 * This is a sparse index - only includes records with _accountUrn populated.
 */
export interface ResourcesByAccountIndexKey {
  /** Global Secondary Index 2 Primary Key - _accountUrn */
  GSI2PK: string;
  /** Global Secondary Index 2 Sort Key - urn */
  GSI2SK: string;
}

