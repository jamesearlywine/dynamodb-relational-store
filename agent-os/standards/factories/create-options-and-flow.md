# Factory Pattern: Create*Options and Flow

Use factory functions to build records so keys and field formats are correct. Factories are **recommended**, not required; records from any source can be validated with type guards (Zod inside).

**Per-record factory:** One `create*()` per record type (e.g. `createResource`, `createParentChildRelationship`). Each takes a `Create*Options` interface and returns the full record type.

**Flow:** Validate inputs → generate IDs/URNs if needed → generate PK/SK via key-generation utils → set timestamps via `getCurrentTimestamp()` → build and return the record.

- Define a `Create*Options` interface per factory; required fields only; optional ID/URN where the factory can generate.
- Use `validateUrn()` for any URN inputs; use key helpers from `key-generation.ts`; do not hand-build PK/SK strings.
- Callers may construct or mutate records elsewhere; validate with the exported type guards (which run Zod) to get compile-time + runtime alignment.
