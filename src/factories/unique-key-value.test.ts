/**
 * Unit tests for UniqueKeyValue factory
 */

import { describe, it, expect } from 'vitest';
import { createUniqueKeyValue } from './unique-key-value';

describe('createUniqueKeyValue', () => {
  it('should create unique key value record', () => {
    const record = createUniqueKeyValue({
      resourceType: 'System.User',
      key: 'emailAddress',
      value: 'user@example.com',
    });

    expect(record._recordType).toBe('UniqueKeyValue');
    expect(record._resourceType).toBe('System.User');
    expect(record.key).toBe('emailAddress');
    expect(record.value).toBe('user@example.com');
    expect(record.PK).toBe('UniqueKeyValue#System.User#emailAddress#user@example.com');
    expect(record.SK).toBe('UniqueKeyValue#System.User#emailAddress');
    expect(record._createdAt).toBeDefined();
    expect(record._updatedAt).toBeDefined();
  });

  it('should include associatedRecordUrn when provided', () => {
    const record = createUniqueKeyValue({
      resourceType: 'System.User',
      key: 'emailAddress',
      value: 'user@example.com',
      associatedRecordUrn: 'urn:pp:System.User::01955556-3cd2-7df2-b839-693fa6fbd505',
    });

    expect(record.associatedRecordUrn).toBe('urn:pp:System.User::01955556-3cd2-7df2-b839-693fa6fbd505');
  });

  it('should handle special characters in key and value', () => {
    const record = createUniqueKeyValue({
      resourceType: 'System.User',
      key: 'email.address',
      value: 'user+tag@example.com',
    });

    expect(record.PK).toBe('UniqueKeyValue#System.User#email.address#user+tag@example.com');
    expect(record.SK).toBe('UniqueKeyValue#System.User#email.address');
  });

  it('should throw error for empty resourceType', () => {
    expect(() =>
      createUniqueKeyValue({
        resourceType: '',
        key: 'key',
        value: 'value',
      })
    ).toThrow('ResourceType cannot be empty');
  });

  it('should throw error for empty key', () => {
    expect(() =>
      createUniqueKeyValue({
        resourceType: 'System.User',
        key: '',
        value: 'value',
      })
    ).toThrow('Key cannot be empty');
  });

  it('should throw error for empty value', () => {
    expect(() =>
      createUniqueKeyValue({
        resourceType: 'System.User',
        key: 'key',
        value: '',
      })
    ).toThrow('Value cannot be empty');
  });

  it('should throw error for invalid associatedRecordUrn', () => {
    expect(() =>
      createUniqueKeyValue({
        resourceType: 'System.User',
        key: 'emailAddress',
        value: 'user@example.com',
        associatedRecordUrn: 'invalid',
      })
    ).toThrow('Invalid associatedRecordUrn format');
  });
});

