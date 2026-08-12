import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_STRIPS_FILTER_STORAGE_KEY,
  DISNEY_EXTREME_HOTKEY_HELP,
  saveDisneyExtremeStripsFilter,
  loadDisneyExtremeStripsFilter,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 424 Extreme persist strips filter', () => {
  it('saves and loads filter query in session storage', () => {
    /** @type {Map<string, string>} */
    const mem = new Map();
    const storage = {
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => {
        mem.set(k, String(v));
      },
      removeItem: (k) => {
        mem.delete(k);
      },
    };
    expect(saveDisneyExtremeStripsFilter('pin', { storage })).toEqual({
      ok: true,
      query: 'pin',
    });
    expect(mem.get(DISNEY_EXTREME_STRIPS_FILTER_STORAGE_KEY)).toBe('pin');
    expect(loadDisneyExtremeStripsFilter({ storage })).toBe('pin');
    expect(saveDisneyExtremeStripsFilter('', { storage })).toEqual({
      ok: true,
      query: '',
    });
    expect(mem.has(DISNEY_EXTREME_STRIPS_FILTER_STORAGE_KEY)).toBe(false);
    expect(loadDisneyExtremeStripsFilter({ storage })).toBe('');
    expect(typeof engine.saveDisneyExtremeStripsFilter).toBe('function');
    expect(typeof engine.loadDisneyExtremeStripsFilter).toBe('function');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter · remember query');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('saveDisneyExtremeStripsFilter');
    expect(src).toContain('loadDisneyExtremeStripsFilter');
    expect(src).toContain('function persistDisneyExtremeStripsFilter');
  });
});
