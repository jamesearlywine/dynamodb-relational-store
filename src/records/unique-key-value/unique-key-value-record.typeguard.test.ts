import { describe, it, expect } from "vitest";
import { DynamoDBRecord } from "../dynamodb-record.type";
import { isUniqueKeyValueRecord } from "./unique-key-value-record.typeguard";

const validUuidV7 = '01955556-3cd2-7df2-b839-693fa6fbd505';

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
      PK: `Resource#urn:pp:System.Account::${validUuidV7}`,
      SK: `Resource#urn:pp:System.Account::${validUuidV7}`,
      _recordType: 'Resource',
      _resourceType: 'System.Account',
      _id: validUuidV7,
      _urn: `urn:pp:System.Account::${validUuidV7}`,
      _schemaVersion: 1,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _updatedAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isUniqueKeyValueRecord(record)).toBe(false);
  });
});

