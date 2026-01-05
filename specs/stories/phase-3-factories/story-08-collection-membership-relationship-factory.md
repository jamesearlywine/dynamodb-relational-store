# Story 8: Collection-Membership Relationship Factory

**As a** developer using the DynamoDB Relational Store library
**I want** to create CollectionMembershipRelationship records
**So that** I can establish collection membership relationships

**Phase:** 3 - Factories
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `createCollectionMembershipRelationship()` function implemented
- [x] Function validates collection and member URNs
- [x] Function validates accountUrn is provided (required)
- [x] Function generates PK in format `Collection#{collectionUrn}`
- [x] Function generates SK in format `Member#{memberUrn}`
- [x] Function sets `_createdAt` timestamp
- [x] Function returns fully-formed CollectionMembershipRelationshipRecord
- [x] Function has JSDoc documentation with examples
- [x] Function has comprehensive unit tests

## Tasks
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

