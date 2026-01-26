# AGENTS.md

This document provides context and guidance for AI agents working on the DynamoDB Relational Store codebase.

## Project Overview

The DynamoDB Relational Store is a TypeScript library that implements Single Table Design patterns for storing relational entities in DynamoDB. It provides type-safe factory functions, utilities, and validation for creating and managing resources, relationships, and unique key-value constraints.

**Key Purpose**: Enable developers to work with relational data in DynamoDB using a type-safe, well-structured approach that follows Single Table Design principles.

## Architecture & Design Principles

### Core Principles

1. **Single Table Design**: All record types (Resources, Relationships, UniqueKeyValues) are stored in a single DynamoDB table
2. **URN-based Identification**: Resources are identified using ProcessProof URNs (`urn:pp:{ResourceType}::{ID}`)
3. **Time-ordered IDs**: Resource IDs use UUID v7 for time-based sorting
4. **Type Safety**: Full TypeScript strict mode with comprehensive type definitions
5. **Runtime Validation**: Zod schemas for runtime validation of record structures
6. **Immutable Record IDs**: Record identifiers (URNs, PK/SK, resource IDs) are immutable once created; records themselves can be updated

### Record Types

The library supports four primary record types:

1. **Resource**: Primary entities in the system
   - PK/SK: `Resource#{urn}`
   - Contains resource metadata, timestamps, and optional account scoping

2. **ParentChildRelationship**: Hierarchical relationships (1:n)
   - PK: `Parent#{urn}`, SK: `Child#{urn}`
   - Supports cascading delete and authorization

3. **CollectionMembershipRelationship**: Collection membership (n:n)
   - PK: `Collection#{urn}`, SK: `Member#{urn}`
   - No cascading delete, optional authorization conveyance

4. **UniqueKeyValue**: Uniqueness constraint enforcement
   - PK: `UniqueKeyValue#{resourceType}#{key}#{value}`
   - SK: `UniqueKeyValue#{resourceType}#{key}`

## Code Structure

```
src/
├── types/                    # TypeScript type definitions
│   ├── record-types.ts       # Core record interfaces
│   ├── urn.ts                # URN type definitions
│   ├── indexes.ts            # Index key type definitions
│   ├── dynamodb.ts           # DynamoDB attribute types
│   └── index.ts              # Type exports
├── factories/                # Factory functions for creating records
│   ├── resource.ts           # Resource record factory and ResourceSchema
│   ├── relationship.ts       # Relationship factories and relationship schemas
│   └── unique-key-value.ts   # UniqueKeyValue factory and UniqueKeyValueSchema
├── utils/                    # Utility functions
│   ├── urn-validator.ts      # URN validation and parsing (exports urnSchema)
│   ├── uuid-v7.ts           # UUID v7 generation
│   ├── timestamps.ts         # ISO-8601 timestamp utilities (exports timestampSchema)
│   ├── key-generation.ts     # DynamoDB key generation (exports primaryKeySchema)
│   └── type-guards.ts        # Runtime type checking (uses Zod)
└── index.ts                  # Public API exports
```

## Key Patterns & Conventions

### Factory Functions

All factory functions follow this pattern:

1. **Accept Options Interface**: Each factory has a `Create*Options` interface
2. **Validate Input**: Validate all required fields and formats (URNs, IDs, etc.)
3. **Generate Keys**: Use key generation utilities to create PK/SK
4. **Set Timestamps**: Use `getCurrentTimestamp()` for ISO-8601 timestamps
5. **Return Complete Record**: Return fully-formed record matching the type interface

Example:
```typescript
export function createResource(options: CreateResourceOptions): ResourceRecord {
  // 1. Validate inputs
  // 2. Generate IDs/URNs if needed
  // 3. Generate keys
  // 4. Build and return record
}
```

### Validation

- **URN Validation**: Use `validateUrn()` from `urn-validator.ts`
- **Runtime Validation**: Use Zod schemas exported from factory modules (e.g., `ResourceSchema` from `resource.ts`)
- **Schema Helpers**: Import Zod schemas directly from their utility modules:
  - `urnSchema` from `urn-validator.ts`
  - `timestampSchema` from `timestamps.ts`
  - `primaryKeySchema` from `key-generation.ts`
- **Type Guards**: Use type guards from `type-guards.ts` which leverage Zod validation

### Error Handling

- Throw descriptive errors with clear messages
- Include context (e.g., invalid URN format, missing required field)
- Validate early and fail fast

### Type Safety

- All public functions MUST have explicit return types
- Use TypeScript strict mode (enforced in `tsconfig.json`)
- Avoid `any` types; use `unknown` when type is truly unknown
- Type guards use Zod validation for runtime type checking

## Development Workflow

### Setup

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Run tests: `npm test`
4. Watch mode: `npm run test:watch`

### Testing

- **Framework**: Vitest
- **Location**: Tests co-located with source files (`*.test.ts`)
- **Coverage**: Run `npm run test:coverage` for coverage reports
- **Type Tests**: Use `tsd` for TypeScript type testing

### Code Quality

- **Linting**: `npm run lint` (ESLint)
- **Type Checking**: `npm run type-check` (TypeScript compiler)
- **Strict Mode**: All code must pass strict TypeScript checks

### Building

- **Output**: `dist/` directory
- **Type Declarations**: Generated `.d.ts` files
- **Source Maps**: Enabled for debugging

## Important Files

### Core Type Definitions

- **`src/types/record-types.ts`**: Defines all record interfaces (ResourceRecord, ParentChildRelationshipRecord, etc.)
- **`src/types/urn.ts`**: URN type definitions and utilities
- **`src/types/indexes.ts`**: Index key type definitions (PrimaryKey, InvertedIndexKey, etc.)

### Factory Functions

- **`src/factories/resource.ts`**: Creates Resource records and exports ResourceSchema
- **`src/factories/relationship.ts`**: Creates ParentChild and CollectionMember relationships, exports ParentChildRelationshipSchema and CollectionMembershipRelationshipSchema
- **`src/factories/unique-key-value.ts`**: Creates UniqueKeyValue records and exports UniqueKeyValueSchema

### Utilities

- **`src/utils/urn-validator.ts`**: URN parsing, creation, and validation
- **`src/utils/uuid-v7.ts`**: UUID v7 generation using `@kripod/uuidv7`
- **`src/utils/timestamps.ts`**: ISO-8601 timestamp generation and validation
- **`src/utils/key-generation.ts`**: DynamoDB key generation for all record types (exports primaryKeySchema)
- **`src/utils/type-guards.ts`**: Runtime type checking using Zod schemas
- **`src/utils/urn-validator.ts`**: URN parsing, creation, and validation (exports urnSchema)
- **`src/utils/timestamps.ts`**: ISO-8601 timestamp generation and validation (exports timestampSchema)

### Configuration

- **`tsconfig.json`**: TypeScript configuration (strict mode enabled)
- **`vitest.config.ts`**: Vitest test configuration
- **`package.json`**: Dependencies and scripts

### Documentation

- **`specs/PRD.md`**: Product Requirements Document
- **`specs/SCHEMA.md`**: Detailed schema specifications
- **`specs/CONSTITUTION.md`**: Coding standards and conventions
- **`docs/VERSIONING.md`**: Versioning strategy
- **`docs/PUBLISHING.md`**: Publishing process

## Common Tasks

### Adding a New Record Type

1. Define the record interface in `src/types/record-types.ts`
2. Create a factory function in `src/factories/`
3. Add key generation utility in `src/utils/key-generation.ts`
4. Create Zod schema in `src/utils/zod-schemas.ts`
5. Add type guard in `src/utils/type-guards.ts`
6. Export from `src/index.ts`
7. Write tests for factory, validation, and type guard
8. Update documentation

### Adding Validation

1. Add Zod schema to the corresponding factory module (e.g., `ResourceSchema` in `resource.ts`)
2. Import schema helpers directly from their utility modules:
   - `urnSchema` from `src/utils/urn-validator.ts`
   - `timestampSchema` from `src/utils/timestamps.ts`
   - `primaryKeySchema` from `src/utils/key-generation.ts`
3. Update type guard to use Zod validation in `src/utils/type-guards.ts`
4. Ensure factory functions validate inputs before creating records
5. Write tests for validation edge cases

### Modifying Existing Types

1. Update type definition in `src/types/record-types.ts`
2. Update corresponding Zod schema in the factory module (e.g., `ResourceSchema` in `resource.ts`)
3. Update factory function if needed
4. Update type guard if needed
5. Update all tests
6. Check for breaking changes (may require major version bump)

## Dependencies

### Runtime Dependencies

- **`@kripod/uuidv7`**: UUID v7 generation
- **`zod`**: Runtime validation and type inference

### Development Dependencies

- **`typescript`**: TypeScript compiler
- **`vitest`**: Testing framework
- **`@vitest/coverage-v8`**: Code coverage
- **`tsd`**: TypeScript type testing
- **`@types/node`**: Node.js type definitions

### Peer Dependencies

- **`@aws-sdk/client-dynamodb`**: DynamoDB client (optional, for consumers)

## Publishing

### Prerequisites

1. Authenticate with AWS CodeArtifact:
   ```bash
   aws codeartifact login --tool npm --repository npm-store --domain jamesearlywine --domain-owner 546515125053 --region us-east-2
   ```

### Publishing Process

1. **Version Update**: Use npm version scripts:
   - `npm run version:patch` - Bug fixes
   - `npm run version:minor` - New features
   - `npm run version:major` - Breaking changes

2. **Dry Run**: Test publishing without actually publishing:
   ```bash
   npm run publish:dry-run
   ```

3. **Publish**: After versioning and testing:
   ```bash
   npm run publish:private
   ```

### Pre-publish Checks

The `prepublishOnly` script automatically runs:
- `npm run build` - Compiles TypeScript
- `npm run test` - Runs all tests

## Key Constraints & Rules

1. **Strict TypeScript**: All code must pass strict mode checks
2. **No `any` Types**: Use `unknown` when type is truly unknown
3. **Explicit Return Types**: All public functions must have explicit return types
4. **JSDoc Comments**: All public functions must have JSDoc documentation
5. **URN Format**: Must follow `urn:{domain}:{resourceType}::{resourceId}` pattern
6. **UUID v7**: Resource IDs must be UUID v7 format
7. **ISO-8601 Timestamps**: All timestamps must be ISO-8601 format
8. **Immutable Record IDs**: Record identifiers (URNs, PK/SK, resource IDs) must not change after creation; records themselves can be updated (e.g., timestamps, attributes)

## Testing Patterns

### Unit Tests

- Test factory functions with valid inputs
- Test validation with invalid inputs
- Test edge cases (empty strings, missing fields, etc.)
- Test error messages are descriptive

### Type Tests

- Use `tsd` to verify TypeScript type narrowing works correctly
- Test type guards properly narrow union types

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { createResource } from './resource';

describe('createResource', () => {
  it('should create a valid resource record', () => {
    // Test implementation
  });

  it('should throw error for invalid input', () => {
    // Test error handling
  });
});
```

## When Making Changes

### Before Starting

1. Read relevant specs in `specs/` directory
2. Review `specs/CONSTITUTION.md` for coding standards
3. Check existing similar implementations for patterns

### During Development

1. Write tests alongside implementation
2. Run `npm run type-check` frequently
3. Run `npm test` to ensure no regressions
4. Follow existing code patterns and conventions

### Before Committing

1. Run `npm run build` to ensure code compiles
2. Run `npm test` to ensure all tests pass
3. Run `npm run lint` to check code quality
4. Run `npm run type-check` to verify type safety
5. Update documentation if needed

## Additional Resources

- **PRD**: `specs/PRD.md` - Product requirements and design decisions
- **Schema**: `specs/SCHEMA.md` - Detailed record schemas and indexes
- **Constitution**: `specs/CONSTITUTION.md` - Coding standards and requirements
- **Versioning**: `docs/VERSIONING.md` - Versioning strategy
- **Publishing**: `docs/PUBLISHING.md` - Publishing guidelines

## Notes for AI Agents

- Always validate URNs using `validateUrn()` before using them
- Use factory functions to create records; don't construct records manually
- Leverage Zod schemas for runtime validation in type guards
- Zod schemas are co-located with their factory functions (e.g., `ResourceSchema` in `resource.ts`)
- Import Zod schema helpers directly from their utility modules (urnSchema, timestampSchema, primaryKeySchema)
- Follow the existing patterns for error messages (descriptive, contextual)
- When in doubt, check `specs/CONSTITUTION.md` for coding standards
- Test files should be comprehensive and cover edge cases
- Maintain backward compatibility unless making a major version change
