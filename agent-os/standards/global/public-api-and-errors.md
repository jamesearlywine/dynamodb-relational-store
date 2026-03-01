# Public API: Return Types, JSDoc, Errors, Immutable IDs

**Return types:** Every public function must have an explicit return type. No inference-only exports for the public API.

**JSDoc:** Document all public functions: brief description, `@param` for each argument, `@returns`, `@throws` when the function throws, and an `@example` where it helps.

**Errors:** Throw descriptive errors with context (e.g. invalid URN format, missing required field). Validate early and fail fast. Message should be enough to fix the call site.

**Immutable record identifiers:** URNs, PK, SK, and resource IDs do not change after creation. Records may be updated (e.g. timestamps, attributes), but these identity fields are fixed. Do not provide APIs that mutate them.
