import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  hasDisneyExtremeBaselineStacks,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 270 Extreme Alt+W wipe stacks', () => {
  it('detects stacks, resolves Alt+W, and wires Face Live', () => {
    expect(hasDisneyExtremeBaselineStacks({})).toBe(false);
    expect(
      hasDisneyExtremeBaselineStacks({ historyDepth: 1 }),
    ).toBe(true);
    expect(
      hasDisneyExtremeBaselineStacks({ favoritesDepth: 2 }),
    ).toBe(true);
    expect(
      resolveDisneyExtremeHotkey({ key: 'w', altKey: true }).action,
    ).toBe('clearBaselineStacks');
    expect(resolveDisneyExtremeHotkey({ key: 'w' }).action).toBe(
      'clearBaselineRedo',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'w', shiftKey: true }).action,
    ).toBe('clearBaselineFavorites');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+W wipe stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeWipeStacks');
    expect(src).toContain('function clearDisneyExtremeBaselineStacksOnly');
    expect(src).toContain("resolved.action === 'clearBaselineStacks'");
    expect(src).toContain('wiped · stacks');
    expect(typeof engine.hasDisneyExtremeBaselineStacks).toBe('function');
  });
});
