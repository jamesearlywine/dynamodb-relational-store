# Story 2: UUID v7 Generation Utility

**As a** developer using the DynamoDB Relational Store library
**I want** to generate UUID v7 identifiers
**So that** I can create time-ordered resource IDs

**Phase:** 1 - Foundation Utilities
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `generateUuidV7()` function generates valid UUID v7 format
- [x] Generated UUIDs are time-ordered for chronological sorting
- [x] Non-time portion is cryptographically random
- [x] Function has JSDoc documentation
- [x] Function has unit tests verifying format and time-ordering

## Tasks
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

