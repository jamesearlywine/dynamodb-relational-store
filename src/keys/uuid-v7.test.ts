/**
 * Unit tests for UUID v7 generation
 */

import { describe, it, expect } from 'vitest';
import { generateUuidV7 } from './uuid-v7';

describe('generateUuidV7', () => {
  it('should generate a valid UUID v7 format', () => {
    const uuid = generateUuidV7();
    const uuidV7Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidV7Pattern);
  });

  it('should generate UUIDs with version 7', () => {
    const uuid = generateUuidV7();
    const parts = uuid.split('-');
    expect(parts[2]).toMatch(/^7/);
  });

  it('should generate unique UUIDs', () => {
    const uuids = new Set();
    for (let i = 0; i < 100; i++) {
      uuids.add(generateUuidV7());
    }
    expect(uuids.size).toBe(100);
  });

  it('should generate time-ordered UUIDs', () => {
    const uuid1 = generateUuidV7();
    // Small delay to ensure different timestamp
    const delay = new Promise((resolve) => setTimeout(resolve, 1));
    return delay.then(() => {
      const uuid2 = generateUuidV7();
      // UUIDs should sort chronologically (string comparison works for UUID v7)
      expect(uuid1 < uuid2).toBe(true);
    });
  });

  it('should have correct variant bits', () => {
    const uuid = generateUuidV7();
    const parts = uuid.split('-');
    const variantPart = parts[3];
    const firstChar = variantPart[0].toLowerCase();
    // Variant should be 8, 9, a, or b
    expect(['8', '9', 'a', 'b']).toContain(firstChar);
  });
});

