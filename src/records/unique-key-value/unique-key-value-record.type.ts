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