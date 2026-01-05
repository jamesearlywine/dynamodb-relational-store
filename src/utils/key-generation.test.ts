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
    const parentUrn = 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505';
    const childUrn = 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506';
    const key = generateParentChildKey(parentUrn, childUrn);

    expect(key.PK).toBe(`Parent#${parentUrn}`);
    expect(key.SK).toBe(`Child#${childUrn}`);
  });

  it('should throw error for invalid parent URN', () => {
    expect(() => generateParentChildKey('invalid', 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506')).toThrow(
      'Invalid parent URN format'
    );
  });

  it('should throw error for invalid child URN', () => {
    expect(() => generateParentChildKey('urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505', 'invalid')).toThrow(
      'Invalid child URN format'
    );
  });
});

describe('generateCollectionMemberKey', () => {
  it('should generate correct key format', () => {
    const collectionUrn = 'urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507';
    const memberUrn = 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508';
    const key = generateCollectionMemberKey(collectionUrn, memberUrn);

    expect(key.PK).toBe(`Collection#${collectionUrn}`);
    expect(key.SK).toBe(`Member#${memberUrn}`);
  });

  it('should throw error for invalid collection URN', () => {
    expect(() => generateCollectionMemberKey('invalid', 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508')).toThrow(
      'Invalid collection URN format'
    );
  });

  it('should throw error for invalid member URN', () => {
    expect(() => generateCollectionMemberKey('urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507', 'invalid')).toThrow(
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
    const urn = 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505';
    const record: ResourceRecord = {
      PK: `Resource#${urn}`,
      SK: `Resource#${urn}`,
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: '01955556-3cd2-7df2-b839-693fa6fbd505',
      urn,
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    const invertedKey = generateInvertedIndexKey(record);

    expect(invertedKey.GSI1PK).toBe(record.SK);
    expect(invertedKey.GSI1SK).toBe(record.PK);
  });

  it('should generate inverted key from ParentChildRelationshipRecord', () => {
    const parentUrn = 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505';
    const childUrn = 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506';
    const record: ParentChildRelationshipRecord = {
      PK: `Parent#${parentUrn}`,
      SK: `Child#${childUrn}`,
      _recordType: 'ParentChildRelationship',
      parentUrn,
      childUrn,
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    const invertedKey = generateInvertedIndexKey(record);

    expect(invertedKey.GSI1PK).toBe(record.SK);
    expect(invertedKey.GSI1SK).toBe(record.PK);
  });
});

describe('generateAccountIndexKey', () => {
  it('should generate correct key format', () => {
    const accountUrn = 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509';
    const urn = 'urn:pp:System.Account.Job::0195555d-3cd2-7df2-b839-693fa6fbd50c';
    const key = generateAccountIndexKey(accountUrn, urn);

    expect(key.GSI2PK).toBe(accountUrn);
    expect(key.GSI2SK).toBe(urn);
  });

  it('should throw error for invalid account URN', () => {
    expect(() => generateAccountIndexKey('invalid', 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505')).toThrow(
      'Invalid account URN format'
    );
  });

  it('should throw error for invalid URN', () => {
    expect(() => generateAccountIndexKey('urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509', 'invalid')).toThrow(
      'Invalid URN format'
    );
  });
});

