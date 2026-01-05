# Story 10: Public API Export

**As a** developer using the DynamoDB Relational Store library
**I want** a single entry point to import all types, factories, and utilities
**So that** I can easily use the library

**Epic:** 4 - Public API
**Status:** ✅ Completed

## Acceptance Criteria
- [x] `index.ts` exports all types
- [x] `index.ts` exports all factory functions
- [x] `index.ts` exports all utility functions
- [x] `index.ts` exports type guards
- [x] All exports are properly documented

## Tasks
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

