/**
 * Unit tests for ParentChildRelationship factory
 */

import { describe, it, expect } from 'vitest';
import { createParentChildRelationship } from './parent-child-relationship-record';

describe('createParentChildRelationship', () => {
  it('should create parent-child relationship', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505',
      childUrn: 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
    });

    expect(relationship._recordType).toBe('ParentChildRelationship');
    expect(relationship.parentUrn).toBe('urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505');
    expect(relationship.childUrn).toBe('urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506');
    expect(relationship.PK).toBe('Parent#urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505');
    expect(relationship.SK).toBe('Child#urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506');
    expect(relationship._createdAt).toBeDefined();
  });

  it('should include accountUrn when provided', () => {
    const relationship = createParentChildRelationship({
      parentUrn: 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505',
      childUrn: 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
      accountUrn: 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509',
    });

    expect(relationship._accountUrn).toBe('urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509');
  });

  it('should throw error for invalid parent URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'invalid',
        childUrn: 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
      })
    ).toThrow('Invalid parent URN format');
  });

  it('should throw error for invalid child URN', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505',
        childUrn: 'invalid',
      })
    ).toThrow('Invalid child URN format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createParentChildRelationship({
        parentUrn: 'urn:pp:System::01955556-3cd2-7df2-b839-693fa6fbd505',
        childUrn: 'urn:pp:System.Account::01955557-3cd2-7df2-b839-693fa6fbd506',
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});
