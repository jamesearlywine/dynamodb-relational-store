# Story 1: URN Utilities

**As a** developer using the DynamoDB Relational Store library
**I want** to parse, create, and validate URNs
**So that** I can work with ProcessProof URN format consistently

**Phase:** 1 - Foundation Utilities
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `parseUrn()` function parses URNs into ParsedUrn structure
- [x] `createUrn()` function constructs URNs from components
- [x] `validateUrn()` function validates URN format
- [x] All functions have JSDoc documentation with examples
- [x] All functions have unit tests covering valid and invalid inputs
- [x] Validation follows URN format specification: `urn:{domain}:{resourceType}::{resourceId}`
- [x] Validation ensures domain and resourceType are non-empty
- [x] Validation ensures resourceId is valid UUID v7 format

## Tasks
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

