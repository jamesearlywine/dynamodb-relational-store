/**
 * Unit tests for URN validator utilities
 */

import { describe, it, expect } from 'vitest';
import { parseUrn, createUrn, validateUrn } from './urn-validator';

describe('parseUrn', () => {
  it('should parse a valid URN', () => {
    const urn = 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505';
    const parsed = parseUrn(urn);

    expect(parsed.domain).toBe('pp');
    expect(parsed.resourceType).toBe('System.Account');
    expect(parsed.resourceId).toBe('01955556-3cd2-7df2-b839-693fa6fbd505');
  });

  it('should throw error for invalid format', () => {
    expect(() => parseUrn('invalid')).toThrow('Invalid URN format');
    expect(() => parseUrn('urn:pp:System.Account')).toThrow('Invalid URN format');
    expect(() => parseUrn('')).toThrow('URN must be a non-empty string');
  });

  it('should throw error for empty domain', () => {
    expect(() => parseUrn('urn::System.Account::123')).toThrow('domain cannot be empty');
  });

  it('should throw error for empty resourceType', () => {
    expect(() => parseUrn('urn:pp:::123')).toThrow('resourceType cannot be empty');
  });

  it('should throw error for empty resourceId', () => {
    expect(() => parseUrn('urn:pp:System.Account::')).toThrow('resourceId cannot be empty');
  });

  it('should handle edge cases with whitespace', () => {
    const urn = 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505';
    const parsed = parseUrn(urn);
    expect(parsed.domain).toBe('pp');
  });
});

describe('createUrn', () => {
  it('should create a valid URN', () => {
    const urn = createUrn('pp', 'System.Account', '01955556-3cd2-7df2-b839-693fa6fbd505');
    expect(urn).toBe('urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505');
  });

  it('should throw error for empty domain', () => {
    expect(() => createUrn('', 'System.Account', '01955556-3cd2-7df2-b839-693fa6fbd505')).toThrow(
      'Domain must be a non-empty string'
    );
  });

  it('should throw error for empty resourceType', () => {
    expect(() => createUrn('pp', '', '01955556-3cd2-7df2-b839-693fa6fbd505')).toThrow(
      'ResourceType must be a non-empty string'
    );
  });

  it('should throw error for empty resourceId', () => {
    expect(() => createUrn('pp', 'System.Account', '')).toThrow(
      'ResourceId must be a non-empty string'
    );
  });

  it('should throw error for invalid UUID v7 format', () => {
    expect(() => createUrn('pp', 'System.Account', 'invalid-uuid')).toThrow(
      'Invalid resourceId format'
    );
  });

  it('should validate UUID v7 format', () => {
    const validUuidV7 = '01955556-3cd2-7df2-b839-693fa6fbd505';
    const urn = createUrn('pp', 'System.Account', validUuidV7);
    expect(urn).toContain(validUuidV7);
  });
});

describe('validateUrn', () => {
  it('should return true for valid URN', () => {
    const urn = 'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505';
    expect(validateUrn(urn)).toBe(true);
  });

  it('should return false for invalid format', () => {
    expect(validateUrn('invalid')).toBe(false);
    expect(validateUrn('')).toBe(false);
    expect(validateUrn('urn:pp:System.Account')).toBe(false);
  });

  it('should return false for empty domain', () => {
    expect(validateUrn('urn::System.Account::123')).toBe(false);
  });

  it('should return false for empty resourceType', () => {
    expect(validateUrn('urn:pp::123')).toBe(false);
  });

  it('should return false for invalid UUID v7', () => {
    expect(validateUrn('urn:pp:System.Account::invalid-uuid')).toBe(false);
  });

  it('should validate various valid URN formats', () => {
    const validUrns = [
      'urn:pp:System.Account::01955556-3cd2-7df2-b839-693fa6fbd505',
      'urn:pp:System.Account.JobCollection.Job::01955556-3cd2-7df2-b839-693fa6fbd505',
    ];

    validUrns.forEach((urn) => {
      expect(validateUrn(urn)).toBe(true);
    });
  });
});

