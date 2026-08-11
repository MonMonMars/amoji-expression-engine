import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_STRIPS_STORAGE_KEY,
  saveDisneyExtremeStripsOpen,
  loadDisneyExtremeStripsOpen,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 367 Extreme strips open persistence', () => {
  it('persists strips open state and wires Face Live restore', () => {
    const mem = new Map();
    const storage = {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => {
        mem.set(k, String(v));
      },
      removeItem: (k) => {
        mem.delete(k);
      },
    };
    expect(saveDisneyExtremeStripsOpen(true, { storage })).toEqual({
      ok: true,
      open: true,
    });
    expect(mem.get(DISNEY_EXTREME_STRIPS_STORAGE_KEY)).toBe('1');
    expect(loadDisneyExtremeStripsOpen({ storage })).toBe(true);
    expect(saveDisneyExtremeStripsOpen(false, { storage })).toEqual({
      ok: true,
      open: false,
    });
    expect(mem.has(DISNEY_EXTREME_STRIPS_STORAGE_KEY)).toBe(false);
    expect(loadDisneyExtremeStripsOpen({ storage })).toBe(false);
    expect(typeof engine.saveDisneyExtremeStripsOpen).toBe('function');
    expect(typeof engine.loadDisneyExtremeStripsOpen).toBe('function');
    expect(engine.DISNEY_EXTREME_STRIPS_STORAGE_KEY).toBe(
      DISNEY_EXTREME_STRIPS_STORAGE_KEY,
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('saveDisneyExtremeStripsOpen');
    expect(src).toContain('loadDisneyExtremeStripsOpen');
  });
});
