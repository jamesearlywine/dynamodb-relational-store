/**
 * DynamoDB table setup and teardown utilities for integration tests
 *
 * Provides functions to create and delete temporary DynamoDB tables
 * for integration testing.
 */

import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  waitUntilTableExists,
  waitUntilTableNotExists,
} from '@aws-sdk/client-dynamodb';

const DEFAULT_REGION = process.env.AWS_REGION || 'us-east-2';
const TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'dynamodb-relational-store-test';

/**
 * Creates a temporary DynamoDB table for integration tests
 *
 * Creates a table matching the schema defined in specs/SCHEMA.md:
 * - Primary Key: PK (HASH), SK (RANGE)
 * - GSI1 (InvertedIndex): Uses SK (HASH) and PK (RANGE) directly (enables reverse lookups)
 * - GSI2 (ResourcesByAccountIndex): Uses _accountUrn (HASH) and urn (RANGE) directly (sparse index)
 *
 * @param client - DynamoDB client instance
 * @returns Table name
 */
export async function createTestTable(client: DynamoDBClient): Promise<string> {
  const tableName = `${TABLE_PREFIX}-${Date.now()}`;

  const createTableCommand = new CreateTableCommand({
    TableName: tableName,
    // Attribute definitions for all attributes used in keys and indexes
    // Per SCHEMA.md: GSI1 uses SK and PK directly (inverted from primary key)
    // GSI2 uses _accountUrn and urn directly
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: '_accountUrn', AttributeType: 'S' },
      { AttributeName: 'urn', AttributeType: 'S' },
    ],
    // Primary Key Schema (Default Index)
    // Per SCHEMA.md: PK = {RecordType}#{urn}, SK = {RecordType}#{urn} (or Child#{urn}, etc.)
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [
      {
        // GSI1: InvertedIndex
        // Per SCHEMA.md: GSI1PK = SK (from primary index), GSI1SK = PK (from primary index)
        // This enables reverse lookups (e.g., finding all parents of a child)
        // Uses SK as hash key and PK as range key directly
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'SK', KeyType: 'HASH' },
          { AttributeName: 'PK', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        // GSI2: ResourcesByAccountIndex (Sparse Index)
        // Per SCHEMA.md: GSI2PK = _accountUrn, GSI2SK = urn
        // Only includes records with _accountUrn populated
        // Uses _accountUrn as hash key and urn as range key directly
        IndexName: 'GSI2',
        KeySchema: [
          { AttributeName: '_accountUrn', KeyType: 'HASH' },
          { AttributeName: 'urn', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    // Use on-demand billing for tests (no need to specify capacity)
    BillingMode: 'PAY_PER_REQUEST',
  });

  await client.send(createTableCommand);

  // Wait for table to be active
  await waitUntilTableExists(
    { client, maxWaitTime: 60 },
    { TableName: tableName }
  );

  return tableName;
}

/**
 * Deletes a DynamoDB table
 *
 * @param client - DynamoDB client instance
 * @param tableName - Name of the table to delete
 */
export async function deleteTestTable(
  client: DynamoDBClient,
  tableName: string
): Promise<void> {
  try {
    const deleteTableCommand = new DeleteTableCommand({
      TableName: tableName,
    });

    await client.send(deleteTableCommand);

    // Wait for table to be deleted
    await waitUntilTableNotExists(
      { client, maxWaitTime: 60 },
      { TableName: tableName }
    );
  } catch (error) {
    // Ignore errors if table doesn't exist
    if (error instanceof Error && error.name !== 'ResourceNotFoundException') {
      throw error;
    }
  }
}

/**
 * Gets a DynamoDB client instance
 *
 * @returns DynamoDB client configured for the test region
 */
export function getDynamoDBClient(): DynamoDBClient {
  return new DynamoDBClient({
    region: DEFAULT_REGION,
  });
}

/**
 * Verifies that a table exists and is active
 *
 * @param client - DynamoDB client instance
 * @param tableName - Name of the table to verify
 * @returns True if table exists and is active
 */
export async function verifyTableExists(
  client: DynamoDBClient,
  tableName: string
): Promise<boolean> {
  try {
    const describeCommand = new DescribeTableCommand({
      TableName: tableName,
    });

    const response = await client.send(describeCommand);
    return response.Table?.TableStatus === 'ACTIVE';
  } catch (error) {
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}
