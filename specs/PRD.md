# Product Requirements Document: DynamoDB Relational Store

## 1. Executive Summary

The DynamoDB Relational Store is a system designed to store relational entities in a DynamoDB table using Single Table Design principles. This system serves as the system-of-record for all System data entities and relationships between those entities, enabling efficient storage and querying of hierarchical and collection-based relationships in a NoSQL environment.

## 2. Project Overview

### 2.1 Purpose
Store relational entities in a DynamoDB table using Single Table Design principles, providing a scalable and performant solution for managing system data entities and their relationships.

**Note**: This library provides the basic set of data requirements that span all entity types. It defines the foundational patterns for storing resources, relationships, and constraints that can be leveraged across any domain or entity type in the system.

### 2.2 Scope
- Storage of resource entities with URN-based identification
- Management of parent-child hierarchical relationships
- Management of collection-membership relationships
- Enforcement of uniqueness constraints
- Efficient querying through multiple indexes

**Out of Scope:**
- Security grants (stored in a separate table)
- Application-level business logic
- Data migration tools

### 2.3 Related Documentation
- **README**: See project root `README.md` for high-level overview
- **Schema Specification**: See `specs/SCHEMA.md` for detailed schema definitions
- **Meta-schema Reference**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1951432706/System+Data+Store+-+DynamoDB)

## 3. Requirements

### 3.1 Functional Requirements

#### FR1: Resource Storage
The system MUST support storing resource entities with the following capabilities:
- Unique identification via ProcessProof URN format
- Time-ordered resource IDs using UUID v7
- Schema versioning for data contract evolution
- Account-level scoping for multi-tenant support

#### FR2: Parent-Child Relationships
The system MUST support hierarchical parent-child relationships with:
- Cascading DELETE operations (deleting parent deletes children)
- Cascading authorization (parent permissions apply to children)
- 1:n cardinality (one parent to many children)

#### FR3: Collection-Membership Relationships
The system MUST support collection-membership relationships with:
- No cascading delete behavior
- Optional authorization conveyance
- n:n cardinality (many-to-many relationships)

#### FR4: Uniqueness Constraints
The system MUST support enforcing uniqueness constraints on resource properties through dedicated UniqueKeyValue records.

#### FR5: Query Capabilities
The system MUST support the following query patterns:
- Direct resource lookup by URN
- Reverse lookups (find parents of a child, find collections containing a member)
- Account-scoped resource queries
- Relationship traversal queries

### 3.2 Non-Functional Requirements

#### NFR1: Performance
- All queries MUST complete within acceptable latency thresholds for production use
- Index design MUST support efficient access patterns without full table scans

#### NFR2: Scalability
- The system MUST scale to handle large numbers of resources and relationships
- Single Table Design MUST minimize table proliferation

#### NFR3: Data Integrity
- URN format MUST be strictly validated
- Relationship integrity MUST be maintained (no orphaned relationships)
- Uniqueness constraints MUST be enforced at the data layer

#### NFR4: Schema Evolution
- The system MUST support schema versioning to enable backward-compatible changes
- Data migration strategies MUST be documented

## 4. Data Model

### 4.1 URN Format
ProcessProof uses the following URN format for resource identification:

```
urn:{domain}:{resourceType}::{resourceId}
```

Example: `urn:processproof:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505`

### 4.2 Record Types

The system supports four primary record types:

1. **Resource**: Primary entities in the system
2. **ParentChildRelationship**: Hierarchical relationships with cascading behaviors
3. **CollectionMembershipRelationship**: Collection membership with optional authorization
4. **UniqueKeyValue**: Uniqueness constraint enforcement

For detailed schema specifications, see `specs/SCHEMA.md`.

### 4.3 Indexes

The system requires the following indexes:

1. **Default Index (Primary Key)**: Direct resource and relationship lookups
2. **InvertedIndex (GSI1)**: Reverse lookups and bidirectional queries
3. **ResourcesByAccountIndex (GSI2)**: Account-scoped resource queries (sparse index)

For detailed index specifications, see `specs/SCHEMA.md`.

## 5. Design Principles

1. **Single Table Design**: All record types stored in a single DynamoDB table to minimize operational complexity
2. **URN-based Identification**: Resources identified using ProcessProof URNs for global uniqueness
3. **Time-ordered IDs**: Resource IDs use UUID v7 for time-based sorting and chronological ordering
4. **Schema Versioning**: `_schemaVersion` field enables evolution of data contracts over time
5. **Account Scoping**: Account-level resources include `_accountUrn` for efficient multi-tenant queries
6. **Relationship Types**: Distinct relationship types (ParentChild and CollectionMember) with different behaviors

## 6. Usage Examples

The following examples demonstrate how to leverage this library to create resources and relationships for a typical system hierarchy. These examples show the foundational patterns that can be applied to any entity type.

### 6.1 Creating System Resources

#### Example: System.Account Resource
```typescript
import { createResource } from '@processproof/dynamodb-relational-store';

// Create a System.Account resource
const account = createResource({
  resourceType: 'System.Account',
  schemaVersion: 1,
  attributes: {
    name: 'Acme Corporation',
    email: 'contact@acme.com'
  }
});

// Result: ResourceRecord with URN like 'urn:processproof:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505'
```

#### Example: System.Account.JobCollection Resource
```typescript
// Create a JobCollection resource, scoped to the account
const jobCollection = createResource({
  resourceType: 'System.Account.JobCollection',
  schemaVersion: 1,
  accountUrn: account.urn, // Link to parent account
  attributes: {
    name: 'Engineering Jobs',
    description: 'All engineering job postings'
  }
});

// Result: ResourceRecord with URN like 'urn:processproof:System.Account.JobCollection::01955557-3cd2-7df2-b839-693fa6fbd506'
```

### 6.2 Creating Parent-Child Relationships

#### Example: Account to JobCollection Relationship
```typescript
import { createParentChildRelationship } from '@processproof/dynamodb-relational-store';

// Create a parent-child relationship between Account and JobCollection
const accountToCollection = createParentChildRelationship({
  parentUrn: account.urn,
  childUrn: jobCollection.urn,
  accountUrn: account.urn // Optional: for account-scoped queries
});

// This relationship enables:
// - Cascading DELETE: Deleting the account will cascade to delete the job collection
// - Cascading authorization: Permissions on the account apply to the job collection
```

### 6.3 Creating Collection Members

#### Example: System.Account.JobCollection.Job Resource
```typescript
// Create a Job resource within the collection
const job = createResource({
  resourceType: 'System.Account.JobCollection.Job',
  schemaVersion: 1,
  accountUrn: account.urn, // Account-scoped resource
  attributes: {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    status: 'open'
  }
});

// Result: ResourceRecord with URN like 'urn:processproof:System.Account.JobCollection.Job::01955558-3cd2-7df2-b839-693fa6fbd507'
```

### 6.4 Creating Collection-Membership Relationships

#### Example: Job to JobCollection Membership
```typescript
import { createCollectionMembershipRelationship } from '@processproof/dynamodb-relational-store';

// Create a collection-membership relationship
const jobMembership = createCollectionMembershipRelationship({
  collectionUrn: jobCollection.urn,
  memberUrn: job.urn,
  accountUrn: account.urn // Required for collection-membership relationships
});

// This relationship enables:
// - No cascading delete: Removing the job from the collection doesn't delete the job
// - Optional authorization conveyance: Collection permissions may apply to members
// - Many-to-many: A job can belong to multiple collections, a collection can have many jobs
```

### 6.5 Complete Example: Building a Resource Hierarchy

```typescript
import {
  createResource,
  createParentChildRelationship,
  createCollectionMembershipRelationship
} from '@processproof/dynamodb-relational-store';

// Step 1: Create the account
const account = createResource({
  resourceType: 'System.Account',
  schemaVersion: 1,
  attributes: { name: 'Acme Corporation' }
});

// Step 2: Create a job collection
const jobCollection = createResource({
  resourceType: 'System.Account.JobCollection',
  schemaVersion: 1,
  accountUrn: account.urn,
  attributes: { name: 'Engineering Jobs' }
});

// Step 3: Link account to job collection (parent-child)
const accountCollectionLink = createParentChildRelationship({
  parentUrn: account.urn,
  childUrn: jobCollection.urn,
  accountUrn: account.urn
});

// Step 4: Create a job
const job = createResource({
  resourceType: 'System.Account.JobCollection.Job',
  schemaVersion: 1,
  accountUrn: account.urn,
  attributes: {
    title: 'Senior Software Engineer',
    status: 'open'
  }
});

// Step 5: Add job to collection (collection-membership)
const jobInCollection = createCollectionMembershipRelationship({
  collectionUrn: jobCollection.urn,
  memberUrn: job.urn,
  accountUrn: account.urn
});

// Result: A complete hierarchy:
// - Account (root resource)
//   └─ JobCollection (child of Account via ParentChildRelationship)
//      └─ Job (member of JobCollection via CollectionMembershipRelationship)
```

## 7. Implementation Requirements

### 7.1 Data Format Standards
- All timestamps MUST be in ISO-8601 format
- Resource IDs MUST use UUID v7 format
- URNs MUST follow the ProcessProof URN format specification

### 7.2 Index Requirements
- Sparse index (ResourcesByAccountIndex) MUST only include records with `_accountUrn` populated
- InvertedIndex MUST enable efficient reverse lookups
- All indexes MUST support the required query patterns

### 7.3 Relationship Management
- Parent-child relationships MUST support cascading operations
- Collection-membership relationships MUST support optional authorization conveyance
- Relationship integrity MUST be maintained (no dangling references)

## 8. Success Criteria

### 8.1 Functional Success
- All record types can be created, read, updated, and deleted
- All relationship types function correctly with their specified behaviors
- Uniqueness constraints are enforced and validated
- All query patterns perform efficiently

### 8.2 Performance Success
- Query latencies meet production requirements
- System scales to handle expected data volumes
- Index utilization is optimized for access patterns

### 8.3 Quality Success
- Schema documentation is complete and accurate
- Data integrity is maintained across all operations
- System supports schema evolution without data loss

## 9. Dependencies

- DynamoDB table with appropriate capacity and indexes
- URN format specification and validation logic
- UUID v7 generation library
- ISO-8601 timestamp formatting utilities

## 10. Open Questions / Future Considerations

- Migration strategy for existing data (if applicable)
- Backup and disaster recovery procedures
- Monitoring and alerting requirements
- Performance benchmarking targets
- Cost optimization strategies

## 11. References

- **Architecture**: [Miro Board](https://miro.com/app/board/uXjVL1NjtXA=/?moveToWidget=3458764611188234472&cot=14)
- **System Entity Relationship Model**: [Miro Board](https://miro.com/app/board/uXjVM5NkHXg=/)
- **System and Security Entity Types**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1852014596/System+Security+Schema)
- **Data Store Invariants**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1935736841/Data+Store+Invariants)

