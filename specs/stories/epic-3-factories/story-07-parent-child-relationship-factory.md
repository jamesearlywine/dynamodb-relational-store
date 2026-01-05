# Story 7: Parent-Child Relationship Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create ParentChildRelationship records
**So that** I can establish hierarchical relationships between resources

**Epic:** 3 - Factories
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `createParentChildRelationship()` function implemented
- [x] Function validates parent and child URNs
- [x] Function generates PK in format `Parent#{parentUrn}`
- [x] Function generates SK in format `Child#{childUrn}`
- [x] Function sets `_createdAt` timestamp
- [x] Function returns fully-formed ParentChildRelationshipRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

## Tasks
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

