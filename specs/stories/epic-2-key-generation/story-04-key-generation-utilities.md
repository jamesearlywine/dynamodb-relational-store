# Story 4: Key Generation Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to generate DynamoDB keys for records and indexes
**So that** I can create properly formatted primary keys and index keys

**Epic:** 2 - Key Generation
**Status:** ✅ Completed

## Acceptance Criteria
- [x] All key generation functions implemented
- [x] Keys follow format specifications from SCHEMA.md
- [x] Functions generate PrimaryKey, InvertedIndexKey, and ResourcesByAccountIndexKey
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

## Tasks
- [x] **T4.1**: Create `utils/key-generation.ts` file (or add to appropriate utility file)
- [x] **T4.2**: Implement `generateResourceKey(urn: string): PrimaryKey`
  - Format: `PK: "Resource#{urn}", SK: "Resource#{urn}"`
  - Validate URN before generating key
- [x] **T4.3**: Implement `generateParentChildKey(parentUrn: string, childUrn: string): PrimaryKey`
  - Format: `PK: "Parent#{parentUrn}", SK: "Child#{childUrn}"`
  - Validate both URNs
- [x] **T4.4**: Implement `generateCollectionMemberKey(collectionUrn: string, memberUrn: string): PrimaryKey`
  - Format: `PK: "Collection#{collectionUrn}", SK: "Member#{memberUrn}"`
  - Validate both URNs
- [x] **T4.5**: Implement `generateUniqueKeyValueKey(resourceType: string, key: string, value: string): PrimaryKey`
  - Format: `PK: "UniqueKeyValue#{resourceType}#{key}#{value}", SK: "UniqueKeyValue#{resourceType}#{key}"`
- [x] **T4.6**: Implement `generateInvertedIndexKey(record: DynamoDBRecord): InvertedIndexKey`
  - Format: `GSI1PK: record.SK, GSI1SK: record.PK`
  - Handle all record types
- [x] **T4.7**: Implement `generateAccountIndexKey(accountUrn: string, urn: string): ResourcesByAccountIndexKey`
  - Format: `GSI2PK: accountUrn, GSI2SK: urn`
  - Validate both URNs
- [x] **T4.8**: Add JSDoc comments with usage examples for all functions
- [x] **T4.9**: Write unit tests for all key generation functions
  - Test correct key formats
  - Test validation of inputs
  - Test edge cases

