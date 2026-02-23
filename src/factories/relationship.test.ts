/**
 * Unit tests for Relationship factories
 */

import { describe, it, expect } from 'vitest';
import {
  createParentChildRelationship,
  createCollectionMembershipRelationship,
} from './relationship';

describe('createParentChildRelationship', () => {
  it('should create parent-child relationship', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505',
      childUrn: 'urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
    });

    expect(relationship._recordType).toBe('ParentChildRelationship');
    expect(relationship.parentUrn).toBe('urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505');
    expect(relationship.childUrn).toBe('urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506');
    expect(relationship.PK).toBe('Parent#urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505');
    expect(relationship.SK).toBe('Child#urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should include accountUrn when provided', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505',
      childUrn: 'urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
      accountUrn: 'urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
    });

    expect(relationship._accountUrn).toBe('urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509');
  });

  it('should throw error for invalid parent URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'invalid',
        childUrn: 'urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
      })
    ).toThrow('Invalid parent URN format');
  });

  it('should throw error for invalid child URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505',
        childUrn: 'invalid',
      })
    ).toThrow('Invalid child URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:processproof:System::01955556-3cd2-7df2-b839-693fa6fbd505',
        childUrn: 'urn:processproof:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

describe('createCollectionMembershipRelationship', () => {
  it('should create collection-membership relationship', () => {
    const relationship = createCollectionMembershipRelationship({
      collectionUrn: 'urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
      memberUrn: 'urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
      accountUrn: 'urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
    });

    expect(relationship._recordType).toBe('CollectionMemberRelationship');
    expect(relationship.collectionUrn).toBe('urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507');
    expect(relationship.memberUrn).toBe('urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508');
    expect(relationship._accountUrn).toBe('urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509');
    expect(relationship.PK).toBe('Collection#urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507');
    expect(relationship.SK).toBe('Member#urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should throw error when accountUrn is missing', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: '',
      })
    ).toThrow('AccountUrn is required');
  });

  it('should throw error for invalid collection URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'invalid',
        memberUrn: 'urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: 'urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
      })
    ).toThrow('Invalid collection URN format');
  });

  it('should throw error for invalid member URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'invalid',
        accountUrn: 'urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
      })
    ).toThrow('Invalid member URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:processproof:System.Collection::01955558-3cd2-7df2-b839-693fa6fbd507',
        memberUrn: 'urn:processproof:System.Account::01955559-3cd2-7df2-b839-693fa6fbd508',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

