/**
 * Parent-child relationship record representing hierarchical relationships.
 *
 * PK Format: "Parent#{urn}"
 * SK Format: "Child#{urn}"
 *
 * Characteristics:
 * - Cascading DELETE: Deleting a parent resource includes deleting child resources
 * - Cascading authorization: Permission grants to a parent resource apply to child resources
 * - Cardinality: 1:n (one parent to many children)
 */
export interface ParentChildRelationshipRecord {
  /** Primary key - Format: "Parent#{urn}" */
  PK: string;
  /** Sort key - Format: "Child#{urn}" */
  SK: string;
  /** Record type identifier */
  _recordType: "ParentChildRelationship";
  /** Parent resource URN */
  parentUrn: string;
  /** Child resource URN */
  childUrn: string;
  /** Creation timestamp in ISO-8601 format */
  _createdAt: string;
  /** Optional account URN for account-scoped relationships (re: AccountResources index) */
  _accountUrn?: string;
}
