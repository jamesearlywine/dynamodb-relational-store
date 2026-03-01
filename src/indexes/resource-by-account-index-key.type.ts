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

