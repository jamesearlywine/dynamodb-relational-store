# Story 9: Unique Key-Value Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create UniqueKeyValue records
**So that** I can enforce uniqueness constraints on resource properties

**Phase:** 3 - Factories
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `createUniqueKeyValue()` function implemented
- [x] Function generates PK in format `UniqueKeyValue#{resourceType}#{key}#{value}`
- [x] Function generates SK in format `UniqueKeyValue#{resourceType}#{key}`
- [x] Function sets `_createdAt` and `_updatedAt` timestamps
- [x] Function returns fully-formed UniqueKeyValueRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

## Tasks
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

