# Versioning Strategy

This document outlines the versioning strategy for the `dynamodb-relational-store` package.

## Semantic Versioning

This package follows [Semantic Versioning (SemVer)](https://semver.org/) principles:

- **MAJOR** version (X.0.0): Incremented for incompatible API changes
- **MINOR** version (0.X.0): Incremented for backwards-compatible functionality additions
- **PATCH** version (0.0.X): Incremented for backwards-compatible bug fixes

## Version Bump Guidelines

### Major Version (Breaking Changes)

Bump the major version when:
- Removing or renaming public APIs (functions, types, interfaces)
- Changing function signatures in a non-backwards-compatible way
- Removing or changing required parameters
- Changing the behavior of existing functions in a way that breaks existing code
- Removing or modifying exported types/interfaces

**Examples:**
- Renaming `createResource()` to `createResourceRecord()`
- Changing `createUrn()` to require additional parameters
- Removing a public utility function

### Minor Version (New Features)

Bump the minor version when:
- Adding new public functions or utilities
- Adding new exported types or interfaces
- Adding optional parameters to existing functions
- Adding new factory methods
- Adding new utility functions
- Enhancing existing functionality without breaking changes

**Examples:**
- Adding a new `createCustomRecord()` factory
- Adding a new utility function like `formatUrn()`
- Adding optional parameters to existing functions

### Patch Version (Bug Fixes)

Bump the patch version when:
- Fixing bugs in existing functionality
- Improving error messages
- Fixing type definitions
- Performance improvements
- Documentation updates
- Internal refactoring that doesn't affect the public API

**Examples:**
- Fixing URN validation edge cases
- Correcting type definitions
- Fixing timestamp generation issues
- Improving error messages

## Version Bump Scripts

Use the following npm scripts to bump versions:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm run version:patch

# Minor version (1.0.0 -> 1.1.0)
npm run version:minor

# Major version (1.0.0 -> 2.0.0)
npm run version:major
```

These scripts will:
1. Update the version in `package.json`
2. Create a git commit with the version change
3. Create a git tag for the version

## Pre-Release Checklist

Before bumping a version:
- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] CHANGELOG.md is updated (if maintained)
- [ ] Breaking changes are documented (for major versions)

## Version History

- **1.0.0** - Initial release with all core functionality

