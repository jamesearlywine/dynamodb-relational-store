/**
 * Integration tests for resource hierarchy creation
 *
 * These tests implement the examples from specs/PRD.md Section 6,
 * running against a real DynamoDB table.
 *
 * @see specs/PRD.md Section 6: Usage Examples
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  createResource,
  createParentChildRelationship,
  createCollectionMembershipRelationship,
} from '../../src';
import {
  createTestTable,
  deleteTestTable,
  getDynamoDBClient,
  verifyTableExists,
} from './dynamodb-setup';

describe('Resource Hierarchy Integration Tests', () => {
  let client: DynamoDBClient;
  let tableName: string;

  beforeAll(async () => {
    client = getDynamoDBClient();
    tableName = await createTestTable(client);

    // Verify table was created
    const exists = await verifyTableExists(client, tableName);
    expect(exists).toBe(true);
  });

  afterAll(async () => {
    if (tableName) {
      //await deleteTestTable(client, tableName);
    }
  });

  /**
   * Helper function to write a record to DynamoDB
   */
  async function putRecord(record: Record<string, unknown>): Promise<void> {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(record),
    });
    await client.send(command);
  }

  /**
   * Helper function to read a record from DynamoDB
   */
  async function getRecord(pk: string, sk: string): Promise<Record<string, unknown> | null> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: marshall({ PK: pk, SK: sk }),
    });
    const response = await client.send(command);
    return response.Item ? unmarshall(response.Item) : null;
  }

  /**
   * Helper function to query records by PK
   */
  async function queryByPK(pk: string): Promise<Record<string, unknown>[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: marshall({ ':pk': pk }),
    });
    const response = await client.send(command);
    return response.Items ? response.Items.map((item) => unmarshall(item)) : [];
  }

  describe('System.Account Resource Creation', () => {
    it('should create a System.Account resource and store it in DynamoDB', async () => {
      // Create a System.Account resource (from PRD Section 6.1)
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: {
          name: 'Acme Corporation',
          email: 'contact@acme.com',
        },
      });

      // Verify the record structure
      expect(account._recordType).toBe('Resource');
      expect(account._resourceType).toBe('System.Account');
      expect(account.urn).toMatch(/^urn:pp:System\.Account::/);
      expect(account.PK).toBe(`Resource#${account.urn}`);
      expect(account.SK).toBe(`Resource#${account.urn}`);

      // Write to DynamoDB
      await putRecord(account);

      // Read back from DynamoDB
      const retrieved = await getRecord(account.PK, account.SK);

      expect(retrieved).not.toBeNull();
      expect(retrieved?._recordType).toBe('Resource');
      expect(retrieved?._resourceType).toBe('System.Account');
      expect(retrieved?.urn).toBe(account.urn);
      expect(retrieved?.name).toBe('Acme Corporation');
      expect(retrieved?.email).toBe('contact@acme.com');
    });
  });

  describe('System.Account.JobCollection Resource Creation', () => {
    it('should create a JobCollection resource scoped to an account', async () => {
      // First create the account
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: { name: 'Acme Corporation' },
      });
      await putRecord(account);

      // Create a JobCollection resource (from PRD Section 6.1)
      const jobCollection = createResource({
        resourceType: 'System.Account.JobCollection',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: {
          name: 'Engineering Jobs',
          description: 'All engineering job postings',
        },
      });

      // Verify the record structure
      expect(jobCollection._recordType).toBe('Resource');
      expect(jobCollection._resourceType).toBe('System.Account.JobCollection');
      expect(jobCollection._accountUrn).toBe(account.urn);
      expect(jobCollection.urn).toMatch(/^urn:pp:System\.Account\.JobCollection::/);

      // Write to DynamoDB
      await putRecord(jobCollection);

      // Read back from DynamoDB
      const retrieved = await getRecord(jobCollection.PK, jobCollection.SK);

      expect(retrieved).not.toBeNull();
      expect(retrieved?._recordType).toBe('Resource');
      expect(retrieved?._resourceType).toBe('System.Account.JobCollection');
      expect(retrieved?._accountUrn).toBe(account.urn);
      expect(retrieved?.name).toBe('Engineering Jobs');
      expect(retrieved?.description).toBe('All engineering job postings');
    });
  });

  describe('Parent-Child Relationship', () => {
    it('should create a parent-child relationship between Account and JobCollection', async () => {
      // Create the account
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: { name: 'Acme Corporation' },
      });
      await putRecord(account);

      // Create the job collection
      const jobCollection = createResource({
        resourceType: 'System.Account.JobCollection',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: { name: 'Engineering Jobs' },
      });
      await putRecord(jobCollection);

      // Create parent-child relationship (from PRD Section 6.2)
      const relationship = createParentChildRelationship({
        parentUrn: account.urn,
        childUrn: jobCollection.urn,
        accountUrn: account.urn,
      });

      // Verify the relationship structure
      expect(relationship._recordType).toBe('ParentChildRelationship');
      expect(relationship.parentUrn).toBe(account.urn);
      expect(relationship.childUrn).toBe(jobCollection.urn);
      expect(relationship._accountUrn).toBe(account.urn);
      expect(relationship.PK).toBe(`Parent#${account.urn}`);
      expect(relationship.SK).toBe(`Child#${jobCollection.urn}`);

      // Write to DynamoDB
      await putRecord(relationship as unknown as Record<string, unknown>);

      // Read back from DynamoDB
      const retrieved = await getRecord(relationship.PK, relationship.SK);

      expect(retrieved).not.toBeNull();
      expect(retrieved?._recordType).toBe('ParentChildRelationship');
      expect(retrieved?.parentUrn).toBe(account.urn);
      expect(retrieved?.childUrn).toBe(jobCollection.urn);

      // Query all children of the account
      const children = await queryByPK(`Parent#${account.urn}`);
      expect(children.length).toBeGreaterThan(0);
      expect(children.some((child) => child.childUrn === jobCollection.urn)).toBe(true);
    });
  });

  describe('System.Account.JobCollection.Job Resource Creation', () => {
    it('should create a Job resource within a collection', async () => {
      // Create the account
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: { name: 'Acme Corporation' },
      });
      await putRecord(account);

      // Create the job (from PRD Section 6.3)
      const job = createResource({
        resourceType: 'System.Account.JobCollection.Job',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: {
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'Remote',
          status: 'open',
        },
      });

      // Verify the record structure
      expect(job._recordType).toBe('Resource');
      expect(job._resourceType).toBe('System.Account.JobCollection.Job');
      expect(job._accountUrn).toBe(account.urn);
      expect(job.urn).toMatch(/^urn:pp:System\.Account\.JobCollection\.Job::/);

      // Write to DynamoDB
      await putRecord(job);

      // Read back from DynamoDB
      const retrieved = await getRecord(job.PK, job.SK);

      expect(retrieved).not.toBeNull();
      expect(retrieved?._recordType).toBe('Resource');
      expect(retrieved?._resourceType).toBe('System.Account.JobCollection.Job');
      expect(retrieved?._accountUrn).toBe(account.urn);
      expect(retrieved?.title).toBe('Senior Software Engineer');
      expect(retrieved?.department).toBe('Engineering');
      expect(retrieved?.location).toBe('Remote');
      expect(retrieved?.status).toBe('open');
    });
  });

  describe('Collection-Membership Relationship', () => {
    it('should create a collection-membership relationship between Job and JobCollection', async () => {
      // Create the account
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: { name: 'Acme Corporation' },
      });
      await putRecord(account);

      // Create the job collection
      const jobCollection = createResource({
        resourceType: 'System.Account.JobCollection',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: { name: 'Engineering Jobs' },
      });
      await putRecord(jobCollection);

      // Create the job
      const job = createResource({
        resourceType: 'System.Account.JobCollection.Job',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: {
          title: 'Senior Software Engineer',
          status: 'open',
        },
      });
      await putRecord(job);

      // Create collection-membership relationship (from PRD Section 6.4)
      const membership = createCollectionMembershipRelationship({
        collectionUrn: jobCollection.urn,
        memberUrn: job.urn,
        accountUrn: account.urn,
      });

      // Verify the relationship structure
      expect(membership._recordType).toBe('CollectionMemberRelationship');
      expect(membership.collectionUrn).toBe(jobCollection.urn);
      expect(membership.memberUrn).toBe(job.urn);
      expect(membership._accountUrn).toBe(account.urn);
      expect(membership.PK).toBe(`Collection#${jobCollection.urn}`);
      expect(membership.SK).toBe(`Member#${job.urn}`);

      // Write to DynamoDB
      await putRecord(membership as unknown as Record<string, unknown>);

      // Read back from DynamoDB
      const retrieved = await getRecord(membership.PK, membership.SK);

      expect(retrieved).not.toBeNull();
      expect(retrieved?._recordType).toBe('CollectionMemberRelationship');
      expect(retrieved?.collectionUrn).toBe(jobCollection.urn);
      expect(retrieved?.memberUrn).toBe(job.urn);

      // Query all members of the collection
      const members = await queryByPK(`Collection#${jobCollection.urn}`);
      expect(members.length).toBeGreaterThan(0);
      expect(members.some((member) => member.memberUrn === job.urn)).toBe(true);
    });
  });

  describe('Complete Resource Hierarchy', () => {
    it('should build a complete resource hierarchy as shown in PRD Section 6.5', async () => {
      // Step 1: Create the account (from PRD Section 6.5)
      const account = createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        attributes: { name: 'Acme Corporation' },
      });
      await putRecord(account);

      // Step 2: Create a job collection
      const jobCollection = createResource({
        resourceType: 'System.Account.JobCollection',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: { name: 'Engineering Jobs' },
      });
      await putRecord(jobCollection);

      // Step 3: Link account to job collection (parent-child)
      const accountCollectionLink = createParentChildRelationship({
        parentUrn: account.urn,
        childUrn: jobCollection.urn,
        accountUrn: account.urn,
      });
      await putRecord(accountCollectionLink as unknown as Record<string, unknown>);

      // Step 4: Create a job
      const job = createResource({
        resourceType: 'System.Account.JobCollection.Job',
        schemaVersion: 1,
        accountUrn: account.urn,
        attributes: {
          title: 'Senior Software Engineer',
          status: 'open',
        },
      });
      await putRecord(job);

      // Step 5: Add job to collection (collection-membership)
      const jobInCollection = createCollectionMembershipRelationship({
        collectionUrn: jobCollection.urn,
        memberUrn: job.urn,
        accountUrn: account.urn,
      });
      // Type assertion to satisfy generic Record<string, unknown> constraint
      await putRecord(jobInCollection as unknown as Record<string, unknown>);

      // Verify the complete hierarchy
      // 1. Account exists
      const retrievedAccount = await getRecord(account.PK, account.SK);
      expect(retrievedAccount).not.toBeNull();
      expect(retrievedAccount?._resourceType).toBe('System.Account');

      // 2. JobCollection exists
      const retrievedCollection = await getRecord(jobCollection.PK, jobCollection.SK);
      expect(retrievedCollection).not.toBeNull();
      expect(retrievedCollection?._resourceType).toBe('System.Account.JobCollection');

      // 3. Parent-child relationship exists
      const retrievedLink = await getRecord(accountCollectionLink.PK, accountCollectionLink.SK);
      expect(retrievedLink).not.toBeNull();
      expect(retrievedLink?._recordType).toBe('ParentChildRelationship');

      // 4. Job exists
      const retrievedJob = await getRecord(job.PK, job.SK);
      expect(retrievedJob).not.toBeNull();
      expect(retrievedJob?._resourceType).toBe('System.Account.JobCollection.Job');

      // 5. Collection-membership relationship exists
      const retrievedMembership = await getRecord(jobInCollection.PK, jobInCollection.SK);
      expect(retrievedMembership).not.toBeNull();
      expect(retrievedMembership?._recordType).toBe('CollectionMemberRelationship');

      // Verify we can query the hierarchy
      // Query all children of the account
      const accountChildren = await queryByPK(`Parent#${account.urn}`);
      expect(accountChildren.length).toBeGreaterThan(0);
      expect(
        accountChildren.some((child) => child.childUrn === jobCollection.urn)
      ).toBe(true);

      // Query all members of the collection
      const collectionMembers = await queryByPK(`Collection#${jobCollection.urn}`);
      expect(collectionMembers.length).toBeGreaterThan(0);
      expect(collectionMembers.some((member) => member.memberUrn === job.urn)).toBe(true);
    });
  });
});
