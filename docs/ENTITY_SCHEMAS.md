# ProcessProof Entity Relationship Diagram

**Source**: [Miro Board - System Entity Relationship Model](https://miro.com/app/board/uXjVM5NkHXg=/)
**Version**: MVP v0.1
**Last Updated**: Based on ProcessProof - Data Domain - MVP v0.1

## Overview

This Entity Relationship Diagram represents the ProcessProof data domain model, focusing on an Entity Authorization Model. The diagram defines the base structure and properties for data entities within the system, using Entity-Relationship Diagram (ERD) conventions.

### Core Principles

- **ResourceBase Entity**: Core data entity with primary key (PK, SK) and universal properties
- **Universal Properties**: `_id`, `_type`, `_schemaVersion`, `_created`, `_updated`, and `urn` fields
- **Identifier Standard**: UUID version 7 for unique identifiers
- **Timestamp Format**: ISO-8601 standard for all date/time values
- **Account Association**: All major records require an `accountId` attribute
- **Type System**: All entities include a `type` field with namespace `processproof:` followed by entity name

## Base Entity Structure

### ResourceBase

All entities inherit from ResourceBase, which includes:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string_uuid | Primary key (UUID v7) |
| `_resourceType` | string | Entity type with `processproof:` namespace |
| `_schemaVersion` | number | Schema version for data contract evolution |
| `_created` | string_iso8601 | Creation timestamp (optional) |
| `_updated` | string_iso8601 | Last update timestamp (optional) |
| `urn` | string | Uniform Resource Name identifier |
| `accountId` | string_uuid | Account association (required for account-scoped entities) |

## Entity Domains

### 1. System Domain

#### System
Core system entity containing basic system information.

| Field | Type | Description |
|-------|------|-------------|
| `_urn` | string | Primary Key |
| `name` | string | System name |
| `description` | string | System description |
| `_type` | string | `processproof:System` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |
| `_id` | string_uuid | UUID identifier |

**Relationships**:
- One-to-Many → SystemDocumentTemplate

#### SystemDocumentTemplate
Document template management entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `system_id` | string_uuid | Foreign Key → System |
| `templateName` | string | Unique template name (UQ) |
| `storageLocation` | string | Storage location |
| `storageType` | string | Storage type |
| `webLocation` | string | Web location URL |
| `filepath` | string | File path |
| `fileExtension` | string | File extension |
| `fileName` | string | File name |
| `mimeType` | string | MIME type (e.g., "application/pdf") |
| `documentTemplateFileHash` | string | File hash |
| `documentTemplateFileUploadedAt` | string_iso8601 | Upload timestamp |
| `documentSecuredHash` | string | Security hash |
| `documentType` | string | Document type |
| `templateKeyDescriptions` | string_json | Template key descriptions (JSON) |
| `sampleGeneratedDocumentUrl` | string | Sample document URL |
| `sampleDocumentData` | string | Sample document data |
| `_type` | string | `processproof:SystemDocumentTemplate` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← System
- Many-to-One ← DocumentTypes

#### DocumentTypes
Reference entity for document type definitions.

| Field | Type | Description |
|-------|------|-------------|
| `urn` | string | Primary Key |
| `name` | string | Document type name (UQ) |
| `description` | string | Description |
| `_type` | string | `processproof:DocumentTypes` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Example Values**: "Affidavit"

**Relationships**:
- One-to-Many → SystemDocumentTemplate

### 2. User Domain

#### System.User
Core user entity with extensive profile information.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `username` | string | Username (UQ) |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `middleName` | string? | Middle name (optional) |
| `dateOfBirth` | string_iso8601 | Date of birth |
| `ssn` | string? | Social Security Number (optional) |
| `height` | number? | Height (optional) |
| `weight` | number? | Weight (optional) |
| `eyeColor` | string | Eye color (enum) |
| `eyeColorOtherDescription` | string? | Other eye color description |
| `hairColor` | string | Hair color (enum) |
| `hairOtherDescription` | string? | Other hair color description |
| `ethnicity` | string | Ethnicity (enum) |
| `ethnicityOtherDescription` | string? | Other ethnicity description |
| `gender` | string | Gender (enum) |
| `genderOtherDescription` | string? | Other gender description |
| `accountId` | string_uuid | Account association |
| `_type` | string | `processproof:System.User` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- One-to-Many → UserPhone
- One-to-Many → UserEmail
- One-to-Many → UserPhysicalAddress
- One-to-Many → UserSignature
- One-to-One → UserSignaturePreferences
- One-to-One → UserDisplayPreferences

**Business Rules**:
- No two users can share the same primary email address or primary phone number
- If a user verifies ownership of an email/phone, it must be removed from any other user who had it
- Users must be prompted at login to verify new email or phone numbers after such transfers
- Email and Phone tables use sanitized values as natural keys (no surrogate URNs)
- Authorization grants are issued at the System.User level

#### UserPhone
Phone contact information for users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `phone` | string | Phone number (sanitized, natural key) |
| `type` | string | Phone type: "mobile", "fax", "office", "home", "other" |
| `isPrimary` | boolean | Primary phone flag |
| `isVerified` | boolean | Verification status |
| `note` | string? | Optional note |
| `_type` | string | `processproof:UserPhone` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### UserEmail
Email addresses for users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `email` | string | Email address (sanitized, natural key) |
| `isPrimary` | boolean | Primary email flag |
| `isVerified` | boolean | Verification status |
| `emailArray` | string[]? | Additional email addresses (optional) |
| `_type` | string | `processproof:UserEmail` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### UserPhysicalAddress
Physical mailing addresses for users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `line1` | string | Address line 1 |
| `line2` | string? | Address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `country` | string | Country |
| `isPrimary` | boolean | Primary address flag |
| `isVerified` | boolean | Verification status |
| `_type` | string | `processproof:UserPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### UserSignature
Digital signature records for users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `publicKey` | string | Public key |
| `privateKey` | string? | Private key (optional) |
| `cypherAlgorithm` | string | Cryptographic algorithm |
| `signatureType` | string | Type: "typed", "written", "uploaded" |
| `printedName` | string | Printed name |
| `_type` | string | `processproof:UserSignature` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- One-to-One → UserSignatureImage

#### UserSignatureImage
Stored signature image files.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `userSignature_id` | string_uuid | Foreign Key → UserSignature |
| `fileType` | string | File type |
| `mimeType` | string | MIME type |
| `storageLocation` | string | Storage location |
| `documentHash` | string | Document hash |
| `uploadedAt` | string_iso8601 | Upload timestamp |
| `_type` | string | `processproof:UserSignatureImage` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### UserSignaturePreferences
User preferences for affidavit signatures.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `signatureFormat` | string | Format: "short", "long", "printed" |
| `timezone` | string | Timezone preference |
| `defaultTemplateId` | string_uuid? | Default template ID (optional) |
| `_type` | string | `processproof:UserSignaturePreferences` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### UserDisplayPreferences
UI preferences for users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `user_id` | string_uuid | Foreign Key → System.User |
| `timezone` | string | Timezone preference |
| `listDisplayState` | string | Display state: "collapsed", "expanded" |
| `_type` | string | `processproof:UserDisplayPreferences` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

### 3. Account Domain

#### Account
Core account entity containing account information.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `name` | string | Account name (UQ) |
| `account_owner_id` | string_uuid | Account owner user ID |
| `owner_account_id` | string_uuid? | Owner account ID (optional) |
| `type` | string | Account type identifier |
| `_type` | string | `processproof:Account` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- One-to-Many → Court
- One-to-Many → AccountAffidavitTemplate
- One-to-Many → AccountDocumentPreferences
- One-to-Many → ClientCollection
- One-to-Many → Job
- One-to-Many → JobCollection

#### Court
Court information entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `account_id` | string_uuid | Foreign Key → Account |
| `court_id` | string | Court identifier |
| `name` | string | Court name |
| `county` | string | County |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `note` | string? | Optional notes |
| `_type` | string | `processproof:Court` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Account
- One-to-Many → CourtPhysicalAddress
- One-to-Many → CourtPhone
- One-to-Many → CourtEmail
- One-to-Many → CourtNote

#### CourtPhysicalAddress
Physical address details for courts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `court_id` | string_uuid | Foreign Key → Court |
| `line1` | string | Address line 1 |
| `line2` | string? | Address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `_type` | string | `processproof:CourtPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### CourtPhone
Phone contact information for courts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `court_id` | string_uuid | Foreign Key → Court |
| `phone` | string | Phone number |
| `type` | string | Phone type |
| `extension` | string? | Extension (optional) |
| `_type` | string | `processproof:CourtPhone` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### CourtEmail
Email addresses for courts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `court_id` | string_uuid | Foreign Key → Court |
| `email` | string | Email address |
| `_type` | string | `processproof:CourtEmail` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### CourtNote
User-generated notes about courts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `court_id` | string_uuid | Foreign Key → Court |
| `user_id` | string_uuid | User who created the note |
| `title` | string | Note title |
| `content` | string | Note content |
| `_type` | string | `processproof:CourtNote` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### AccountAffidavitTemplate
Account-level affidavit templates.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `account_id` | string_uuid | Foreign Key → Account |
| `templateName` | string | Template name |
| `storageLocation` | string | Storage location |
| `fileMetadata` | string_json | File metadata (JSON) |
| `_type` | string | `processproof:AccountAffidavitTemplate` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Account
- One-to-Many → AccountAffidavitTemplateDocument
- One-to-Many → AccountAffidavitTemplateMap

#### AccountAffidavitTemplateDocument
Generated documents from templates.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `accountAffidavitTemplate_id` | string_uuid | Foreign Key → AccountAffidavitTemplate |
| `storageLocation` | string | Storage location |
| `fileMetadata` | string_json | File metadata (JSON) |
| `_type` | string | `processproof:AccountAffidavitTemplateDocument` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### AccountAffidavitTemplateMap
JSON mapping definitions for templates.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `accountAffidavitTemplate_id` | string_uuid | Foreign Key → AccountAffidavitTemplate |
| `mappingDefinition` | string_json | Mapping definition (JSON) |
| `_type` | string | `processproof:AccountAffidavitTemplateMap` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### AccountDocumentPreferences
User preferences for document generation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `account_id` | string_uuid | Foreign Key → Account |
| `signatureFormat` | string | Signature format: "short", "long", "printed" |
| `defaultTemplateId` | string_uuid? | Default template ID (optional) |
| `timezone` | string | Timezone preference |
| `publicKey` | string? | Public key (optional) |
| `_type` | string | `processproof:AccountDocumentPreferences` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

### 4. Client Domain (Clientelle)

#### ClientCollection
Top-level container for organizing clients under an account.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `account_id` | string_uuid | Foreign Key → Account |
| `name` | string | Collection name |
| `description` | string? | Description (optional) |
| `_type` | string | `processproof:ClientCollection` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Account
- One-to-Many → Client

#### Client
Main entity representing a client organization.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `clientCollection_id` | string_uuid | Foreign Key → ClientCollection |
| `account_id` | string_uuid | Foreign Key → Account |
| `name` | string | Client name |
| `website` | string? | Website URL (optional) |
| `primaryContact_id` | string_uuid? | Primary contact reference (optional) |
| `_type` | string | `processproof:Client` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← ClientCollection
- One-to-Many → ClientContact
- One-to-Many → ClientEmail
- One-to-Many → ClientPhone
- One-to-Many → ClientPhysicalAddress
- One-to-Many → ClientNote
- One-to-Many → Job

#### ClientContact
Individuals associated with a client.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `client_id` | string_uuid | Foreign Key → Client |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `title` | string? | Job title (optional) |
| `licenseExpiration` | string_iso8601? | Process server license expiration (optional) |
| `isPrimary` | boolean | Primary contact flag |
| `_type` | string | `processproof:ClientContact` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Client
- One-to-Many → ClientContactEmail
- One-to-Many → ClientContactPhone
- One-to-Many → ClientContactNote

#### ClientEmail
Email addresses for clients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `client_id` | string_uuid | Foreign Key → Client |
| `email` | string | Email address |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ClientEmail` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientPhone
Phone numbers for clients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `client_id` | string_uuid | Foreign Key → Client |
| `phone` | string | Phone number |
| `type` | string | Phone type: "mobile", "fax", "office", "home", "other" |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ClientPhone` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientPhysicalAddress
Physical location data for clients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `client_id` | string_uuid | Foreign Key → Client |
| `line1` | string | Street address line 1 |
| `line2` | string? | Street address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `_type` | string | `processproof:ClientPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientNote
Text notes associated with clients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `client_id` | string_uuid | Foreign Key → Client |
| `content` | string | Note content |
| `_type` | string | `processproof:ClientNote` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientContactEmail
Email addresses for individual contacts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `clientContact_id` | string_uuid | Foreign Key → ClientContact |
| `email` | string | Email address |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ClientContactEmail` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientContactPhone
Phone numbers for individual contacts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `clientContact_id` | string_uuid | Foreign Key → ClientContact |
| `phone` | string | Phone number |
| `type` | string | Phone type: "mobile", "fax", "office", "home", "other" |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ClientContactPhone` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ClientContactNote
Text notes for individual contacts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `clientContact_id` | string_uuid | Foreign Key → ClientContact |
| `content` | string | Note content |
| `_type` | string | `processproof:ClientContactNote` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

### 5. Jobs Domain

#### JobCollection
Top-level container for organizing jobs by account.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `account_id` | string_uuid | Foreign Key → Account |
| `name` | string | Collection name |
| `description` | string? | Description (optional) |
| `_type` | string | `processproof:JobCollection` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Account
- One-to-Many → Job

#### Job
Core entity representing individual service jobs.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `jobCollection_id` | string_uuid | Foreign Key → JobCollection |
| `account_id` | string_uuid | Foreign Key → Account |
| `client_id` | string_uuid? | Client reference (optional) |
| `status` | string | Job status (enum) |
| `serviceType` | string? | Service type (optional) |
| `instructions` | string? | Service instructions (optional) |
| `meta_datasource` | string? | Data source metadata (optional, e.g., "servemanager") |
| `_type` | string | `processproof:Job` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← JobCollection
- One-to-Many → ServiceRecipient
- One-to-Many → ServiceDocument
- One-to-Many → ServiceSupportingDocument
- One-to-Many → JobCourtCase
- One-to-Many → JobCourt
- One-to-Many → JobAffidavit

**Open Questions**:
- What ServiceTypes are there?
- What ServiceDocumentTypes are there?

#### ServiceRecipient
Detailed person records for service recipients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `middleName` | string? | Middle name (optional) |
| `height` | number? | Height (optional) |
| `weight` | number? | Weight (optional) |
| `eyeColor` | string | Eye color (enum, with "Other" option) |
| `eyeColorOtherDescription` | string? | Other eye color description |
| `hairColor` | string | Hair color (enum, with "Other" option) |
| `hairColorOtherDescription` | string? | Other hair color description |
| `build` | string | Build description (enum, with "Other" option) |
| `buildOtherDescription` | string? | Other build description |
| `ethnicity` | string | Ethnicity (enum, with "Other" option) |
| `ethnicityOtherDescription` | string? | Other ethnicity description |
| `gender` | string | Gender (enum, with "Other" option) |
| `genderOtherDescription` | string? | Other gender description |
| `_type` | string | `processproof:ServiceRecipient` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Job
- One-to-Many → ServiceRecipientPhone
- One-to-Many → ServiceRecipientEmail
- One-to-Many → ServiceRecipientPhysicalAddress
- One-to-Many → ServiceRecipientNote
- One-to-Many → ServiceRecipientAssociate

#### ServiceRecipientPhone
Phone numbers for service recipients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `servicerecipient_id` | string_uuid | Foreign Key → ServiceRecipient |
| `phone` | string | Phone number |
| `type` | string | Phone type |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ServiceRecipientPhone` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceRecipientEmail
Email addresses for service recipients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `servicerecipient_id` | string_uuid | Foreign Key → ServiceRecipient |
| `email` | string | Email address |
| `note` | string? | Optional note |
| `_type` | string | `processproof:ServiceRecipientEmail` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceRecipientPhysicalAddress
Physical addresses for service recipients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `servicerecipient_id` | string_uuid | Foreign Key → ServiceRecipient |
| `line1` | string | Address line 1 |
| `line2` | string? | Address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `_type` | string | `processproof:ServiceRecipientPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceRecipientNote
Note-taking functionality for service recipients.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `servicerecipient_id` | string_uuid | Foreign Key → ServiceRecipient |
| `content` | string | Note content |
| `_type` | string | `processproof:ServiceRecipientNote` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceRecipientAssociate
Relationship tracking between service recipients and their associates.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `servicerecipient_id` | string_uuid | Foreign Key → ServiceRecipient |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `relationship` | string | Relationship type |
| `contact_id` | string_uuid? | Contact reference (optional) |
| `_type` | string | `processproof:ServiceRecipientAssociate` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- One-to-Many → ServiceRecipientContactPhysicalAddress

#### ServiceRecipientContactPhysicalAddress
Additional address records for service recipient contacts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `serviceRecipientAssociate_id` | string_uuid | Foreign Key → ServiceRecipientAssociate |
| `line1` | string | Address line 1 |
| `line2` | string? | Address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `_type` | string | `processproof:ServiceRecipientContactPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceDocument
File management entity for service documents.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `documentType` | string | Document type (enum) |
| `fileName` | string | File name |
| `fileExtension` | string | File extension |
| `mimeType` | string | MIME type |
| `storageLocation` | string | Storage location |
| `storageType` | string | Storage type |
| `webUrl` | string? | Web URL (optional) |
| `documentSecuredHash` | string | Document security hash |
| `uploadedAt` | string_iso8601 | Upload timestamp |
| `_type` | string | `processproof:ServiceDocument` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceSupportingDocument
Supporting documents for service attempts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `fileName` | string | File name |
| `fileExtension` | string | File extension |
| `mimeType` | string | MIME type |
| `storageLocation` | string | Storage location |
| `storageType` | string | Storage type |
| `webUrl` | string? | Web URL (optional) |
| `documentSecuredHash` | string | Document security hash |
| `uploadedAt` | string_iso8601 | Upload timestamp |
| `_type` | string | `processproof:ServiceSupportingDocument` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### JobCourtCase
Legal case information for jobs.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `court_id` | string_uuid? | Court reference (optional) |
| `caseNumber` | string | Case number |
| `plaintiff` | string? | Plaintiff (optional) |
| `defendant` | string? | Defendant (optional) |
| `courtDate` | string_iso8601? | Court date (optional) |
| `_type` | string | `processproof:JobCourtCase` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Job
- Many-to-One ← Court (optional)

#### JobCourt
Court information for jobs.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `court_id` | string_uuid | Foreign Key → Court |
| `_type` | string | `processproof:JobCourt` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

### 6. Service Attempts Domain

#### ServiceAttempt
Main entity tracking service delivery attempts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `user_id` | string_uuid | Foreign Key → System.User |
| `account_id` | string_uuid | Foreign Key → Account |
| `client_id` | string_uuid? | Client reference (optional) |
| `status` | string | Status code (enum): "Authorized", "Business", "Personal/Individual", "Bad Address", "Non-Service", "Unsuccessful Attempt" |
| `contactMethod` | string? | Contact method (optional) |
| `phone` | string? | Phone contact (optional) |
| `email` | string? | Email contact (optional) |
| `emailNote` | string? | Email note (optional) |
| `contact_ids` | string_uuid[]? | Contact IDs array (optional) |
| `attemptedAt` | string_iso8601 | Attempt timestamp |
| `gpsstamp_id` | string_uuid? | GPS stamp reference (optional) |
| `serviceattemptphysicaladdress_id` | string_uuid? | Physical address reference (optional) |
| `_type` | string | `processproof:ServiceAttempt` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Job
- Many-to-One ← System.User
- One-to-One → GpsStamp
- One-to-One → ServiceAttemptPhysicalAddress
- One-to-Many → ServiceAttemptSupportingDocuments

#### GpsStamp
GPS location data entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `serviceAttempt_id` | string_uuid | Foreign Key → ServiceAttempt |
| `latitude` | number | Latitude coordinate |
| `longitude` | number | Longitude coordinate |
| `altitude` | number? | Altitude (optional) |
| `accuracy` | number? | Accuracy in meters (optional) |
| `heading` | number? | Heading in degrees (optional) |
| `speed` | number? | Speed (optional) |
| `deviceTimestamp` | string_iso8601 | Device timestamp |
| `gpsTimestamp` | string_iso8601 | GPS timestamp |
| `_type` | string | `processproof:GpsStamp` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceAttemptPhysicalAddress
Physical address information for service attempts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `serviceAttempt_id` | string_uuid | Foreign Key → ServiceAttempt |
| `line1` | string | Address line 1 |
| `line2` | string? | Address line 2 (optional) |
| `city` | string | City |
| `state` | string | State |
| `postalCode` | string | Postal code |
| `_type` | string | `processproof:ServiceAttemptPhysicalAddress` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### ServiceAttemptSupportingDocuments
Uploaded documents (photos, videos, other files) for service attempts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `serviceAttempt_id` | string_uuid | Foreign Key → ServiceAttempt |
| `fileName` | string | File name |
| `fileExtension` | string | File extension |
| `mimeType` | string | MIME type |
| `storageLocation` | string | Storage location |
| `storageType` | string | Storage type |
| `webUrl` | string? | Web URL (optional) |
| `documentSecuredHash` | string | Document security hash |
| `uploadedAt` | string_iso8601 | Upload timestamp |
| `_type` | string | `processproof:ServiceAttemptSupportingDocuments` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

### 7. Affidavits Domain

#### JobAffidavit
Main entity storing affidavit records.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `job_id` | string_uuid | Foreign Key → Job |
| `account_id` | string_uuid | Foreign Key → Account |
| `systemTemplate_id` | string_uuid? | System template reference (optional) |
| `accountTemplate_id` | string_uuid? | Account template reference (optional) |
| `userTemplate_id` | string_uuid? | User template reference (optional) |
| `emailList` | string[]? | Email list (optional) |
| `md5Digest` | string | MD5 digest |
| `generatedAt` | string_iso8601 | Generation timestamp |
| `generatedaffidavit_id` | string_uuid? | Generated affidavit reference (optional) |
| `_type` | string | `processproof:JobAffidavit` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

**Relationships**:
- Many-to-One ← Job
- One-to-Many → JobAffidavitSignature
- One-to-One → JobAffidavitDocument

#### JobAffidavitSignature
Digital signatures for affidavits.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `generatedaffidavit_id` | string_uuid | Foreign Key → JobAffidavit |
| `user_id` | string_uuid? | User reference (optional) |
| `hmacSignature` | string | HMAC signature |
| `publicKey` | string | Public key |
| `cypherAlgorithm` | string | Cryptographic algorithm |
| `signedAt` | string_iso8601 | Signature timestamp |
| `_type` | string | `processproof:JobAffidavitSignature` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

#### JobAffidavitDocument
Document-related information for affidavits.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string_uuid | Primary Key |
| `generatedaffidavit_id` | string_uuid | Foreign Key → JobAffidavit |
| `fileName` | string | File name |
| `fileExtension` | string | File extension |
| `mimeType` | string | MIME type |
| `storageLocation` | string | Storage location |
| `storageType` | string | Storage type |
| `webUrl` | string? | Web URL (optional) |
| `documentSecuredHash` | string | Document security hash |
| `_type` | string | `processproof:JobAffidavitDocument` |
| `_schemaVersion` | number | Schema version |
| `_created` | string_iso8601 | Creation timestamp |
| `_updated` | string_iso8601 | Update timestamp |

## Relationship Summary

### Cardinality Patterns

1. **One-to-Many (1:n)**:
   - Account → ClientCollection
   - Account → JobCollection
   - Account → Court
   - ClientCollection → Client
   - Client → ClientContact
   - JobCollection → Job
   - Job → ServiceRecipient
   - Job → ServiceDocument
   - Job → ServiceAttempt
   - Job → JobAffidavit
   - ServiceRecipient → ServiceRecipientPhone/Email/Address/Note
   - System.User → UserPhone/Email/Address/Signature

2. **Many-to-One (n:1)**:
   - Client → ClientCollection
   - Job → JobCollection
   - ServiceAttempt → Job
   - ServiceAttempt → System.User
   - JobAffidavit → Job

3. **One-to-One (1:1)**:
   - ServiceAttempt ↔ GpsStamp
   - ServiceAttempt ↔ ServiceAttemptPhysicalAddress
   - JobAffidavit ↔ JobAffidavitDocument
   - UserSignature ↔ UserSignatureImage
   - System.User ↔ UserSignaturePreferences
   - System.User ↔ UserDisplayPreferences

4. **Many-to-Many (n:n)**:
   - Job ↔ Court (via JobCourt)
   - System ↔ DocumentTypes (via SystemDocumentTemplate)

## Common Patterns

### Audit Fields
All entities include:
- `_created`: string_iso8601 (optional)
- `_updated`: string_iso8601 (optional)
- `_schemaVersion`: number

### Identification
- Primary keys: `id` (string_uuid) or `urn` (string)
- Type identifiers: `_type` field with `processproof:` namespace
- Foreign keys: `{entity}_id` pattern (e.g., `account_id`, `job_id`)

### Document Storage
Entities with file storage include:
- `storageLocation`: string
- `storageType`: string
- `webUrl` or `webLocation`: string (optional)
- `fileName`: string
- `fileExtension`: string
- `mimeType`: string
- `documentSecuredHash`: string
- `uploadedAt` or `documentTemplateFileUploadedAt`: string_iso8601

### Contact Information Pattern
Entities with contact info follow consistent patterns:
- Phone: `phone` (string), `type` (enum), optional `note`
- Email: `email` (string), optional `note`
- Address: `line1`, `line2?`, `city`, `state`, `postalCode`, optional `country`

## Notes

- Schema versioning is implemented through `_schemaVersion` property
- Created and updated timestamps are optional fields
- The URN (Uniform Resource Name) serves as a standardized identifier
- All entities share the same base structure for consistency
- The "urn" field uses string type for flexible resource naming
- Account-level data isolation is enforced through mandatory `accountId` attributes
- Status fields use enumerated string values with extensibility for custom values
- Optional fields are denoted with "?" suffix (e.g., `description?: string`)
- Nullable fields are explicitly marked in the schema
