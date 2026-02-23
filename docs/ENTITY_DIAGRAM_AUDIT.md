# Entity Diagram vs ENTITY_SCHEMAS.md — Property Audit

**Diagram**: `docs/cline/ENTITY_RELATIONSHIP_DIAGRAM.drawio`
**Schema**: `docs/ENTITY_SCHEMAS.md`
**Audit date**: Property-level comparison of each entity shape in the diagram against the schema.

**Update**: The drawio diagram was updated to match the schema (see changelog below).

---

## Summary

| Category | Count |
|---------|--------|
| Entities in diagram | 55 |
| Entities with mismatches | 24 |
| Missing in diagram (schema-only fields) | Noted per entity below |
| Extra in diagram (not in schema) | Noted per entity below |
| FK naming differences | Noted where diagram uses short names (e.g. tpl_id) |

**Conventions**: Diagram often abbreviates (e.g. `firstName/lastName`, `storage*/web*/file*`). Universal fields `_type`, `_schemaVersion`, `_created`, `_updated` are sometimes shown as `processproof:EntityName` or omitted. PK/FK rows are treated as representing `id` and the foreign key field; only **data** property differences are called out below.

---

## 1. System Domain

### System
- **Diagram**: PK: _urn (str); name/description: str; _type: processproof:System
- **Schema**: _urn, name, description, _type, _schemaVersion, _created, _updated, _id
- **Missing in diagram**: `_id`, `_schemaVersion`, `_created`, `_updated` (commonly omitted in diagram)
- **Status**: ✅ Core attributes present; universal timestamps/version omitted.

### DocumentTypes
- **Diagram**: PK: urn (str); name: str (UQ); description: str
- **Schema**: urn, name, description, _type, _schemaVersion, _created, _updated
- **Missing in diagram**: _type, _schemaVersion, _created, _updated
- **Status**: ✅ Core attributes match.

### SystemDocumentTemplate
- **Diagram**: PK: id (uuid); FK: system_id, docType → DocumentTypes; templateName (UQ); storage*/web*/file*: str; documentType: str; templateKeyDescriptions: json
- **Schema**: id, system_id, templateName, storageLocation, storageType, webLocation, filepath, fileExtension, fileName, mimeType, documentTemplateFileHash, documentTemplateFileUploadedAt, documentSecuredHash, documentType, templateKeyDescriptions, sampleGeneratedDocumentUrl, sampleDocumentData, _type, _schemaVersion, _created, _updated. Schema also has FK to DocumentTypes (docType).
- **Missing in diagram**: Explicit storageType, webLocation, filepath, fileExtension, fileName, mimeType, documentTemplateFileHash, documentTemplateFileUploadedAt, documentSecuredHash, sampleGeneratedDocumentUrl, sampleDocumentData (diagram uses shorthand "storage*/web*/file*").
- **Status**: ⚠️ Diagram uses shorthand; many file/hash fields not explicitly listed.

---

## 2. User Domain

### System.User
- **Diagram**: PK: id (uuid); username (UQ); firstName/lastName; dateOfBirth: iso8601; eye/hair/ethnicity/gender: str; accountId: uuid
- **Schema**: id, username, firstName, lastName, middleName?, dateOfBirth, ssn?, height?, weight?, eyeColor, eyeColorOtherDescription?, hairColor, hairOtherDescription?, ethnicity, ethnicityOtherDescription?, gender, genderOtherDescription?, accountId, _type, _schemaVersion, _created, _updated
- **Missing in diagram**: middleName, ssn, height, weight, eyeColorOtherDescription, hairOtherDescription, ethnicityOtherDescription, genderOtherDescription
- **Status**: ⚠️ Several optional and “Other” description fields not shown.

### UserPhone
- **Diagram**: PK: id; FK: user_id; phone/type: str; isPrimary: bool
- **Schema**: id, user_id, phone, type, isPrimary, isVerified, note?, _type, _schemaVersion, _created, _updated
- **Missing in diagram**: `isVerified`, `note`
- **Status**: ⚠️ isVerified and note not in diagram.

### UserEmail
- **Diagram**: PK: id; FK: user_id; email: str; isPrimary: bool
- **Schema**: id, user_id, email, isPrimary, isVerified, emailArray?
- **Missing in diagram**: `isVerified`, `emailArray`
- **Status**: ⚠️ isVerified and emailArray not in diagram.

### UserPhysicalAddress
- **Diagram**: PK: id; FK: user_id; line1/city/state: str; postalCode: str
- **Schema**: id, user_id, line1, line2?, city, state, postalCode, country, isPrimary, isVerified
- **Missing in diagram**: `line2`, `country`, `isPrimary`, `isVerified`
- **Status**: ⚠️ line2, country, isPrimary, isVerified not in diagram.

### UserSignature
- **Diagram**: PK: id; FK: user_id; publicKey: str; signatureType: str
- **Schema**: id, user_id, publicKey, privateKey?, cypherAlgorithm, signatureType, printedName
- **Missing in diagram**: `privateKey`, `cypherAlgorithm`, `printedName`
- **Status**: ⚠️ Three schema fields not in diagram.

### UserSignatureImage
- **Diagram**: PK: id; FK: sig_id; fileType: str; storageLocation: str
- **Schema**: id, userSignature_id, fileType, mimeType, storageLocation, documentHash, uploadedAt
- **Mismatch**: Diagram uses `FK: sig_id`; schema uses `userSignature_id`.
- **Missing in diagram**: `mimeType`, `documentHash`, `uploadedAt`
- **Status**: ⚠️ FK name differs; three attributes missing.

### UserSignaturePreferences
- **Diagram**: PK: id; FK: user_id; signatureFormat: str; timezone: str
- **Schema**: id, user_id, signatureFormat, timezone, defaultTemplateId?
- **Missing in diagram**: `defaultTemplateId`
- **Status**: ⚠️ defaultTemplateId not in diagram.

### UserDisplayPreferences
- **Diagram**: PK: id; FK: user_id; timezone: str; listDisplayState: str
- **Schema**: id, user_id, timezone, listDisplayState
- **Status**: ✅ Matches.

---

## 3. Account Domain

### Account
- **Diagram**: PK: id (uuid); FK: system_id; name (UQ); account_owner_id: uuid; type: str
- **Schema**: id, name, account_owner_id, owner_account_id?, type (no system_id)
- **Extra in diagram**: `FK: system_id` — not in ENTITY_SCHEMAS.md Account table.
- **Missing in diagram**: `owner_account_id`
- **Status**: ⚠️ Diagram has system_id; schema has owner_account_id; resolve which is correct.

### Court
- **Diagram**: PK: id; FK: account_id; court_id/name: str; county/state: str; postalCode: str
- **Schema**: id, account_id, court_id, name, county, state, postalCode, note?
- **Missing in diagram**: `note`
- **Status**: ⚠️ note not in diagram.

### CourtPhysicalAddress
- **Diagram**: PK: id; FK: court_id; line1/city/state: str; postalCode: str
- **Schema**: id, court_id, line1, line2?, city, state, postalCode
- **Missing in diagram**: `line2`
- **Status**: ⚠️ line2 not in diagram.

### CourtPhone
- **Diagram**: PK: id; FK: court_id; phone/type: str
- **Schema**: id, court_id, phone, type, extension?
- **Missing in diagram**: `extension`
- **Status**: ⚠️ extension not in diagram.

### CourtEmail
- **Diagram**: PK: id; FK: court_id; email: str
- **Schema**: id, court_id, email
- **Status**: ✅ Matches.

### CourtNote
- **Diagram**: PK: id; FK: court_id; title/content: str; user_id: uuid
- **Schema**: id, court_id, user_id, title, content
- **Status**: ✅ Matches.

### AccountAffidavitTemplate
- **Diagram**: PK: id; FK: account_id; templateName: str; storageLocation: str; fileMetadata: json
- **Schema**: id, account_id, templateName, storageLocation, fileMetadata
- **Status**: ✅ Matches.

### AccountAffidavitTemplateDocument
- **Diagram**: PK: id; FK: tpl_id; storageLocation: str; fileMetadata: json
- **Schema**: id, accountAffidavitTemplate_id, storageLocation, fileMetadata
- **Naming**: Diagram uses `tpl_id`; schema uses `accountAffidavitTemplate_id`.
- **Status**: ✅ Same relationship; FK name differs.

### AccountAffidavitTemplateMap
- **Diagram**: PK: id; FK: tpl_id; mappingDef: json
- **Schema**: id, accountAffidavitTemplate_id, mappingDefinition (not mappingDef)
- **Mismatch**: Schema field is `mappingDefinition`; diagram shows `mappingDef`.
- **Status**: ⚠️ Property name mismatch.

### AccountDocumentPreferences
- **Diagram**: PK: id; FK: account_id; signatureFormat: str; timezone: str; publicKey?: str
- **Schema**: id, account_id, signatureFormat, defaultTemplateId?, timezone, publicKey?
- **Missing in diagram**: `defaultTemplateId`
- **Status**: ⚠️ defaultTemplateId not in diagram.

---

## 4. Client Domain

### ClientCollection
- **Diagram**: PK: id; FK: account_id; name: str; description?: str
- **Schema**: id, account_id, name, description?
- **Status**: ✅ Matches.

### Client
- **Diagram**: PK: id; FK: coll_id, acct_id; name: str; website?: str; primaryContact_id?: uuid
- **Schema**: id, clientCollection_id, account_id, name, website?, primaryContact_id?
- **Naming**: Diagram uses coll_id/acct_id; schema uses clientCollection_id/account_id.
- **Status**: ✅ Same FKs; names abbreviated in diagram.

### ClientContact
- **Diagram**: PK: id; FK: client_id; firstName/lastName: str; title?: str; isPrimary: bool
- **Schema**: id, client_id, firstName, lastName, title?, licenseExpiration?, isPrimary
- **Missing in diagram**: `licenseExpiration`
- **Status**: ⚠️ licenseExpiration not in diagram.

### ClientEmail, ClientPhone, ClientPhysicalAddress, ClientNote
- **Diagram**: Standard PK/FK + key attributes (email/note, phone/type, line1/city/state/postalCode, content).
- **Schema**: Match; ClientPhysicalAddress has line2? not in diagram.
- **Status**: ⚠️ ClientPhysicalAddress line2? missing in diagram; others ✅.

### ClientContactEmail, ClientContactPhone, ClientContactNote
- **Diagram**: PK: id; FK: clientContact_id; email/note?, phone/type, content
- **Schema**: id, clientContact_id, plus email/note, phone/type, content
- **Status**: ✅ Match (diagram uses “email/note?” etc.).

---

## 5. Jobs Domain

### JobCollection
- **Diagram**: PK: id (uuid); FK: account_id; name: str; description?; _type: processproof:JobCollection; _schemaVersion: num
- **Schema**: id, account_id, name, description?, _type, _schemaVersion, _created, _updated
- **Status**: ✅ Core attributes present.

### Job
- **Diagram**: PK: id (uuid); FK: jobCollection_id, account_id, client_id?; status, serviceType?, instructions?, meta_datasource?; _type, _schemaVersion, _created/_updated
- **Schema**: id, jobCollection_id, account_id, client_id?, status, serviceType?, instructions?, meta_datasource?, _type, _schemaVersion, _created, _updated
- **Status**: ✅ Matches.

### ServiceRecipient
- **Diagram**: Full attribute set (firstName, lastName, middleName?, height?, weight?, eyeColor, eyeColorOtherDescription?, hairColor, hairColorOtherDescription?, build, buildOtherDescription?, ethnicity, ethnicityOtherDescription?, gender, genderOtherDescription?).
- **Schema**: Same set.
- **Status**: ✅ Matches.

### ServiceRecipientPhone, ServiceRecipientEmail, ServiceRecipientPhysicalAddress, ServiceRecipientNote
- **Diagram**: PK/FK + phone/type/note?, email/note?, line1/line2?/city/state/postalCode, content.
- **Schema**: Match.
- **Status**: ✅ Match.

### ServiceRecipientAssociate
- **Diagram**: PK: id; FK: servicerecipient_id; firstName, lastName, relationship: str; contact_id?: uuid
- **Schema**: id, servicerecipient_id, firstName, lastName, relationship, contact_id?
- **Status**: ✅ Matches.

### ServiceRecipientContactPhysicalAddress
- **Diagram**: PK: id; FK: serviceRecipientAssociate_id; line1, line2?, city, state, postalCode
- **Schema**: id, serviceRecipientAssociate_id, line1, line2?, city, state, postalCode
- **Status**: ✅ Matches.

### ServiceDocument
- **Diagram**: PK: id; FK: job_id; documentType, fileName, fileExtension, mimeType, storageLocation, storageType, webUrl?, documentSecuredHash, uploadedAt
- **Schema**: Same fields.
- **Status**: ✅ Matches.

### ServiceSupportingDocument
- **Diagram**: PK: id; FK: job_id; fileName, fileExtension, mimeType, storageLocation, storageType, webUrl?, documentSecuredHash, uploadedAt
- **Schema**: Same (no documentType).
- **Status**: ✅ Matches.

### JobCourtCase
- **Diagram**: PK: id; FK: job_id, court_id?; caseNumber, plaintiff?, defendant?, courtDate?: iso8601
- **Schema**: id, job_id, court_id?, caseNumber, plaintiff?, defendant?, courtDate?
- **Status**: ✅ Matches.

### JobCourt
- **Diagram**: PK: id; FK: job_id, court_id; _type: processproof:JobCourt (link table)
- **Schema**: id, job_id, court_id, _type, _schemaVersion, _created, _updated
- **Status**: ✅ Matches (diagram labels as link table).

---

## 6. Service Attempts Domain

### ServiceAttempt
- **Diagram**: PK: id; FK: job_id, user_id, account_id, client_id?; status, contactMethod?, phone?, email?, emailNote?, contact_ids?: uuid[]; attemptedAt: iso8601; gpsstamp_id?, svcattemptphysaddr_id?
- **Schema**: Same set (schema uses serviceattemptphysicaladdress_id; diagram uses svcattemptphysaddr_id).
- **Status**: ✅ Matches (abbreviated FK name in diagram).

### GpsStamp
- **Diagram**: PK: id; FK: serviceAttempt_id; latitude, longitude, altitude?, accuracy?, heading?, speed?; deviceTimestamp, gpsTimestamp: iso8601
- **Schema**: id, serviceAttempt_id, latitude, longitude, altitude?, accuracy?, heading?, speed?, deviceTimestamp, gpsTimestamp
- **Status**: ✅ Matches.

### ServiceAttemptPhysicalAddress
- **Diagram**: PK: id; FK: serviceAttempt_id; line1, line2?, city, state, postalCode
- **Schema**: Same.
- **Status**: ✅ Matches.

### ServiceAttemptSupportingDocuments
- **Diagram**: PK: id; FK: serviceAttempt_id; fileName, fileExtension, mimeType, storageLocation, storageType, webUrl?, documentSecuredHash, uploadedAt
- **Schema**: Same (entity name in schema: ServiceAttemptSupportingDocuments).
- **Status**: ✅ Matches.

---

## 7. Affidavits Domain

### JobAffidavit
- **Diagram**: PK: id; FK: job_id, account_id; systemTemplate_id?, accountTemplate_id?, userTemplate_id?; emailList?: str[]; md5Digest: str; generatedAt: iso8601; generatedaffidavit_id?
- **Schema**: id, job_id, account_id, systemTemplate_id?, accountTemplate_id?, userTemplate_id?, emailList?, md5Digest, generatedAt, generatedaffidavit_id?
- **Status**: ✅ Matches.

### JobAffidavitSignature
- **Diagram**: PK: id; FK: generatedaffidavit_id, user_id?; hmacSignature, publicKey, cypherAlgorithm, signedAt: iso8601
- **Schema**: id, generatedaffidavit_id, user_id?, hmacSignature, publicKey, cypherAlgorithm, signedAt
- **Status**: ✅ Matches.

### JobAffidavitDocument
- **Diagram**: PK: id; FK: generatedaffidavit_id; fileName, fileExtension, mimeType, storageLocation, storageType, webUrl?, documentSecuredHash
- **Schema**: id, generatedaffidavit_id, fileName, fileExtension, mimeType, storageLocation, storageType, webUrl?, documentSecuredHash (no uploadedAt in schema for this entity)
- **Status**: ✅ Matches.

---

## Recommended Fixes (prioritized)

1. **Account**: Resolve `system_id` (in diagram) vs `owner_account_id` (in schema); add missing owner_account_id if schema is source of truth.
2. **AccountAffidavitTemplateMap**: Use `mappingDefinition` in diagram to match schema (diagram has `mappingDef`).
3. **System.User**: Add middleName?, ssn?, height?, weight?, and the “Other” description fields (eyeColorOtherDescription, hairOtherDescription, etc.) if they should be visible.
4. **UserPhone / UserEmail**: Add isVerified; add note? (UserPhone), emailArray? (UserEmail).
5. **UserPhysicalAddress**: Add line2?, country, isPrimary, isVerified.
6. **UserSignature**: Add cypherAlgorithm, printedName, and optional privateKey.
7. **UserSignatureImage**: Align FK name with schema (`userSignature_id`); add mimeType, documentHash, uploadedAt.
8. **UserSignaturePreferences / AccountDocumentPreferences**: Add defaultTemplateId?.
9. **Court**: Add note?.
10. **CourtPhysicalAddress / ClientPhysicalAddress**: Add line2?.
11. **CourtPhone**: Add extension?.
12. **ClientContact**: Add licenseExpiration?.

---

---

## Changelog: Diagram updated to match schema

The following edits were applied to `ENTITY_RELATIONSHIP_DIAGRAM.drawio` so entity properties align with `ENTITY_SCHEMAS.md`:

- **Account**: Removed `FK: system_id`; added `owner_account_id?: uuid`. Adjusted row heights.
- **AccountAffidavitTemplateMap**: `FK: tpl_id` → `FK: accountAffidavitTemplate_id`; `mappingDef: json` → `mappingDefinition: string_json`.
- **AccountAffidavitTemplateDocument**: `FK: tpl_id` → `FK: accountAffidavitTemplate_id`.
- **UserSignatureImage**: `FK: sig_id` → `FK: userSignature_id`; added `mimeType`, `documentHash`, `uploadedAt`. Row/table height increased.
- **System.User**: Added `middleName?`, `ssn?`, `height?`, `weight?`, `eyeColor`/`eyeColorOtherDescription?`, `hairColor`/`hairOtherDescription?`, `ethnicity`/`ethnicityOtherDescription?`, `gender`/`genderOtherDescription?`. Table/row height increased.
- **UserPhone**: Added `isVerified: bool`, `note?: str`. Row height increased.
- **UserEmail**: Added `isVerified: bool`, `emailArray?: str[]`. Row height increased.
- **UserPhysicalAddress**: Added `line2?`, `country`, `isPrimary`, `isVerified`. Row/table height increased.
- **UserSignature**: Added `privateKey?`, `cypherAlgorithm`, `printedName`. Row/table height increased.
- **UserSignaturePreferences**: Added `defaultTemplateId?: uuid`.
- **Court**: Added `note?: str`.
- **CourtPhysicalAddress**: Added `line2?`.
- **CourtPhone**: Added `extension?: str`.
- **AccountDocumentPreferences**: Added `defaultTemplateId?: uuid`.
- **Client**: `FK: coll_id` → `FK: clientCollection_id`, `FK: acct_id` → `FK: account_id`.
- **ClientContact**: Added `licenseExpiration?: iso8601`.
- **ClientPhysicalAddress**: Added `line2?`.

*End of audit.*
