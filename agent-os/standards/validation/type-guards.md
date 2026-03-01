# Type Guards

Type guards narrow `DynamoDBRecord` to a specific record type using the discriminant and Zod.

**Pattern:** For each record type, export `is*Record(record: DynamoDBRecord): record is XRecord`. Implementation:
1. If `record._recordType !== 'ExpectedLiteral'`, return `false`.
2. Return `XSchema.safeParse(record).success` (use the schema co-located with that record's factory).

- Add a guard when adding a new record type; keep it in `type-guards.ts` and import the schema from the corresponding factory module.
- Do not rely only on `_recordType`; always run the schema so shape and field validity are checked.
