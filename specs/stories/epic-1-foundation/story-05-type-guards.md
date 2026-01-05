# Story 5: Type Guards

**As a** developer using the DynamoDB Relational Store library
**I want** type guard functions to check record types at runtime
**So that** I can safely narrow types in TypeScript

**Epic:** 1 - Foundation Utilities
**Status:** ✅ Completed

## Acceptance Criteria
- [x] All type guard functions implemented
- [x] Type guards properly narrow TypeScript types
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

## Tasks
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

