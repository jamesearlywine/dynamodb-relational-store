
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
