# Publishing Guide

This document describes how to publish the `dynamodb-relational-store` package to the private AWS CodeArtifact npm repository.

## Prerequisites

1. **AWS CLI** installed and configured
2. **AWS CodeArtifact Access** - You must have permissions to publish to the CodeArtifact repository
3. **Authentication** - You must be authenticated with AWS CodeArtifact

## Authentication Setup

### Option 1: Using AWS CLI (Recommended)

1. Ensure AWS CLI is installed and configured:
   ```bash
   aws --version
   aws configure
   ```

2. Login to CodeArtifact:
   ```bash
   aws codeartifact login --tool npm \
     --repository npm-store \
     --domain jamesearlywine \
     --domain-owner 546515125053 \
     --region us-east-2
   ```

   This command will:
   - Generate an authentication token
   - Configure npm to use the token
   - Update your `~/.npmrc` file with the token

3. Verify authentication:
   ```bash
   npm whoami --registry=https://jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/
   ```

### Option 2: Manual Token Configuration

1. Get an authentication token:
   ```bash
   aws codeartifact get-authorization-token \
     --domain jamesearlywine \
     --domain-owner 546515125053 \
     --region us-east-2 \
     --query authorizationToken \
     --output text
   ```

2. Add to your `~/.npmrc` file:
   ```
   //jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/:_authToken=YOUR_TOKEN_HERE
   ```

**Note:** Tokens expire after 12 hours. You'll need to re-authenticate periodically.

## Publishing Process

### Step 1: Pre-Publish Verification

Before publishing, ensure:

1. **All tests pass:**
   ```bash
   npm test
   ```

2. **Type checking passes:**
   ```bash
   npm run type-check
   ```

3. **Linting passes:**
   ```bash
   npm run lint
   ```

4. **Build succeeds:**
   ```bash
   npm run build
   ```

5. **Verify package contents (dry-run):**
   ```bash
   npm run publish:dry-run
   ```

### Step 2: Update Version

If this is a new release, update the version:

```bash
# For patch release (bug fixes)
npm run version:patch

# For minor release (new features)
npm run version:minor

# For major release (breaking changes)
npm run version:major
```

See [VERSIONING.md](./VERSIONING.md) for versioning guidelines.

### Step 3: Authenticate

Ensure you're authenticated with CodeArtifact:

```bash
aws codeartifact login --tool npm \
  --repository npm-store \
  --domain jamesearlywine \
  --domain-owner 546515125053 \
  --region us-east-2
```

### Step 4: Publish

Publish to the private repository:

```bash
npm run publish:private
```

Or use npm directly:

```bash
npm publish
```

The `prepublishOnly` hook will automatically:
1. Run the build (`npm run build`)
2. Run all tests (`npm run test`)

## Verifying Published Package

### Check Package in CodeArtifact

1. View package in AWS Console:
   - Navigate to CodeArtifact in AWS Console
   - Select the `npm-store` repository
   - Search for `dynamodb-relational-store`

2. Verify package via npm:
   ```bash
   npm view dynamodb-relational-store \
     --registry=https://jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/
   ```

### Test Installation

Test installing the published package:

```bash
# In a test directory
npm install dynamodb-relational-store \
  --registry=https://jamesearlywine-546515125053.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/
```

## Package Contents

The published package includes:
- `dist/` - Compiled JavaScript and TypeScript declaration files
- `src/` - Source TypeScript files (excluding test files via `.npmignore`)
- `README.md` - Package documentation

Excluded from package (via `.npmignore`):
- `**/*.test.ts` - Test files (co-located with source)
- `specs/` - Specification files
- `docs/` - Documentation files (except README.md)
- `node_modules/` - Dependencies
- `coverage/` - Test coverage reports
- Development configuration files (tsconfig.json, vitest.config.ts, etc.)

**Note:** Test files are excluded even though they're co-located with source files, as they're not needed in the published package.

## Troubleshooting

### Authentication Errors

**Error:** `npm ERR! code E401` or `npm ERR! 401 Unauthorized`

**Solution:**
1. Re-authenticate with CodeArtifact:
   ```bash
   aws codeartifact login --tool npm \
     --repository npm-store \
     --domain jamesearlywine \
     --domain-owner 546515125053 \
     --region us-east-2
   ```
2. Tokens expire after 12 hours - re-authenticate if needed

### Registry Not Found

**Error:** `npm ERR! code E404` or registry not found

**Solution:**
1. Verify `.npmrc` file exists and has correct registry URL
2. Check `publishConfig` in `package.json`
3. Ensure you're authenticated (see Authentication Setup)

### Build Errors Before Publish

**Error:** Build fails during `prepublishOnly` hook

**Solution:**
1. Run `npm run build` manually to see errors
2. Fix TypeScript compilation errors
3. Ensure all dependencies are installed (`npm install`)
4. Verify `tsconfig.json` is correctly configured

### Package Size Issues

**Error:** Package is too large

**Solution:**
1. Verify `files` field in `package.json` only includes necessary directories
2. Check that `dist/` and `src/` are the only included directories
3. Ensure test files and other development files are excluded

### Version Already Exists

**Error:** `npm ERR! code E403` - version already exists

**Solution:**
1. Bump the version number:
   ```bash
   npm run version:patch  # or minor/major
   ```
2. Or manually edit `package.json` and update the version

## CI/CD Integration

For automated publishing in CI/CD pipelines:

1. Configure AWS credentials in your CI/CD environment
2. Run authentication before publish:
   ```bash
   aws codeartifact login --tool npm \
     --repository npm-store \
     --domain jamesearlywine \
     --domain-owner 546515125053 \
     --region us-east-2
   ```
3. Run publish:
   ```bash
   npm publish
   ```

## Additional Resources

- [AWS CodeArtifact Documentation](https://docs.aws.amazon.com/codeartifact/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

