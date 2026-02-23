/**
 * Unit tests for Resource factory
 */

import { describe, it, expect } from 'vitest';
import { createResource } from './resource';

describe('createResource', () => {
  it('should create resource with auto-generated ID', () => {
    const resource = createResource({
      _resourceType: 'System.Account',
      _schemaVersion: 1,
    });

    expect(resource._recordType).toBe('Resource');
    expect(resource._resourceType).toBe('System.Account');
    expect(resource._schemaVersion).toBe(1);
    expect(resource.urn).toMatch(/^urn:processproof:System\.Account::/);
    expect(resource.PK).toBe(`Resource#${resource.urn}`);
    expect(resource.SK).toBe(`Resource#${resource.urn}`);
    expect(resource._createdAt).toBeDefined();
    expect(resource._updatedAt).toBeDefined();
  });

  it('should create resource with provided ID', () => {
    const _id = '01955556-3cd2-7df2-b839-693fa6fbd505';
    const resource = createResource({
      _resourceType: 'System.Account',
      _id,
      _schemaVersion: 1,
    });

    expect(resource._id).toBe(id);
    expect(resource.urn).toBe(`urn:processproof:System.Account::${id}`);
  });

  it('should include accountUrn when provided', () => {
    const accountUrn = 'urn:processproof:System.Account::0195555a-3cd2-7df2-b839-693fa6fbd509';
    const resource = createResource({
      _resourceType: 'System.Account',
      _schemaVersion: 1,
      _accountUrn: accountUrn,
    });

    expect(resource._accountUrn).toBe(accountUrn);
  });

  it('should merge additional attributes', () => {
    const resource = createResource({
      _resourceType: 'System.Account',
      _schemaVersion: 1,
      _attributes: {
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
        _resourceType: '',
        _schemaVersion: 1,
      })
    ).toThrow('ResourceType cannot be empty');
  });

  it('should throw error for invalid schemaVersion', () => {
    expect(() =>
      createResource({
        _resourceType: 'System.Account',
        _schemaVersion: 0,
      })
    ).toThrow('SchemaVersion must be a positive number');
  });

  it('should throw error for invalid ID format', () => {
    expect(() =>
      createResource({
        _resourceType: 'System.Account',
        _id: 'invalid-uuid',
        _schemaVersion: 1,
      })
    ).toThrow('Invalid ID format');
  });

  it('should throw error for invalid accountUrn', () => {
    expect(() =>
      createResource({
        _resourceType: 'System.Account',
        _schemaVersion: 1,
        _accountUrn: 'invalid',
      })
    ).toThrow('Invalid accountUrn format');
  });
});

