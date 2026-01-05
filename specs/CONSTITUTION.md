# Constitution

## Overview

This document defines the standards, conventions, and structure for the TypeScript library that implements the DynamoDB Relational Store. The library provides type-safe interfaces, factory methods, and utilities to support Single Table Design patterns for storing relational entities in DynamoDB.

## Project Structure

```
src/
├── types/
│   ├── record-types.ts      # Core record type definitions
│   ├── urn.ts               # URN type definitions and utilities
│   ├── indexes.ts           # Index key type definitions
│   └── dynamodb.ts          # DynamoDB attribute value types
├── factories/
│   ├── resource.ts          # Resource record factory
│   ├── relationships.ts     # Relationship record factories
│   └── unique-key-value.ts  # UniqueKeyValue record factory
├── utils/
│   ├── urn-validator.ts     # URN format validation
│   ├── uuid-v7.ts          # UUID v7 generation
│   └── timestamps.ts        # ISO-8601 timestamp utilities
└── index.ts                 # Public API exports
```

## Type Definitions

The library MUST define all required types as specified in the type definition files under `types/`. Type definitions are separated into the following modules:

### Required Type Modules

1. **`types/record-types.ts`** - MUST define:
   - `ResourceRecord` interface
   - `ParentChildRelationshipRecord` interface
   - `CollectionMembershipRelationshipRecord` interface
   - `UniqueKeyValueRecord` interface
   - `RecordType` union type
   - `DynamoDBRecord` union type

2. **`types/urn.ts`** - MUST define:
   - `Urn` type alias
   - `ParsedUrn` interface

3. **`types/indexes.ts`** - MUST define:
   - `PrimaryKey` interface
   - `InvertedIndexKey` interface
   - `ResourcesByAccountIndexKey` interface

4. **`types/dynamodb.ts`** - MUST define:
   - DynamoDB attribute value types as needed

5. **`types/index.ts`** - MUST export:
   - All types from the above modules for public consumption

### Type Requirements

All type definitions MUST:
- Follow the schema specifications in `specs/SCHEMA.md`
- Include JSDoc comments documenting each interface and property
- Use TypeScript strict mode compliance
- Export all types for use by factory methods and utilities
- Maintain type safety for all record operations

See the individual type definition files for complete type specifications.

## Factory Methods

### Resource Factory

The factory MUST accept options conforming to `CreateResourceOptions` and return a `ResourceRecord`.

**Required Types:**
- `CreateResourceOptions` interface (defined in factory implementation)
- `ResourceRecord` interface (from `types/record-types.ts`)

**Function Signature:**
```typescript
function createResource(options: CreateResourceOptions): ResourceRecord;
```

**Responsibilities:**
- Generate UUID v7 if `id` not provided
- Construct URN from resourceType and id
- Generate PK/SK in format `Resource#{urn}`
- Set `_createdAt` and `_updatedAt` to current ISO-8601 timestamp
- Validate URN format
- Return fully-formed ResourceRecord

### ParentChildRelationship Factory

The factory MUST accept options conforming to `CreateParentChildRelationshipOptions` and return a `ParentChildRelationshipRecord`.

**Required Types:**
- `CreateParentChildRelationshipOptions` interface (defined in factory implementation)
- `ParentChildRelationshipRecord` interface (from `types/record-types.ts`)

**Function Signature:**
```typescript
function createParentChildRelationship(
  options: CreateParentChildRelationshipOptions
): ParentChildRelationshipRecord;
```

**Responsibilities:**
- Validate parent and child URNs
- Generate PK in format `Parent#{parentUrn}`
- Generate SK in format `Child#{childUrn}`
- Set `_createdAt` to current ISO-8601 timestamp
- Return fully-formed ParentChildRelationshipRecord

### CollectionMembershipRelationship Factory

The factory MUST accept options conforming to `CreateCollectionMembershipRelationshipOptions` and return a `CollectionMembershipRelationshipRecord`.

**Required Types:**
- `CreateCollectionMembershipRelationshipOptions` interface (defined in factory implementation)
- `CollectionMembershipRelationshipRecord` interface (from `types/record-types.ts`)

**Function Signature:**
```typescript
function createCollectionMembershipRelationship(
  options: CreateCollectionMembershipRelationshipOptions
): CollectionMembershipRelationshipRecord;
```

**Responsibilities:**
- Validate collection and member URNs
- Validate accountUrn is provided
- Generate PK in format `Collection#{collectionUrn}`
- Generate SK in format `Member#{memberUrn}`
- Set `_createdAt` to current ISO-8601 timestamp
- Return fully-formed CollectionMembershipRelationshipRecord

### UniqueKeyValue Factory

The factory MUST accept options conforming to `CreateUniqueKeyValueOptions` and return a `UniqueKeyValueRecord`.

**Required Types:**
- `CreateUniqueKeyValueOptions` interface (defined in factory implementation)
- `UniqueKeyValueRecord` interface (from `types/record-types.ts`)

**Function Signature:**
```typescript
function createUniqueKeyValue(
  options: CreateUniqueKeyValueOptions
): UniqueKeyValueRecord;
```

**Responsibilities:**
- Generate PK in format `UniqueKeyValue#{resourceType}#{key}#{value}`
- Generate SK in format `UniqueKeyValue#{resourceType}#{key}`
- Set `_createdAt` and `_updatedAt` to current ISO-8601 timestamp
- Return fully-formed UniqueKeyValueRecord

## Utility Functions

### URN Utilities

**Required Types:**
- `Urn` type (from `types/urn.ts`)
- `ParsedUrn` interface (from `types/urn.ts`)

**Function Signatures:**
```typescript
function parseUrn(urn: string): ParsedUrn;
function createUrn(domain: string, resourceType: string, resourceId: string): Urn;
function validateUrn(urn: string): boolean;
```

**URN Format Validation:**
- MUST match pattern: `urn:{domain}:{resourceType}::{resourceId}`
- Domain MUST be non-empty
- ResourceType MUST be non-empty
- ResourceId MUST be valid UUID v7 format

### UUID v7 Generation

```typescript
function generateUuidV7(): string;
```

**Requirements:**
- MUST generate UUID v7 format (time-ordered)
- MUST be suitable for chronological sorting
- MUST be cryptographically random for the non-time portion

### Timestamp Utilities

```typescript
function getCurrentTimestamp(): string;  // Returns ISO-8601 format
function isValidIso8601(timestamp: string): boolean;
```

**Requirements:**
- MUST return timestamps in ISO-8601 format
- MUST support timezone-aware timestamps
- MUST validate timestamp format

### Key Generation Utilities

**Required Types:**
- `PrimaryKey` interface (from `types/indexes.ts`)
- `InvertedIndexKey` interface (from `types/indexes.ts`)
- `ResourcesByAccountIndexKey` interface (from `types/indexes.ts`)
- `DynamoDBRecord` union type (from `types/record-types.ts`)

**Function Signatures:**
```typescript
function generateResourceKey(urn: string): PrimaryKey;
function generateParentChildKey(parentUrn: string, childUrn: string): PrimaryKey;
function generateCollectionMemberKey(collectionUrn: string, memberUrn: string): PrimaryKey;
function generateUniqueKeyValueKey(resourceType: string, key: string, value: string): PrimaryKey;
function generateInvertedIndexKey(record: DynamoDBRecord): InvertedIndexKey;
function generateAccountIndexKey(accountUrn: string, urn: string): ResourcesByAccountIndexKey;
```

## Type Guards

**Required Types:**
- `DynamoDBRecord` union type (from `types/record-types.ts`)
- `ResourceRecord` interface (from `types/record-types.ts`)
- `ParentChildRelationshipRecord` interface (from `types/record-types.ts`)
- `CollectionMembershipRelationshipRecord` interface (from `types/record-types.ts`)
- `UniqueKeyValueRecord` interface (from `types/record-types.ts`)

**Function Signatures:**
```typescript
function isResourceRecord(record: DynamoDBRecord): record is ResourceRecord;
function isParentChildRelationshipRecord(record: DynamoDBRecord): record is ParentChildRelationshipRecord;
function isCollectionMembershipRelationshipRecord(record: DynamoDBRecord): record is CollectionMembershipRelationshipRecord;
function isUniqueKeyValueRecord(record: DynamoDBRecord): record is UniqueKeyValueRecord;
```

## Coding Standards

### TypeScript Standards

1. **Strict Mode**: All code MUST use TypeScript strict mode
2. **No `any` Types**: Avoid `any`; use `unknown` when type is truly unknown
3. **Explicit Return Types**: All public functions MUST have explicit return types
4. **Immutable by Default**: Records SHOULD be treated as immutable after creation
5. **Readonly Properties**: Use `readonly` for properties that should not be modified

### Naming Conventions

1. **Interfaces**: PascalCase (e.g., `ResourceRecord`)
2. **Types**: PascalCase (e.g., `RecordType`, `Urn`)
3. **Functions**: camelCase (e.g., `createResource`)
4. **Constants**: UPPER_SNAKE_CASE (e.g., `RECORD_TYPE_RESOURCE`)
5. **Private Functions**: Prefix with underscore (e.g., `_validateUrnFormat`)

### Error Handling

1. **Validation Errors**: MUST throw descriptive errors with clear messages
2. **Type Errors**: MUST use TypeScript's type system to prevent invalid states
3. **Runtime Errors**: MUST include context (e.g., invalid URN format, missing required field)

### Documentation

1. **JSDoc Comments**: All public functions MUST have JSDoc comments
2. **Type Documentation**: Complex types MUST have inline documentation
3. **Examples**: Factory methods SHOULD include usage examples in JSDoc

## Testing Requirements

1. **Unit Tests**: All factory methods MUST have unit tests
2. **Type Tests**: TypeScript type tests MUST verify type safety
3. **Validation Tests**: URN validation MUST be thoroughly tested
4. **Edge Cases**: Tests MUST cover edge cases and error conditions

## Dependencies

### Required Dependencies

- `uuid`: For UUID v7 generation (or equivalent library)
- `@aws-sdk/client-dynamodb`: For DynamoDB client types (if needed)

### Development Dependencies

- `typescript`: ^5.0.0
- `@types/node`: For Node.js type definitions
- Testing framework (e.g., `vitest`, `jest`)
- Type testing utilities (e.g., `tsd`)

## Versioning

The library MUST follow semantic versioning:
- **MAJOR**: Breaking changes to public API
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Export Strategy

The library MUST export:
- All type definitions (for consumers to use in their code)
- All factory functions (for creating records)
- All utility functions (for URN, UUID, timestamp operations)
- Type guards (for runtime type checking)

Example:
```typescript
// index.ts
export * from './types';
export * from './factories';
export * from './utils';
```

## Compliance

This constitution MUST be followed for all code contributions. Any deviations MUST be documented and approved through the project's review process.

## References

- **PRD**: See `specs/PRD.md` for product requirements
- **Schema**: See `specs/SCHEMA.md` for detailed schema specifications
- **README**: See `README.md` for project overview

