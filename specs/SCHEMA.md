# Product Requirements Document: DynamoDB Relational Store

## Overview

This DynamoDB table serves as the system-of-record for all System data entities and relationships between those entities. The design follows Single Table Design principles to efficiently store relational data in a NoSQL environment.

**Note:** Security grants are stored in a separate table and are not part of this specification.

## References

- **Architecture**: [Miro Board](https://miro.com/app/board/uXjVL1NjtXA=/?moveToWidget=3458764611188234472&cot=14)
- **System Entity Relationship Model**: [Miro Board](https://miro.com/app/board/uXjVM5NkHXg=/)
- **System and Security Entity Types**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1852014596/System+Security+Schema)
- **Data Store Invariants**: [Confluence Page](https://jamesearlywine.atlassian.net/wiki/spaces/ProcessPro/pages/1935736841/Data+Store+Invariants)

## URN Format

ProcessProof uses the following URN format for resource identification:

```
urn:{domain}:{resourceType}::{resourceId}
```

Example: `urn:pp:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505`

## Record Types

The data store supports four primary record types:

### 1. Resource
- **PK**: `Resource#{urn}`
- **SK**: `Resource#{urn}`
- Represents a primary entity in the system

### 2. ParentChildRelationship
- **PK**: `Parent#{urn}`
- **SK**: `Child#{urn}`
- Represents hierarchical parent-child relationships
- **Characteristics**:
  - Cascading DELETE: Deleting a parent resource includes deleting child resources
  - Cascading authorization: Permission grants to a parent resource apply to child resources
  - Cardinality: 1:n (one parent to many children)

### 3. CollectionMembershipRelationship
- **PK**: `Collection#{urn}`
- **SK**: `Member#{urn}`
- Represents membership relationships in collections
- **Characteristics**:
  - No cascading delete
  - Optional authorization conveyance
  - Cardinality: n:n (many-to-many)

### 4. UniqueKeyValue
- **PK**: `UniqueKeyValue#{_resourceType}#{property}#{value}`
- **SK**: `UniqueKeyValue#{_resourceType}#{property}`
- General-purpose record for enforcing uniqueness constraints

## Indexes

### Default Index (Table Primary Key)
- **PK**: `{RecordType}#{urn}`
- **SK**: `{RecordType}#{urn}`

### InvertedIndex (GSI1)
- **GSI1PK**: `SK` (from primary index)
- **GSI1SK**: `PK` (from primary index)
- Enables reverse lookups and bidirectional queries

### ResourcesByAccountIndex (GSI2 - Sparse Index)
- **GSI2PK**: `_accountUrn`
- **GSI2SK**: `urn`
- Enables efficient querying of all resources belonging to a specific Account

## Record Schemas

### Base Resource Record

| Key | Value | Note |
|-----|-------|------|
| PK | `Resource#Urn` | Primary key |
| SK | `Resource#Urn` | Sort key |
| `_recordType` | `Resource` | Record type identifier |
| `_resourceType` | Example: `System.Account.JobCollection.Job` | Resource type classification |
| `_id` | Example: `01955556-3cd2-7df2-b839-693fa6fbd505` | UUID v7 for time-sorting |
| `urn` | Example: `urn:pp:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505` | Format: `urn:pp:{ResourceType}::{ID}` |
| `_schemaVersion` | Number | For service-layer mapping of entities as data contracts change over time |
| `_createdAt` | ISO-8601 timestamp | Creation timestamp |
| `_updatedAt` | ISO-8601 timestamp | Last update timestamp |
| `_accountUrn` | URN | Every Account-level resource has an accountUrn (required for AccountResources index) |

**Note:** Resources have URNs; Relationships do not have URNs.

### Parent Child Relationship Record

| Key | Value | Note |
|-----|-------|------|
| PK | `Parent#{urn}` | Primary key |
| SK | `Child#{urn}` | Sort key |
| `_recordType` | `ParentChildRelationship` | Record type identifier |
| `parentUrn` | Example: `urn:pp:System::c04b27bf-7604-48a5-9e67-298c67cd70ab` | Parent resource URN |
| `childUrn` | Example: `urn:pp:System.Account::0195ff0e-e2e7-7408-8379-52f6cf939e7b` | Child resource URN |
| `_createdAt` | ISO-8601 timestamp | Creation timestamp |
| `_accountUrn` | URN (optional) | Every Account-level resource has an accountUrn (re: AccountResources index) |

**Characteristics:**
- Cascading DELETE: Deleting a parent resource includes deleting child resources
- Cascading authorization: Permission grants to a parent resource apply to child resources
- Cardinality: 1:n (one parent to many children)

### Collection Member Relationship Record

| Key | Value | Note |
|-----|-------|------|
| PK | `Collection#{urn}` | Primary key |
| SK | `Member#{urn}` | Sort key |
| `_recordType` | `CollectionMemberRelationship` | Record type identifier |
| `collectionUrn` | Example: `urn:pp:System::c04b27bf-7604-48a5-9e67-298c67cd70ab` | Collection resource URN |
| `memberUrn` | Example: `urn:pp:System.Account::0195ff0e-e2e7-7408-8379-52f6cf939e7b` | Member resource URN |
| `_createdAt` | ISO-8601 timestamp | Creation timestamp |
| `_accountUrn` | URN | Every Account-level resource has an accountUrn (re: AccountResources index) |

**Characteristics:**
- No cascading delete
- Optional authorization conveyance
- Cardinality: n:n (many-to-many)

### Unique KeyValue Record

| Key | Value | Note |
|-----|-------|------|
| PK | `UniqueKeyValue#{_resourceType}#{key}#{value}` | Primary key |
| SK | `UniqueKeyValue#{_resourceType}#{key}` | Sort key |
| `_recordType` | `UniqueKeyValue` | Record type identifier |
| `_resourceType` | Example: `System.User` | Resource type for which uniqueness is enforced |
| `key` | Example: `emailAddress` | Property name |
| `value` | Example: `someone@somewhere.com` | Unique value |
| `associatedRecordUrn` | Example: `urn:pp:System.User::123-abc-890-xyz` | URN of the record where the unique value exists (optional) |
| `_createdAt` | ISO-8601 timestamp | Creation timestamp |
| `_updatedAt` | ISO-8601 timestamp | Last update timestamp |

## Design Principles

1. **Single Table Design**: All record types are stored in a single DynamoDB table
2. **URN-based Identification**: Resources are identified using ProcessProof URNs
3. **Time-ordered IDs**: Resource IDs use UUID v7 for time-based sorting
4. **Schema Versioning**: `_schemaVersion` field enables evolution of data contracts
5. **Account Scoping**: Account-level resources include `_accountUrn` for efficient account-based queries
6. **Relationship Types**: Two distinct relationship types (ParentChild and CollectionMember) with different behaviors

## Implementation Considerations

- All timestamps should be in ISO-8601 format
- UUID v7 should be used for resource IDs to enable time-based sorting
- The sparse index (ResourcesByAccountIndex) only includes records with `_accountUrn` populated
- UniqueKeyValue records enable application-level uniqueness constraints
- The InvertedIndex enables reverse lookups (e.g., finding all parents of a child)

## Security

Security grants are handled in a separate table and are not part of this specification. Refer to the System and Security Entity Types documentation for security-related schema details.

