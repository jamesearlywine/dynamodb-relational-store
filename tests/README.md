# Integration Tests

This directory contains integration tests that run against a real DynamoDB database.

## Prerequisites

### AWS Credentials

The integration tests require AWS credentials to be configured in your environment. The tests will use the default AWS credential chain, which checks for credentials in the following order:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)
2. AWS credentials file (`~/.aws/credentials`)
3. IAM role (if running on EC2/ECS/Lambda)

**Note**: The ambient environment should already contain the required credentials for accessing AWS.

### AWS SDK Dependency

The integration tests require `@aws-sdk/client-dynamodb` to be installed. This is a peer dependency of the library, so you may need to install it:

```bash
npm install --save-dev @aws-sdk/client-dynamodb
```

## Test Structure

### Table Management

During test setup, a temporary DynamoDB table is created with a unique name (includes timestamp to avoid conflicts). The table is automatically:

- **Created** before tests run
- **Used** by all integration tests in the suite
- **Deleted** after all tests complete (cleanup)

### Table Schema

The integration tests create a table with the following configuration:

- **Table Name**: `dynamodb-relational-store-test-{timestamp}`
- **Primary Key**: `PK` (String)
- **Sort Key**: `SK` (String)
- **Global Secondary Indexes**:
  - **GSI1** (InvertedIndex): `GSI1PK` (String), `GSI1SK` (String)
  - **GSI2** (ResourcesByAccountIndex): `GSI2PK` (String), `GSI2SK` (String)

## Running Integration Tests

### Run All Tests

```bash
npm test
```

### Run Only Integration Tests

```bash
npm test tests/integration
```

### Run with Watch Mode

```bash
npm run test:watch
```

## Test Examples

The integration tests implement the examples from `specs/PRD.md` Section 6, including:

1. **System.Account Resource Creation**
2. **System.Account.JobCollection Resource Creation**
3. **Parent-Child Relationship** between Account and JobCollection
4. **System.Account.JobCollection.Job Resource Creation**
5. **Collection-Membership Relationship** between Job and JobCollection
6. **Complete Resource Hierarchy** building

## Environment Variables

The following environment variables can be used to configure the tests:

- `AWS_REGION`: AWS region to use (default: `us-east-2`)
- `DYNAMODB_TABLE_PREFIX`: Prefix for test table names (default: `dynamodb-relational-store-test`)

## Cleanup

If tests are interrupted or fail, the test table may not be automatically deleted. You can manually clean up tables using the AWS Console or CLI:

```bash
# List test tables
aws dynamodb list-tables --query "TableNames[?contains(@, 'dynamodb-relational-store-test')]"

# Delete a specific test table
aws dynamodb delete-table --table-name <table-name>
```

## Troubleshooting

### Credentials Not Found

If you see errors about missing credentials:

1. Verify AWS credentials are configured: `aws sts get-caller-identity`
2. Check environment variables are set correctly
3. Verify IAM permissions include DynamoDB table creation/deletion

### Table Already Exists

If you see "Table already exists" errors:

1. Check for orphaned test tables from previous runs
2. Manually delete the table or wait for it to be cleaned up
3. The test table name includes a timestamp to minimize conflicts

### Permission Denied

Ensure your AWS credentials have the following permissions:

- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:DeleteTable`
