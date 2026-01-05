/**
 * Unit tests for Resource factory
 */

import { describe, it, expect } from 'vitest';
import { createResource } from './resource';

describe('createResource', () => {
  it('should create resource with auto-generated ID', () => {
    const resource = createResource({
      resourceType: 'System.Account',
      schemaVersion: 1,
    });

    expect(resource._recordType).toBe('Resource');
    expect(resource._resourceType).toBe('System.Account');
    expect(resource._schemaVersion).toBe(1);
    expect(resource.urn).toMatch(/^urn:pp:System\.Account::/);
    expect(resource.PK).toBe(`Resource#${resource.urn}`);
    expect(resource.SK).toBe(`Resource#${resource.urn}`);
    expect(resource._createdAt).toBeDefined();
    expect(resource._updatedAt).toBeDefined();
  });

  it('should create resource with provided ID', () => {
    const id = '01955556-3cd2-7df2-b839-693fa6fbd505';
    const resource = createResource({
      resourceType: 'System.Account',
      id,
      schemaVersion: 1,
    });

    expect(resource._id).toBe(id);
    expect(resource.urn).toBe(`urn:pp:System.Account::${id}`);
  });

  it('should include accountUrn when provided', () => {
    const accountUrn = 'urn:pp:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509';
    const resource = createResource({
      resourceType: 'System.Account',
      schemaVersion: 1,
      accountUrn,
    });

    expect(resource._accountUrn).toBe(accountUrn);
  });

  it('should merge additional attributes', () => {
    const resource = createResource({
      resourceType: 'System.Account',
      schemaVersion: 1,
      attributes: {
        name: 'My Account',
        description: 'Test account',
      },
    });

    expect((resource as { name?: string }).name).toBe('My Account');
    expect((resource as { description?: string }).description).toBe('Test account');
  });

  it('should throw error for empty resourceType', () => {
    expect(() =>
      createResource({
        resourceType: '',
        schemaVersion: 1,
      })
    ).toThrow('ResourceType cannot be empty');
  });

  it('should throw error for invalid schemaVersion', () => {
    expect(() =>
      createResource({
        resourceType: 'System.Account',
        schemaVersion: 0,
      })
    ).toThrow('SchemaVersion must be a positive number');
  });

  it('should throw error for invalid ID format', () => {
    expect(() =>
      createResource({
        resourceType: 'System.Account',
        id: 'invalid-uuid',
        schemaVersion: 1,
      })
    ).toThrow('Invalid ID format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createResource({
        resourceType: 'System.Account',
        schemaVersion: 1,
        accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

