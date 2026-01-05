# Release Checklist

This checklist should be followed for every release of the `dynamodb-relational-store` package.

## Pre-Publish Verification

### Code Quality
- [ ] All unit tests pass (`npm test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] No TypeScript errors or warnings
- [ ] All test files are co-located with source files

### Build Verification
- [ ] Build succeeds (`npm run build`)
- [ ] `dist/` directory is generated correctly
- [ ] TypeScript declaration files (`.d.ts`) are generated
- [ ] Source maps are generated (if configured)

### Package Contents
- [ ] Run dry-run to verify package contents (`npm run publish:dry-run`)
- [ ] Verify only `dist/` and `src/` directories are included
- [ ] Verify test files are NOT included
- [ ] Verify `specs/` directory is NOT included
- [ ] Verify `node_modules/` is NOT included
- [ ] Verify package size is reasonable

### Documentation
- [ ] README.md is up to date
- [ ] All public APIs are documented
- [ ] JSDoc comments are complete
- [ ] Examples in documentation are accurate

### Version Management
- [ ] Version number is appropriate (see [VERSIONING.md](./VERSIONING.md))
- [ ] Version bump type is correct (patch/minor/major)
- [ ] CHANGELOG.md is updated (if maintained)
- [ ] Breaking changes are documented (for major versions)

### Dependencies
- [ ] All dependencies are up to date
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Peer dependencies are correctly specified
- [ ] Optional peer dependencies are marked as optional

## Publishing Steps

### Authentication
- [ ] Authenticated with AWS CodeArtifact
- [ ] Token is valid (not expired)
- [ ] Registry URL is correct in `.npmrc`
- [ ] `publishConfig` in `package.json` is correct

### Pre-Publish Hooks
- [ ] `prepublishOnly` hook will run build and tests
- [ ] `prepack` hook will run build (if configured)

### Publish Execution
- [ ] Run `npm run publish:private` or `npm publish`
- [ ] Verify publish command completes successfully
- [ ] Note the published version number

## Post-Publish Verification

### Package Verification
- [ ] Package appears in CodeArtifact repository
- [ ] Package version is correct
- [ ] Package metadata is correct (name, description, etc.)
- [ ] Package files are correct (verify via `npm view`)

### Installation Test
- [ ] Test installing the package in a clean directory:
  ```bash
  npm install dynamodb-relational-store \
    --registry=https://jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/
  ```
- [ ] Verify package installs without errors
- [ ] Verify all exports are accessible
- [ ] Test importing the package in a TypeScript project

### Functionality Test
- [ ] Import and use factory functions
- [ ] Import and use utility functions
- [ ] Import and use type definitions
- [ ] Verify type definitions work correctly

### Git Management
- [ ] Version commit is created (if using version scripts)
- [ ] Git tag is created (if using version scripts)
- [ ] Push commits and tags to remote:
  ```bash
  git push
  git push --tags
  ```

## Rollback Procedure

If a published version has critical issues:

### Option 1: Publish Patch Version
- [ ] Identify the issue
- [ ] Fix the issue
- [ ] Publish a patch version with the fix
- [ ] Document the issue and fix

### Option 2: Deprecate Version (if supported)
- [ ] Deprecate the problematic version:
  ```bash
  npm deprecate dynamodb-relational-store@<version> "Reason for deprecation"
  ```
- [ ] Publish a new version with the fix
- [ ] Update documentation

### Option 3: Contact Repository Admin
- [ ] If version deletion is needed, contact CodeArtifact repository admin
- [ ] Document the reason for deletion
- [ ] Publish corrected version

## Release Notes Template

For each release, document:

```markdown
## Version X.Y.Z - Release Date

### Added
- New features or functionality

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Breaking Changes
- Breaking changes (for major versions)

### Dependencies
- Updated dependencies
```

## Quick Reference

### Common Commands

```bash
# Pre-publish checks
npm test
npm run type-check
npm run lint
npm run build
npm run publish:dry-run

# Version bumping
npm run version:patch
npm run version:minor
npm run version:major

# Publishing
aws codeartifact login --tool npm --repository npm-store --domain jamesearlywine --domain-owner 546515125053 --region us-east-2
npm run publish:private

# Verification
npm view dynamodb-relational-store --registry=https://jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/
```

