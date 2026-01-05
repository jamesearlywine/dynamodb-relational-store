# User Stories and Tasks

This document contains user stories and tasks derived from `constitution.md` for implementing factories and utility functions.

## ✅ Status: All Stories Completed

All 10 stories across 4 phases have been completed. All acceptance criteria met, all tasks completed, and all tests passing (84 tests).

## Story 1: URN Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to parse, create, and validate URNs
**So that** I can work with ProcessProof URN format consistently

### Acceptance Criteria
- [x] `parseUrn()` function parses URNs into ParsedUrn structure
- [x] `createUrn()` function constructs URNs from components
- [x] `validateUrn()` function validates URN format
- [x] All functions have JSDoc documentation with examples
- [x] All functions have unit tests covering valid and invalid inputs
- [x] Validation follows URN format specification: `urn:{domain}:{resourceType}::{resourceId}`
- [x] Validation ensures domain and resourceType are non-empty
- [x] Validation ensures resourceId is valid UUID v7 format

### Tasks
- [x] **T1.1**: Create `utils/urn-validator.ts` file
- [x] **T1.2**: Implement `parseUrn(urn: string): ParsedUrn` function
  - Parse URN format: `urn:{domain}:{resourceType}::{resourceId}`
  - Extract domain, resourceType, and resourceId
  - Throw descriptive error for invalid format
- [x] **T1.3**: Implement `createUrn(domain: string, resourceType: string, resourceId: string): Urn` function
  - Construct URN string from components
  - Validate inputs before construction
- [x] **T1.4**: Implement `validateUrn(urn: string): boolean` function
  - Check format matches pattern
  - Validate domain is non-empty
  - Validate resourceType is non-empty
  - Validate resourceId is UUID v7 format
- [x] **T1.5**: Add JSDoc comments with usage examples
- [x] **T1.6**: Write unit tests for `parseUrn()`
  - Test valid URNs
  - Test invalid formats
  - Test edge cases (empty strings, malformed URNs)
- [x] **T1.7**: Write unit tests for `createUrn()`
  - Test valid inputs
  - Test invalid inputs (empty domain, empty resourceType, invalid UUID)
- [x] **T1.8**: Write unit tests for `validateUrn()`
  - Test valid URNs
  - Test various invalid formats
  - Test UUID v7 validation

---

## Story 2: UUID v7 Generation Utility

**As a** developer using the DynamoDB Relational Store library
**I want** to generate UUID v7 identifiers
**So that** I can create time-ordered resource IDs

### Acceptance Criteria
- [x] `generateUuidV7()` function generates valid UUID v7 format
- [x] Generated UUIDs are time-ordered for chronological sorting
- [x] Non-time portion is cryptographically random
- [x] Function has JSDoc documentation
- [x] Function has unit tests verifying format and time-ordering

### Tasks
- [x] **T2.1**: Create `utils/uuid-v7.ts` file
- [x] **T2.2**: Research and select UUID v7 library (or implement if needed)
- [x] **T2.3**: Implement `generateUuidV7(): string` function
  - Generate UUID v7 format
  - Ensure time-ordered for chronological sorting
  - Ensure cryptographically random non-time portion
- [x] **T2.4**: Add JSDoc comments with usage examples
- [x] **T2.5**: Write unit tests for `generateUuidV7()`
  - Test UUID v7 format validation
  - Test time-ordering (generate multiple UUIDs and verify chronological order)
  - Test uniqueness (generate many UUIDs and verify no duplicates)

---

## Story 3: Timestamp Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to work with ISO-8601 timestamps
**So that** I can create and validate timestamps consistently

### Acceptance Criteria
- [x] `getCurrentTimestamp()` returns current time in ISO-8601 format
- [x] `isValidIso8601()` validates ISO-8601 timestamp format
- [x] Functions support timezone-aware timestamps
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

### Tasks
- [x] **T3.1**: Create `utils/timestamps.ts` file
- [x] **T3.2**: Implement `getCurrentTimestamp(): string` function
  - Return current timestamp in ISO-8601 format
  - Support timezone-aware timestamps
- [x] **T3.3**: Implement `isValidIso8601(timestamp: string): boolean` function
  - Validate ISO-8601 format
  - Support various ISO-8601 formats (with/without timezone)
- [x] **T3.4**: Add JSDoc comments with usage examples
- [x] **T3.5**: Write unit tests for `getCurrentTimestamp()`
  - Test format is ISO-8601
  - Test timezone awareness
- [x] **T3.6**: Write unit tests for `isValidIso8601()`
  - Test valid ISO-8601 formats
  - Test invalid formats
  - Test edge cases

---

## Story 4: Key Generation Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to generate DynamoDB keys for records and indexes
**So that** I can create properly formatted primary keys and index keys

### Acceptance Criteria
- [x] All key generation functions implemented
- [x] Keys follow format specifications from SCHEMA.md
- [x] Functions generate PrimaryKey, InvertedIndexKey, and ResourcesByAccountIndexKey
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

### Tasks
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

---

## Story 5: Type Guards

**As a** developer using the DynamoDB Relational Store library
**I want** type guard functions to check record types at runtime
**So that** I can safely narrow types in TypeScript

### Acceptance Criteria
- [x] All type guard functions implemented
- [x] Type guards properly narrow TypeScript types
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

### Tasks
- [x] **T5.1**: Create `utils/type-guards.ts` file (or add to appropriate utility file)
- [x] **T5.2**: Implement `isResourceRecord(record: DynamoDBRecord): record is ResourceRecord`
  - Check `_recordType === "Resource"`
- [x] **T5.3**: Implement `isParentChildRelationshipRecord(record: DynamoDBRecord): record is ParentChildRelationshipRecord`
  - Check `_recordType === "ParentChildRelationship"`
- [x] **T5.4**: Implement `isCollectionMembershipRelationshipRecord(record: DynamoDBRecord): record is CollectionMembershipRelationshipRecord`
  - Check `_recordType === "CollectionMemberRelationship"`
- [x] **T5.5**: Implement `isUniqueKeyValueRecord(record: DynamoDBRecord): record is UniqueKeyValueRecord`
  - Check `_recordType === "UniqueKeyValue"`
- [x] **T5.6**: Add JSDoc comments with usage examples
- [x] **T5.7**: Write unit tests for all type guards
  - Test correct type narrowing
  - Test with all record types
  - Test TypeScript type narrowing in test code

---

## Story 6: Resource Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create Resource records
**So that** I can store primary entities in the DynamoDB table

### Acceptance Criteria
- [x] `createResource()` function implemented
- [x] Function generates UUID v7 if id not provided
- [x] Function constructs URN from resourceType and id
- [x] Function generates PK/SK in format `Resource#{urn}`
- [x] Function sets `_createdAt` and `_updatedAt` timestamps
- [x] Function validates URN format
- [x] Function returns fully-formed ResourceRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

### Tasks
- [x] **T6.1**: Create `factories/resource.ts` file
- [x] **T6.2**: Define `CreateResourceOptions` interface
  - `resourceType: string`
  - `id?: string` (optional, will generate UUID v7 if not provided)
  - `schemaVersion: number`
  - `accountUrn?: string`
  - `attributes?: Record<string, unknown>`
- [x] **T6.3**: Implement `createResource(options: CreateResourceOptions): ResourceRecord`
  - Generate UUID v7 if `id` not provided (use utility from Story 2)
  - Construct URN from resourceType and id (use utility from Story 1)
  - Generate PK/SK using `generateResourceKey()` (use utility from Story 4)
  - Set `_createdAt` and `_updatedAt` using `getCurrentTimestamp()` (use utility from Story 3)
  - Validate URN format (use utility from Story 1)
  - Merge additional attributes
  - Return fully-formed ResourceRecord
- [x] **T6.4**: Add JSDoc comments with usage examples
- [x] **T6.5**: Write unit tests for `createResource()`
  - Test with provided id
  - Test without id (should generate UUID v7)
  - Test URN construction
  - Test PK/SK generation
  - Test timestamp generation
  - Test with accountUrn
  - Test with additional attributes
  - Test validation errors (invalid resourceType, invalid id format)
  - Test edge cases

---

## Story 7: Parent-Child Relationship Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create ParentChildRelationship records
**So that** I can establish hierarchical relationships between resources

### Acceptance Criteria
- [x] `createParentChildRelationship()` function implemented
- [x] Function validates parent and child URNs
- [x] Function generates PK in format `Parent#{parentUrn}`
- [x] Function generates SK in format `Child#{childUrn}`
- [x] Function sets `_createdAt` timestamp
- [x] Function returns fully-formed ParentChildRelationshipRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

### Tasks
- [x] **T7.1**: Create `factories/relationships.ts` file (or add to existing file)
- [x] **T7.2**: Define `CreateParentChildRelationshipOptions` interface
  - `parentUrn: string`
  - `childUrn: string`
  - `accountUrn?: string`
- [x] **T7.3**: Implement `createParentChildRelationship(options: CreateParentChildRelationshipOptions): ParentChildRelationshipRecord`
  - Validate parent and child URNs (use utility from Story 1)
  - Generate PK/SK using `generateParentChildKey()` (use utility from Story 4)
  - Set `_createdAt` using `getCurrentTimestamp()` (use utility from Story 3)
  - Return fully-formed ParentChildRelationshipRecord
- [x] **T7.4**: Add JSDoc comments with usage examples
- [x] **T7.5**: Write unit tests for `createParentChildRelationship()`
  - Test valid parent and child URNs
  - Test PK/SK generation
  - Test timestamp generation
  - Test with accountUrn
  - Test validation errors (invalid parent URN, invalid child URN)
  - Test edge cases

---

## Story 8: Collection-Membership Relationship Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create CollectionMembershipRelationship records
**So that** I can establish collection membership relationships

### Acceptance Criteria
- [x] `createCollectionMembershipRelationship()` function implemented
- [x] Function validates collection and member URNs
- [x] Function validates accountUrn is provided (required)
- [x] Function generates PK in format `Collection#{collectionUrn}`
- [x] Function generates SK in format `Member#{memberUrn}`
- [x] Function sets `_createdAt` timestamp
- [x] Function returns fully-formed CollectionMembershipRelationshipRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

### Tasks
- [x] **T8.1**: Add to `factories/relationships.ts` file
- [x] **T8.2**: Define `CreateCollectionMembershipRelationshipOptions` interface
  - `collectionUrn: string`
  - `memberUrn: string`
  - `accountUrn: string` (required)
- [x] **T8.3**: Implement `createCollectionMembershipRelationship(options: CreateCollectionMembershipRelationshipOptions): CollectionMembershipRelationshipRecord`
  - Validate collection and member URNs (use utility from Story 1)
  - Validate accountUrn is provided (throw error if missing)
  - Generate PK/SK using `generateCollectionMemberKey()` (use utility from Story 4)
  - Set `_createdAt` using `getCurrentTimestamp()` (use utility from Story 3)
  - Return fully-formed CollectionMembershipRelationshipRecord
- [x] **T8.4**: Add JSDoc comments with usage examples
- [x] **T8.5**: Write unit tests for `createCollectionMembershipRelationship()`
  - Test valid collection and member URNs with accountUrn
  - Test PK/SK generation
  - Test timestamp generation
  - Test validation errors (invalid collection URN, invalid member URN, missing accountUrn)
  - Test edge cases

---

## Story 9: Unique Key-Value Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create UniqueKeyValue records
**So that** I can enforce uniqueness constraints on resource properties

### Acceptance Criteria
- [x] `createUniqueKeyValue()` function implemented
- [x] Function generates PK in format `UniqueKeyValue#{resourceType}#{key}#{value}`
- [x] Function generates SK in format `UniqueKeyValue#{resourceType}#{key}`
- [x] Function sets `_createdAt` and `_updatedAt` timestamps
- [x] Function returns fully-formed UniqueKeyValueRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

### Tasks
- [x] **T9.1**: Create `factories/unique-key-value.ts` file
- [x] **T9.2**: Define `CreateUniqueKeyValueOptions` interface
  - `resourceType: string`
  - `key: string`
  - `value: string`
  - `associatedRecordUrn?: string`
- [x] **T9.3**: Implement `createUniqueKeyValue(options: CreateUniqueKeyValueOptions): UniqueKeyValueRecord`
  - Generate PK/SK using `generateUniqueKeyValueKey()` (use utility from Story 4)
  - Set `_createdAt` and `_updatedAt` using `getCurrentTimestamp()` (use utility from Story 3)
  - Include optional `associatedRecordUrn` if provided
  - Return fully-formed UniqueKeyValueRecord
- [x] **T9.4**: Add JSDoc comments with usage examples
- [x] **T9.5**: Write unit tests for `createUniqueKeyValue()`
  - Test PK/SK generation with various resourceTypes, keys, and values
  - Test timestamp generation
  - Test with associatedRecordUrn
  - Test without associatedRecordUrn
  - Test edge cases (special characters in key/value, empty strings)

---

## Story 10: Public API Export

**As a** developer using the DynamoDB Relational Store library
**I want** a single entry point to import all types, factories, and utilities
**So that** I can easily use the library

### Acceptance Criteria
- [x] `index.ts` exports all types
- [x] `index.ts` exports all factory functions
- [x] `index.ts` exports all utility functions
- [x] `index.ts` exports type guards
- [x] All exports are properly documented

### Tasks
- [x] **T10.1**: Create `src/index.ts` file
- [x] **T10.2**: Export all types from `types/index.ts`
- [x] **T10.3**: Export all factory functions
  - Export from `factories/resource.ts`
  - Export from `factories/relationships.ts`
  - Export from `factories/unique-key-value.ts`
- [x] **T10.4**: Export all utility functions
  - Export from `utils/urn-validator.ts`
  - Export from `utils/uuid-v7.ts`
  - Export from `utils/timestamps.ts`
  - Export from `utils/key-generation.ts` (or wherever key generation utilities are)
  - Export from `utils/type-guards.ts` (or wherever type guards are)
- [x] **T10.5**: Verify all exports are accessible
- [x] **T10.6**: Add package.json exports field if needed

---

## Implementation Order

### Phase 1: Foundation Utilities (Stories 1-3, 5) ✅
These utilities are dependencies for factories:
1. ✅ Story 1: URN Utilities
2. ✅ Story 2: UUID v7 Generation
3. ✅ Story 3: Timestamp Utilities
4. ✅ Story 5: Type Guards

### Phase 2: Key Generation (Story 4) ✅
Key generation utilities are needed by factories:
5. ✅ Story 4: Key Generation Utilities

### Phase 3: Factories (Stories 6-9) ✅
Factories depend on all utilities:
6. ✅ Story 6: Resource Factory
7. ✅ Story 7: Parent-Child Relationship Factory
8. ✅ Story 8: Collection-Membership Relationship Factory
9. ✅ Story 9: Unique Key-Value Factory

### Phase 4: Public API (Story 10) ✅
Final integration:
10. ✅ Story 10: Public API Export

---

## Notes

- All tasks should follow coding standards from `constitution.md`
- All functions must have JSDoc comments with examples
- All functions must have comprehensive unit tests
- TypeScript strict mode must be enabled
- All public functions must have explicit return types
- Error handling must be descriptive and include context

