import { describe, it, expect } from "vitest";
import { DynamoDBRecord } from "../dynamodb-record.type";
import { isCollectionMembershipRelationshipRecord } from "./collection-membership-relationship-record.typeguard";

const validUuidV7 = '01955556-3cd2-7df2-b839-693fa6fbd505';

describe('isCollectionMembershipRelationshipRecord', () => {
  it('should return true for CollectionMembershipRelationshipRecord', () => {
    const record: DynamoDBRecord = {
      PK: `Collection#urn:pp:System.Collection::${validUuidV7}`,
      SK: `Member#urn:pp:System.Account::${validUuidV7}`,
      _recordType: 'CollectionMemberRelationship',
      collectionUrn: `urn:pp:System.Collection::${validUuidV7}`,
      memberUrn: `urn:pp:System.Account::${validUuidV7}`,
      _createdAt: '2024-01-15T10:30:45.123Z',
      _accountUrn: `urn:pp:System.Account::${validUuidV7}`,
    };

    expect(isCollectionMembershipRelationshipRecord(record)).toBe(true);
    if (isCollectionMembershipRelationshipRecord(record)) {
      expect(record.collectionUrn).toBe(`urn:pp:System.Collection::${validUuidV7}`);
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

    expect(isCollectionMembershipRelationshipRecord(record)).toBe(false);
  });
});
