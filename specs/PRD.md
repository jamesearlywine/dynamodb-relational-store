# Product Requirements Document: DynamoDB Relational Store

## 1. Executive Summary

The DynamoDB Relational Store is a system designed to store relational entities in a DynamoDB table using Single Table Design principles. This system serves as the system-of-record for all System data entities and relationships between those entities, enabling efficient storage and querying of hierarchical and collection-based relationships in a NoSQL environment.

## 2. Project Overview

### 2.1 Purpose
Store relational entities in a DynamoDB table using Single Table Design principles, providing a scalable and performant solution for managing system data entities and their relationships.

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

Example: `urn:pp:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505`

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

## 6. Implementation Requirements

### 6.1 Data Format Standards
- All timestamps MUST be in ISO-8601 format
- Resource IDs MUST use UUID v7 format
- URNs MUST follow the ProcessProof URN format specification

### 6.2 Index Requirements
- Sparse index (ResourcesByAccountIndex) MUST only include records with `_accountUrn` populated
- InvertedIndex MUST enable efficient reverse lookups
- All indexes MUST support the required query patterns

### 6.3 Relationship Management
- Parent-child relationships MUST support cascading operations
- Collection-membership relationships MUST support optional authorization conveyance
- Relationship integrity MUST be maintained (no dangling references)

## 7. Success Criteria

### 7.1 Functional Success
- All record types can be created, read, updated, and deleted
- All relationship types function correctly with their specified behaviors
- Uniqueness constraints are enforced and validated
- All query patterns perform efficiently

### 7.2 Performance Success
- Query latencies meet production requirements
- System scales to handle expected data volumes
- Index utilization is optimized for access patterns

### 7.3 Quality Success
- Schema documentation is complete and accurate
- Data integrity is maintained across all operations
- System supports schema evolution without data loss

## 8. Dependencies

- DynamoDB table with appropriate capacity and indexes
- URN format specification and validation logic
- UUID v7 generation library
- ISO-8601 timestamp formatting utilities

## 9. Open Questions / Future Considerations

- Migration strategy for existing data (if applicable)
- Backup and disaster recovery procedures
- Monitoring and alerting requirements
- Performance benchmarking targets
- Cost optimization strategies

## 10. References

- **Architecture**: [Miro Board](https://miro.com/app/board/uXjVL1NjtXA=/?moveToWidget=3458764611188234472&cot=14)
- **System Entity Relationship Model**: [Miro Board](https://miro.com/app/board/uXjVM5NkHXg=/)
- **System and Security Entity Types**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1852014596/System+Security+Schema)
- **Data Store Invariants**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1935736841/Data+Store+Invariants)

