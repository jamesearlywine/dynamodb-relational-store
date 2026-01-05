# Story 3: Timestamp Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to work with ISO-8601 timestamps
**So that** I can create and validate timestamps consistently

**Epic:** 1 - Foundation Utilities
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `getCurrentTimestamp()` returns current time in ISO-8601 format
- [x] `isValidIso8601()` validates ISO-8601 timestamp format
- [x] Functions support timezone-aware timestamps
- [x] All functions have JSDoc documentation
- [x] All functions have unit tests

## Tasks
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

