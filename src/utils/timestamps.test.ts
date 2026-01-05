/**
 * Unit tests for timestamp utilities
 */

import { describe, it, expect } from 'vitest';
import { getCurrentTimestamp, isValidIso8601 } from './timestamps';

describe('getCurrentTimestamp', () => {
  it('should return ISO-8601 format timestamp', () => {
    const timestamp = getCurrentTimestamp();
    expect(isValidIso8601(timestamp)).toBe(true);
  });

  it('should return timestamp with Z timezone', () => {
    const timestamp = getCurrentTimestamp();
    expect(timestamp).toMatch(/Z$/);
  });

  it('should return timestamp in correct format', () => {
    const timestamp = getCurrentTimestamp();
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(timestamp).toMatch(iso8601Pattern);
  });

  it('should be timezone-aware', () => {
    const timestamp = getCurrentTimestamp();
    const date = new Date(timestamp);
    expect(date.toISOString()).toBe(timestamp);
  });
});

describe('isValidIso8601', () => {
  it('should return true for valid ISO-8601 with milliseconds and Z', () => {
    expect(isValidIso8601('2024-01-15T10:30:45.123Z')).toBe(true);
  });

  it('should return true for valid ISO-8601 without milliseconds', () => {
    expect(isValidIso8601('2024-01-15T10:30:45Z')).toBe(true);
  });

  it('should return true for valid ISO-8601 with timezone offset', () => {
    expect(isValidIso8601('2024-01-15T10:30:45+05:00')).toBe(true);
    expect(isValidIso8601('2024-01-15T10:30:45-05:00')).toBe(true);
  });

  it('should return false for invalid format', () => {
    expect(isValidIso8601('invalid')).toBe(false);
    expect(isValidIso8601('2024-01-15')).toBe(false);
    expect(isValidIso8601('10:30:45')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidIso8601('')).toBe(false);
  });

  it('should return false for invalid date', () => {
    expect(isValidIso8601('2024-13-45T25:70:99.999Z')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(isValidIso8601('2024-01-15T00:00:00.000Z')).toBe(true);
    expect(isValidIso8601('2024-12-31T23:59:59.999Z')).toBe(true);
  });
});

