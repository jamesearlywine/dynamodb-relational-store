# URN Validation and Zod Schema Placement

**Co-location:** Keep each record's Zod schema in the same module as its factory (e.g. `ResourceSchema` in `resource.ts`). The type guard for that record depends on the schema for runtime validation, so schema, factory, and record type stay together.

**URN validation:** In factory code, call `validateUrn()` for every URN input before building keys or storing. Use the shared `urnSchema` from `urn-validator.ts` inside record schemas so URN fields are validated consistently.

**Schema helpers:** Define reusable pieces in utils and import where needed:
- `urnSchema` from `urn-validator.ts`
- `timestampSchema` from `timestamps.ts`
- `primaryKeySchema` from `key-generation.ts`

Do not centralize record schemas in a single file; keep them with their factory and type guard.
