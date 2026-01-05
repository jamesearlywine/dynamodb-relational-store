/**
 * Unit tests for key generation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generateResourceKey,
  generateParentChildKey,
  generateCollectionMemberKey,
  generateUniqueKeyValueKey,
  generateInvertedIndexKey,
  generateAccountIndexKey,
} from './key-generation';
import type { ResourceRecord, ParentChildRelationshipRecord } from '../types/record-types';

describe('generateResourceKey', () => {
  it('should generate correct key format', () => {
    const urn = 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505';
    const key = generateResourceKey(urn);

    expect(key.PK).toBe(`Resource#${urn}`);
    expect(key.SK).toBe(`Resource#${urn}`);
  });

  it('should throw error for invalid URN', () => {
    expect(() => generateResourceKey('invalid')).toThrow('Invalid URN format');
  });
});

describe('generateParentChildKey', () => {
  it('should generate correct key format', () => {
    const parentUrn = 'urn:pp:System::parent-id';
    const childUrn = 'urn:pp:System.Account::child-id';
    const key = generateParentChildKey(parentUrn, childUrn);

    expect(key.PK).toBe(`Parent#${parentUrn}`);
    expect(key.SK).toBe(`Child#${childUrn}`);
  });

  it('should throw error for invalid parent URN', () => {
    expect(() => generateParentChildKey('invalid', 'urn:pp:System.Account::child-id')).toThrow(
      'Invalid parent URN format'
    );
  });

  it('should throw error for invalid child URN', () => {
    expect(() => generateParentChildKey('urn:pp:System::parent-id', 'invalid')).toThrow(
      'Invalid child URN format'
    );
  });
});

describe('generateCollectionMemberKey', () => {
  it('should generate correct key format', () => {
    const collectionUrn = 'urn:pp:System.Collection::collection-id';
    const memberUrn = 'urn:pp:System.Account::member-id';
    const key = generateCollectionMemberKey(collectionUrn, memberUrn);

    expect(key.PK).toBe(`Collection#${collectionUrn}`);
    expect(key.SK).toBe(`Member#${memberUrn}`);
  });

  it('should throw error for invalid collection URN', () => {
    expect(() => generateCollectionMemberKey('invalid', 'urn:pp:System.Account::member-id')).toThrow(
      'Invalid collection URN format'
    );
  });

  it('should throw error for invalid member URN', () => {
    expect(() => generateCollectionMemberKey('urn:pp:System.Collection::collection-id', 'invalid')).toThrow(
      'Invalid member URN format'
    );
  });
});

describe('generateUniqueKeyValueKey', () => {
  it('should generate correct key format', () => {
    const key = generateUniqueKeyValueKey('System.User', 'emailAddress', 'user@example.com');

    expect(key.PK).toBe('UniqueKeyValue#System.User#emailAddress#user@example.com');
    expect(key.SK).toBe('UniqueKeyValue#System.User#emailAddress');
  });

  it('should throw error for empty resourceType', () => {
    expect(() => generateUniqueKeyValueKey('', 'key', 'value')).toThrow('ResourceType cannot be empty');
  });

  it('should throw error for empty key', () => {
    expect(() => generateUniqueKeyValueKey('System.User', '', 'value')).toThrow('Key cannot be empty');
  });

  it('should throw error for empty value', () => {
    expect(() => generateUniqueKeyValueKey('System.User', 'key', '')).toThrow('Value cannot be empty');
  });
});

describe('generateInvertedIndexKey', () => {
  it('should generate inverted key from ResourceRecord', () => {
    const record: ResourceRecord = {
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

    const invertedKey = generateInvertedIndexKey(record);

    expect(invertedKey.GSI1PK).toBe(record.SK);
    expect(invertedKey.GSI1SK).toBe(record.PK);
  });

  it('should generate inverted key from ParentChildRelationshipRecord', () => {
    const record: ParentChildRelationshipRecord = {
      PK: 'Parent#urn:pp:System::parent',
      SK: 'Child#urn:pp:System.Account::child',
      _recordType: 'ParentChildRelationship',
      parentUrn: 'urn:pp:System::parent',
      childUrn: 'urn:pp:System.Account::child',
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    const invertedKey = generateInvertedIndexKey(record);

    expect(invertedKey.GSI1PK).toBe(record.SK);
    expect(invertedKey.GSI1SK).toBe(record.PK);
  });
});

describe('generateAccountIndexKey', () => {
  it('should generate correct key format', () => {
    const accountUrn = 'urn:pp:System.Account::account-id';
    const urn = 'urn:pp:System.Account.Job::job-id';
    const key = generateAccountIndexKey(accountUrn, urn);

    expect(key.GSI2PK).toBe(accountUrn);
    expect(key.GSI2SK).toBe(urn);
  });

  it('should throw error for invalid account URN', () => {
    expect(() => generateAccountIndexKey('invalid', 'urn:pp:System.Account::urn')).toThrow(
      'Invalid account URN format'
    );
  });

  it('should throw error for invalid URN', () => {
    expect(() => generateAccountIndexKey('urn:pp:System.Account::account', 'invalid')).toThrow(
      'Invalid URN format'
    );
  });
});

