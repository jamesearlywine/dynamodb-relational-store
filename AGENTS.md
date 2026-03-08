# AGENTS.md

This document provides context and guidance for AI agents working on the DynamoDB Relational Store codebase.

## Project Overview

The DynamoDB Relational Store is a TypeScript library that implements Single Table Design patterns for storing relational entities in DynamoDB. It provides type-safe factory functions, utilities, and validation for creating and managing resources, relationships, and unique key-value constraints.

**Key Purpose**: Enable developers to work with relational data in DynamoDB using a type-safe, well-structured approach that follows Single Table Design principles.

## Architecture & Design Principles

### Core Principles

1. **Single Table Design**: All record types (Resources, Relationships, UniqueKeyValues) are stored in a single DynamoDB table
2. **URN-based Identification**: Resources are identified using ProcessProof URNs (`urn:processproof:{ResourceType}::{ID}`)
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
├── records/                          # Record types (one folder per record type)
│   ├── resource/                     # Resource records
│   │   ├── resource-record.type.ts    # ResourceRecord interface
│   │   ├── resource-record.factory.ts # Factory and ResourceSchema
│   │   ├── resource-record.schema.ts  # Zod schema
│   │   ├── resource-record.typeguard.ts
│   │   ├── resource-record.typeguard.type.ts
│   │   ├── index.ts                  # Record exports
│   │   └── *.test.ts
│   ├── parent-child-relationship/     # ParentChild relationship records
│   │   ├── parent-child-relationship-record.type.ts
│   │   ├── parent-child-relationship-record.factory.ts
│   │   ├── parent-child-relationship-record.schema.ts
│   │   ├── parent-child-relationship-record.typeguard.ts
│   │   ├── index.ts
│   │   └── *.test.ts
│   ├── collection-membership-relationship/  # CollectionMember relationship records
│   │   ├── collection-membership-relationship-record.type.ts
│   │   ├── collection-membership-relationship-record.factory.ts
│   │   ├── collection-membership-relationship-record.schema.ts
│   │   ├── collection-membership-relationship-record.typeguard.ts
│   │   ├── index.ts
│   │   └── *.test.ts
│   ├── unique-key-value/              # UniqueKeyValue records
│   │   ├── unique-key-value-record.type.ts
│   │   ├── unique-key-value-record.factory.ts
│   │   ├── unique-key-value-record.schema.ts
│   │   ├── unique-key-value-record.typeguard.ts
│   │   ├── index.ts
│   │   └── *.test.ts
│   ├── dynamodb-record.type.ts        # DynamoDBRecord union and record types
│   └── dynamodb-attribute-value.type.ts  # DynamoDB attribute value types
├── keys/                      # Key types and key generation
│   ├── primary-key.type.ts    # PrimaryKey type definitions
│   ├── urn.type.ts            # URN type and UrnComponents
│   ├── urn-validator.ts       # URN validation and parsing (exports urnSchema)
│   ├── uuid-v7.ts             # UUID v7 generation
│   ├── key-generation.ts      # DynamoDB key generation (exports primaryKeySchema)
│   └── *.test.ts
├── indexes/                   # Index key type definitions
│   ├── inverted-index-key.type.ts         # GSI1 (InvertedIndexKey)
│   └── resource-by-account-index-key.type.ts  # Resource-by-account index keys
└── timestamps/                # Timestamp utilities
    ├── timestamps.ts          # getCurrentTimestamp, ISO-8601 (exports timestampSchema)
    ├── timestamp.schema.ts    # Timestamp Zod schema
    ├── timestamp.typeguard.ts # Timestamp type guard
    └── *.test.ts
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
- **Runtime Validation**: Use Zod schemas exported from record modules (e.g., `ResourceSchema` from `resource-record.schema.ts`)
- **Schema Helpers**: Import Zod schemas directly from their utility modules:
  - `urnSchema` from `urn-validator.ts`
  - `timestampSchema` from `timestamps.ts`
  - `primaryKeySchema` from `key-generation.ts`
- **Type Guards**: Use type guards co-located per record (e.g. `resource-record.typeguard.ts`), which leverage Zod validation

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

- **`src/records/dynamodb-record.type.ts`**: DynamoDBRecord union and record type re-exports
- **`src/records/resource/resource-record.type.ts`**: ResourceRecord interface
- **`src/records/parent-child-relationship/parent-child-relationship-record.type.ts`**: ParentChildRelationshipRecord
- **`src/records/collection-membership-relationship/collection-membership-relationship-record.type.ts`**: CollectionMembershipRelationshipRecord
- **`src/records/unique-key-value/unique-key-value-record.type.ts`**: UniqueKeyValueRecord
- **`src/keys/urn.type.ts`**: URN type and UrnComponents
- **`src/indexes/inverted-index-key.type.ts`**: InvertedIndexKey (GSI1)
- **`src/indexes/resource-by-account-index-key.type.ts`**: Resource-by-account index key types

### Factory Functions and Schemas

- **`src/records/resource/resource-record.factory.ts`**: Creates Resource records, exports ResourceSchema
- **`src/records/parent-child-relationship/parent-child-relationship-record.factory.ts`**: ParentChild factories and ParentChildRelationshipSchema
- **`src/records/collection-membership-relationship/collection-membership-relationship-record.factory.ts`**: CollectionMember factories and CollectionMembershipRelationshipSchema
- **`src/records/unique-key-value/unique-key-value-record.factory.ts`**: UniqueKeyValue factory and UniqueKeyValueSchema

### Utilities

- **`src/keys/urn-validator.ts`**: URN parsing, creation, and validation (exports urnSchema)
- **`src/keys/uuid-v7.ts`**: UUID v7 generation using `@kripod/uuidv7`
- **`src/keys/key-generation.ts`**: DynamoDB key generation for all record types (exports primaryKeySchema)
- **`src/timestamps/timestamps.ts`**: ISO-8601 timestamp generation and validation (exports timestampSchema)
- **Type guards**: Co-located per record (e.g. `src/records/resource/resource-record.typeguard.ts`), use Zod validation

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

1. Create a new folder under `src/records/{record-name}/`
2. Define the record interface in `{record-name}-record.type.ts`
3. Add key generation in `src/keys/key-generation.ts` if needed
4. Create factory and Zod schema (e.g. `{record-name}-record.factory.ts`, `{record-name}-record.schema.ts`)
5. Add type guard in `{record-name}-record.typeguard.ts`
6. Add `DynamoDBRecord` union and exports in `src/records/dynamodb-record.type.ts` and the record folder `index.ts`
7. Write tests co-located (`*.test.ts`)
8. Update documentation

### Adding Validation

1. Add or extend Zod schema in the record’s schema file (e.g. `resource-record.schema.ts`)
2. Import schema helpers from:
   - `urnSchema` from `src/keys/urn-validator.ts`
   - `timestampSchema` from `src/timestamps/timestamps.ts`
   - `primaryKeySchema` from `src/keys/key-generation.ts`
3. Use Zod in the record’s typeguard (e.g. `resource-record.typeguard.ts`)
4. Ensure factory functions validate inputs before creating records
5. Write tests for validation edge cases

### Modifying Existing Types

1. Update the record type in `src/records/{record-name}/{record-name}-record.type.ts`
2. Update the Zod schema in that record’s `*-record.schema.ts`
3. Update the factory and typeguard in the same folder if needed
4. Update all tests
5. Check for breaking changes (may require major version bump)

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

- Always validate URNs using `validateUrn()` from `src/keys/urn-validator.ts` before using them
- Use factory functions to create records; don't construct records manually
- Leverage Zod schemas for runtime validation in type guards (co-located per record in `*-record.schema.ts`)
- Zod schemas are co-located with each record (e.g. `ResourceSchema` in `resource-record.schema.ts`)
- Import schema helpers from: `urnSchema` (`src/keys/urn-validator.ts`), `timestampSchema` (`src/timestamps/timestamps.ts`), `primaryKeySchema` (`src/keys/key-generation.ts`)
- Follow the existing patterns for error messages (descriptive, contextual)
- When in doubt, check `specs/CONSTITUTION.md` for coding standards
- Test files should be comprehensive and cover edge cases; tests are co-located (`*.test.ts`)
- Maintain backward compatibility unless making a major version change

## Before making changes to any database schema

- Ensure it is compatible with ENTITY_SCHEMAS.md
- Ensure it is compatible with ENTITY_RELATIONSHIP_DIAGRAM.drawio
- Ensure that the two files ENTITY_SCHEMAS.md and ENTITY_RELATIONSHIP_DIAGRAM.drawio reflect the same data models
  - for any differences that exist between the two files, display that differences and ask which document to update, for each difference.

## Before making changes to any data store or data entity class or interface in the code

- Ensure it is compatible with docs/ENTITY_SCHEMAS.md
- Ensure it is compatible with docs/ENTITY_RELATIONSHIP_DIAGRAM.drawio