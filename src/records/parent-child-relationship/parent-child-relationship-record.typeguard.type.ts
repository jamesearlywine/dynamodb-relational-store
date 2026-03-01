import { describe, it, expect } from "vitest";
import { DynamoDBRecord } from "../dynamodb-record.type";
import { isParentChildRelationshipRecord } from "./parent-child-relationship-record.typeguard";

const validUuidV7 = '01955556-3cd2-7df2-b839-693fa6fbd505';

describe('isParentChildRelationshipRecord', () => {
  it('should return true for ParentChildRelationshipRecord', () => {
    const record: DynamoDBRecord = {
      PK: `Parent#urn:pp:System::${validUuidV7}`,
      SK: `Child#urn:pp:System.Account::${validUuidV7}`,
      _recordType: 'ParentChildRelationship',
      parentUrn: `urn:pp:System::${validUuidV7}`,
      childUrn: `urn:pp:System.Account::${validUuidV7}`,
      _createdAt: '2024-01-15T10:30:45.123Z',
    };

    expect(isParentChildRelationshipRecord(record)).toBe(true);
    if (isParentChildRelationshipRecord(record)) {
      expect(record.parentUrn).toBe(`urn:pp:System::${validUuidV7}`);
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

    expect(isParentChildRelationshipRecord(record)).toBe(false);
  });
});
