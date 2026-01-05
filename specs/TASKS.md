# Implementation Tasks

This document contains all implementation tasks extracted from `STORIES.md`, organized by implementation phase.

## ✅ Status: All Tasks Completed

All 65 tasks across 4 phases have been completed. All tests are passing (84 tests), and the codebase is ready for use.

## Phase 1: Foundation Utilities

### Story 1: URN Utilities

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

### Story 2: UUID v7 Generation Utility

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

### Story 3: Timestamp Utilities

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

### Story 5: Type Guards

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

## Phase 2: Key Generation

### Story 4: Key Generation Utilities

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

## Phase 3: Factories

### Story 6: Resource Factory

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

### Story 7: Parent-Child Relationship Factory

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

### Story 8: Collection-Membership Relationship Factory

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

### Story 9: Unique Key-Value Factory

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

## Phase 4: Public API

### Story 10: Public API Export

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

## Task Summary

### By Phase

- **Phase 1 (Foundation Utilities)**: 30 tasks ✅
  - Story 1 (URN Utilities): 8 tasks ✅
  - Story 2 (UUID v7): 5 tasks ✅
  - Story 3 (Timestamps): 6 tasks ✅
  - Story 5 (Type Guards): 7 tasks ✅

- **Phase 2 (Key Generation)**: 9 tasks ✅
  - Story 4 (Key Generation): 9 tasks ✅

- **Phase 3 (Factories)**: 20 tasks ✅
  - Story 6 (Resource Factory): 5 tasks ✅
  - Story 7 (Parent-Child Factory): 5 tasks ✅
  - Story 8 (Collection-Membership Factory): 5 tasks ✅
  - Story 9 (Unique Key-Value Factory): 5 tasks ✅

- **Phase 4 (Public API)**: 6 tasks ✅
  - Story 10 (Public API Export): 6 tasks ✅

**Total Tasks: 65 (All Completed ✅)**

### By Category

- **Implementation**: 30 tasks
- **Testing**: 20 tasks
- **Documentation**: 10 tasks
- **Setup/Configuration**: 5 tasks

---

## Dependencies

### Task Dependencies

**Phase 1 must be completed before Phase 2:**
- T1.1-T1.8 (URN Utilities) - Required by key generation and factories
- T2.1-T2.5 (UUID v7) - Required by Resource Factory
- T3.1-T3.6 (Timestamps) - Required by all factories
- T5.1-T5.7 (Type Guards) - Can be done in parallel

**Phase 2 must be completed before Phase 3:**
- T4.1-T4.9 (Key Generation) - Required by all factories

**Phase 3 can be done in parallel after Phase 1 & 2:**
- T6.1-T6.5 (Resource Factory)
- T7.1-T7.5 (Parent-Child Factory)
- T8.1-T8.5 (Collection-Membership Factory)
- T9.1-T9.5 (Unique Key-Value Factory)

**Phase 4 must be done last:**
- T10.1-T10.6 (Public API Export) - Requires all previous phases

---

## Notes

- All tasks should follow coding standards from `constitution.md`
- All functions must have JSDoc comments with examples
- All functions must have comprehensive unit tests
- TypeScript strict mode must be enabled
- All public functions must have explicit return types
- Error handling must be descriptive and include context
- See `STORIES.md` for detailed acceptance criteria for each story

