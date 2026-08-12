import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_MORE_IO_STORAGE_KEY,
  saveDisneyExtremeMoreIoOpen,
  loadDisneyExtremeMoreIoOpen,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 281 Extreme More IO open persist', () => {
  it('persists open state and wires Face Live restore', () => {
    const mem = new Map();
    const storage = {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: (k) => mem.delete(k),
    };
    expect(loadDisneyExtremeMoreIoOpen({ storage })).toBe(false);
    expect(saveDisneyExtremeMoreIoOpen(true, { storage })).toEqual({
      ok: true,
      open: true,
    });
    expect(mem.get(DISNEY_EXTREME_MORE_IO_STORAGE_KEY)).toBe('1');
    expect(loadDisneyExtremeMoreIoOpen({ storage })).toBe(true);
    expect(saveDisneyExtremeMoreIoOpen(false, { storage })).toEqual({
      ok: true,
      open: false,
    });
    expect(mem.has(DISNEY_EXTREME_MORE_IO_STORAGE_KEY)).toBe(false);
    expect(loadDisneyExtremeMoreIoOpen({ storage })).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('More IO · remember open');
    expect(typeof engine.saveDisneyExtremeMoreIoOpen).toBe('function');
    expect(typeof engine.loadDisneyExtremeMoreIoOpen).toBe('function');
    expect(engine.DISNEY_EXTREME_MORE_IO_STORAGE_KEY).toBe(
      DISNEY_EXTREME_MORE_IO_STORAGE_KEY,
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('loadDisneyExtremeMoreIoOpen');
    expect(src).toContain('saveDisneyExtremeMoreIoOpen');
    expect(src).toContain('wireDisneyExtremeDetailsToggle(moreIo');
  });
});
