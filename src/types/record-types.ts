/**
 * Core record type definitions for DynamoDB Relational Store
 *
 * These types define the structure of all records stored in the single DynamoDB table.
 * See specs/SCHEMA.md for detailed schema specifications.
 */

/**
 * Resource record representing a primary entity in the system.
 *
 * PK Format: "Resource#{urn}"
 * SK Format: "Resource#{urn}"
 */
export interface ResourceRecord {
  /** Primary key - Format: "Resource#{urn}" */
  PK: string;
  /** Sort key - Format: "Resource#{urn}" */
  SK: string;
  /** Record type identifier */
  _recordType: "Resource";
  /** Resource type classification - Example: "System.Account.JobCollection.Job" */
  _resourceType: string;
  /** UUID v7 for time-sorting */
  _id: string;
  /** ProcessProof URN format - Format: "urn:pp:{ResourceType}::{ID}" */
  urn: string;
  /** Schema version for service-layer mapping as data contracts evolve */
  _schemaVersion: number;
  /** Creation timestamp in ISO-8601 format */
  _createdAt: string;
  /** Last update timestamp in ISO-8601 format */
  _updatedAt: string;
  /** Optional account URN for account-scoped resources (required for AccountResources index) */
  _accountUrn?: string;
  /** Additional resource-specific attributes */
  [key: string]: unknown;
}

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

/**
 * Unique key-value record for enforcing uniqueness constraints.
 *
 * PK Format: "UniqueKeyValue#{_resourceType}#{key}#{value}"
 * SK Format: "UniqueKeyValue#{_resourceType}#{key}"
 */
export interface UniqueKeyValueRecord {
  /** Primary key - Format: "UniqueKeyValue#{_resourceType}#{key}#{value}" */
  PK: string;
  /** Sort key - Format: "UniqueKeyValue#{_resourceType}#{key}" */
  SK: string;
  /** Record type identifier */
  _recordType: "UniqueKeyValue";
  /** Resource type for which uniqueness is enforced - Example: "System.User" */
  _resourceType: string;
  /** Property name - Example: "emailAddress" */
  key: string;
  /** Unique value - Example: "someone@somewhere.com" */
  value: string;
  /** Optional URN of the record where the unique value exists */
  associatedRecordUrn?: string;
  /** Creation timestamp in ISO-8601 format */
  _createdAt: string;
  /** Last update timestamp in ISO-8601 format */
  _updatedAt: string;
}

/**
 * Union type of all possible record types.
 */
export type RecordType =
  | "Resource"
  | "ParentChildRelationship"
  | "CollectionMemberRelationship"
  | "UniqueKeyValue";

/**
 * Union type of all possible DynamoDB record types.
 */
export type DynamoDBRecord =
  | ResourceRecord
  | ParentChildRelationshipRecord
  | CollectionMembershipRelationshipRecord
  | UniqueKeyValueRecord;

