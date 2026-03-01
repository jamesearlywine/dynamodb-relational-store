/**
 * Unit tests for CollectionMembershipRelationship factory
 */

import { describe, it, expect } from 'vitest';
import { createCollectionMembershipRelationship } from './collection-membership-relationship-record';

describe('createCollectionMembershipRelationship', () => {
  it('should create collection-membership relationship', () => {
    const relationship = createCollectionMembershipRelationship({
      collectionUrn: 'urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
      memberUrn: 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
      accountUrn: 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
    });

    expect(relationship._recordType).toBe('CollectionMemberRelationship');
    expect(relationship.collectionUrn).toBe('urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507');
    expect(relationship.memberUrn).toBe('urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508');
    expect(relationship._accountUrn).toBe('urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509');
    expect(relationship.PK).toBe('Collection#urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507');
    expect(relationship.SK).toBe('Member#urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should throw error when accountUrn is missing', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: '',
      })
    ).toThrow('AccountUrn is required');
  });

  it('should throw error for invalid collection URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'invalid',
        memberUrn: 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
      })
    ).toThrow('Invalid collection URN format');
  });

  it('should throw error for invalid member URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'invalid',
        accountUrn: 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
      })
    ).toThrow('Invalid member URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'urn:pp:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});
