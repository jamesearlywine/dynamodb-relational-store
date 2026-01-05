/**
 * Unit tests for Relationship factories
 */

import { describe, it, expect } from 'vitest';
import {
  createParentChildRelationship,
  createCollectionMembershipRelationship,
} from './relationships';

describe('createParentChildRelationship', () => {
  it('should create parent-child relationship', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:pp:System::parent-id',
      childUrn: 'urn:pp:System.Account::child-id',
    });

    expect(relationship._recordType).toBe('ParentChildRelationship');
    expect(relationship.parentUrn).toBe('urn:pp:System::parent-id');
    expect(relationship.childUrn).toBe('urn:pp:System.Account::child-id');
    expect(relationship.PK).toBe('Parent#urn:pp:System::parent-id');
    expect(relationship.SK).toBe('Child#urn:pp:System.Account::child-id');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should include accountUrn when provided', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:pp:System::parent-id',
      childUrn: 'urn:pp:System.Account::child-id',
      accountUrn: 'urn:pp:System.Account::account-id',
    });

    expect(relationship._accountUrn).toBe('urn:pp:System.Account::account-id');
  });

  it('should throw error for invalid parent URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'invalid',
        childUrn: 'urn:pp:System.Account::child-id',
      })
    ).toThrow('Invalid parent URN format');
  });

  it('should throw error for invalid child URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:pp:System::parent-id',
        childUrn: 'invalid',
      })
    ).toThrow('Invalid child URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:pp:System::parent-id',
        childUrn: 'urn:pp:System.Account::child-id',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

describe('createCollectionMembershipRelationship', () => {
  it('should create collection-membership relationship', () => {
    const relationship = createCollectionMembershipRelationship({
      collectionUrn: 'urn:pp:System.Collection::collection-id',
      memberUrn: 'urn:pp:System.Account::member-id',
      accountUrn: 'urn:pp:System.Account::account-id',
    });

    expect(relationship._recordType).toBe('CollectionMemberRelationship');
    expect(relationship.collectionUrn).toBe('urn:pp:System.Collection::collection-id');
    expect(relationship.memberUrn).toBe('urn:pp:System.Account::member-id');
    expect(relationship._accountUrn).toBe('urn:pp:System.Account::account-id');
    expect(relationship.PK).toBe('Collection#urn:pp:System.Collection::collection-id');
    expect(relationship.SK).toBe('Member#urn:pp:System.Account::member-id');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should throw error when accountUrn is missing', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::collection-id',
        memberUrn: 'urn:pp:System.Account::member-id',
        accountUrn: '',
      })
    ).toThrow('AccountUrn is required');
  });

  it('should throw error for invalid collection URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'invalid',
        memberUrn: 'urn:pp:System.Account::member-id',
        accountUrn: 'urn:pp:System.Account::account-id',
      })
    ).toThrow('Invalid collection URN format');
  });

  it('should throw error for invalid member URN', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::collection-id',
        memberUrn: 'invalid',
        accountUrn: 'urn:pp:System.Account::account-id',
      })
    ).toThrow('Invalid member URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createCollectionMembershipRelationship({
        collectionUrn: 'urn:pp:System.Collection::collection-id',
        memberUrn: 'urn:pp:System.Account::member-id',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

