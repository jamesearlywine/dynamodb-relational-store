# Testing: Vitest and Co-located Tests

**Framework:** Vitest. Tests live next to source: `*.test.ts` beside the module under test (e.g. `resource.test.ts` next to `resource.ts`).

**Structure:** `describe('createResource', () => { ... })` (or the function/behavior under test). Use `it('...', () => { ... })` and `expect()`.

**Coverage:**
- Factory functions: valid options produce a valid record (keys, URN, timestamps); invalid or missing inputs throw with a clear message.
- Validation/utilities: valid input passes; invalid input fails or throws with descriptive context.
- Type guards: guard returns true for valid record of that type, false for wrong `_recordType` or invalid shape.

Use `npm test` / `npm run test:watch`; use `tsd` for type-only tests when narrowing or generics need verification.
