import { describe, expect, it } from "vitest";
import { DynamoDBRecord } from "../dynamodb-record.type";
import { isResourceRecord } from "./resource-record.typeguard";

const validUuidV7 = '01955556-3cd2-7df2-b839-693fa6fbd505';

describe('isResourceRecord', () => {
  it('should return true for ResourceRecord', () => {
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

    expect(isResourceRecord(record)).toBe(true);
    if (isResourceRecord(record)) {
      expect(record._resourceType).toBe('System.Account');
    }
  });

  it('should return false for other record types', () => {
    const record: DynamoDBRecord = {
      PK: `Parent#urn:pp:System::${validUuidV7}`,
      SK: `Child#urn:pp:System.Account::${validUuidV7}`,
      _recordType: 'ParentChildRelationship',
      parentUrn: `urn:pp:System::${validUuidV7}`,
      childUrn: `urn:pp:System.Account::${validUuidV7}`,
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isResourceRecord(record)).toBe(false);
  });
});

