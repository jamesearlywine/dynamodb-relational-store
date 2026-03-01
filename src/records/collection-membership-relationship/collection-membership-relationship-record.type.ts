/**
 * Collection-membership relationship record representing membership in collections.
 *
 * PK Format: "Collection#{urn}"
 * SK Format: "Member#{urn}"
 *
 * Characteristics:
 * - No cascading delete
 * - Optional authorization conveyance
 * - Cardinality: n:n (many-to-many)
 */
export interface CollectionMembershipRelationshipRecord {
  /** Primary key - Format: "Collection#{urn}" */
  PK: string;
  /** Sort key - Format: "Member#{urn}" */
  SK: string;
  /** Record type identifier */
  _recordType: "CollectionMemberRelationship";
  /** Collection resource URN */
  collectionUrn: string;
  /** Member resource URN */
  memberUrn: string;
  /** Creation timestamp in ISO-8601 format */
  _createdAt: string;
  /** Account URN - required for account-scoped collections (re: AccountResources index) */
  _accountUrn: string;
}
