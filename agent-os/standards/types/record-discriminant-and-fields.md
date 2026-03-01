# Record Discriminant and Field Naming

**Record kind:** Use `_recordType` as the single discriminant for all record types in the single table. Values: `"Resource"`, `"ParentChildRelationship"`, `"CollectionMemberRelationship"`, `"UniqueKeyValue"`. Enables type narrowing and distinguishes resources from relationship records and UniqueKeyValue records.

**Naming:** Prefix library-defined metadata fields with `_` (e.g. `_recordType`, `_resourceType`, `_urn`, `_createdAt`, `_updatedAt`, `_schemaVersion`, `_accountUrn`). Domain-specific fields (e.g. `parentUrn`, `childUrn`, `key`, `value`) stay unprefixed.

- Define each record interface in `src/types/record-types.ts` with a literal `_recordType`.
- Add new record kinds by adding a new interface and extending the `DynamoDBRecord` union.
- Do not change the meaning or values of `_recordType`; they are part of the public contract.
