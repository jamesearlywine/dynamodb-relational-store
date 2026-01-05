# Story 6: Resource Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create Resource records
**So that** I can store primary entities in the DynamoDB table

**Phase:** 3 - Factories
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `createResource()` function implemented
- [x] Function generates UUID v7 if id not provided
- [x] Function constructs URN from resourceType and id
- [x] Function generates PK/SK in format `Resource#{urn}`
- [x] Function sets `_createdAt` and `_updatedAt` timestamps
- [x] Function validates URN format
- [x] Function returns fully-formed ResourceRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

## Tasks
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

