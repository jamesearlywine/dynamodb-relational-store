/**
 * Unit tests for type guard functions
 */

import { describe, it, expect } from 'vitest';
import {
  isResourceRecord,
  isParentChildRelationshipRecord,
  isCollectionMembershipRelationshipRecord,
  isUniqueKeyValueRecord,
} from './type-guards';
import type { DynamoDBRecord } from '../types/record-types';

describe('isResourceRecord', () => {
  it('should return true for ResourceRecord', () => {
    const record: DynamoDBRecord = {
      PK: 'Resource#urn:pp:System.Account::123',
      SK: 'Resource#urn:pp:System.Account::123',
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: '123',
      urn: 'urn:pp:System.Account::123',
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isResourceRecord(record)).toBe(true);
    if (isResourceRecord(record)) {
      // TypeScript should narrow the type here
      expect(record._resourceType).toBe('System.Account');
    }
  });

  it('should return false for other record types', () => {
    const record: DynamoDBRecord = {
      PK: 'Parent#urn:pp:System::parent',
      SK: 'Child#urn:pp:System.Account::child',
      _recordType: 'ParentChildRelationship',
      parentUrn: 'urn:pp:System::parent',
      childUrn: 'urn:pp:System.Account::child',
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isResourceRecord(record)).toBe(false);
  });
});

describe('isParentChildRelationshipRecord', () => {
  it('should return true for ParentChildRelationshipRecord', () => {
    const record: DynamoDBRecord = {
      PK: 'Parent#urn:pp:System::parent',
      SK: 'Child#urn:pp:System.Account::child',
      _recordType: 'ParentChildRelationship',
      parentUrn: 'urn:pp:System::parent',
      childUrn: 'urn:pp:System.Account::child',
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isParentChildRelationshipRecord(record)).toBe(true);
    if (isParentChildRelationshipRecord(record)) {
      expect(record.parentUrn).toBe('urn:pp:System::parent');
    }
  });

  it('should return false for other record types', () => {
    const record: DynamoDBRecord = {
      PK: 'Resource#urn:pp:System.Account::123',
      SK: 'Resource#urn:pp:System.Account::123',
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: '123',
      urn: 'urn:pp:System.Account::123',
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isParentChildRelationshipRecord(record)).toBe(false);
  });
});

describe('isCollectionMembershipRelationshipRecord', () => {
  it('should return true for CollectionMembershipRelationshipRecord', () => {
    const record: DynamoDBRecord = {
      PK: 'Collection#urn:pp:System.Collection::collection',
      SK: 'Member#urn:pp:System.Account::member',
      _recordType: 'CollectionMemberRelationship',
      collectionUrn: 'urn:pp:System.Collection::collection',
      memberUrn: 'urn:pp:System.Account::member',
      _createdAt: '2024-01-15T10:30:45.123Z',
      _accountUrn: 'urn:pp:System.Account::account',
    };

    expect(isCollectionMembershipRelationshipRecord(record)).toBe(true);
    if (isCollectionMembershipRelationshipRecord(record)) {
      expect(record.collectionUrn).toBe('urn:pp:System.Collection::collection');
    }
  });

  it('should return false for other record types', () => {
    const record: DynamoDBRecord = {
      PK: 'Resource#urn:pp:System.Account::123',
      SK: 'Resource#urn:pp:System.Account::123',
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: '123',
      urn: 'urn:pp:System.Account::123',
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isCollectionMembershipRelationshipRecord(record)).toBe(false);
  });
});

describe('isUniqueKeyValueRecord', () => {
  it('should return true for UniqueKeyValueRecord', () => {
    const record: DynamoDBRecord = {
      PK: 'UniqueKeyValue#System.User#emailAddress#user@example.com',
      SK: 'UniqueKeyValue#System.User#emailAddress',
      _recordType: 'UniqueKeyValue',
      _resourceType: 'System.User',
      key: 'emailAddress',
      value: 'user@example.com',
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isUniqueKeyValueRecord(record)).toBe(true);
    if (isUniqueKeyValueRecord(record)) {
      expect(record.key).toBe('emailAddress');
    }
  });

  it('should return false for other record types', () => {
    const record: DynamoDBRecord = {
      PK: 'Resource#urn:pp:System.Account::123',
      SK: 'Resource#urn:pp:System.Account::123',
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: '123',
      urn: 'urn:pp:System.Account::123',
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isUniqueKeyValueRecord(record)).toBe(false);
  });
});

