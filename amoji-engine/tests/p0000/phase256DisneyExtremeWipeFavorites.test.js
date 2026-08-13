import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  hasDisneyExtremeBaselineFavorites,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 256 Extreme Shift+W wipe favorites', () => {
  it('resolves Shift+W wipe favs and wires Face Live', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'w', shiftKey: true }).action,
    ).toBe('clearBaselineFavorites');
    expect(resolveDisneyExtremeHotkey({ key: 'w' }).action).toBe(
      'clearBaselineRedo',
    );
    expect(hasDisneyExtremeBaselineFavorites({ favorites: [] })).toBe(false);
    expect(hasDisneyExtremeBaselineFavorites({ favoritesDepth: 1 })).toBe(
      true,
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+W wipe favs');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function clearDisneyExtremeBaselineFavoritesOnly');
    expect(src).toContain('btnDisneyExtremeWipeFav');
    expect(src).toContain("resolved.action === 'clearBaselineFavorites'");
    expect(src).toContain('wiped · fav');
    expect(typeof engine.hasDisneyExtremeBaselineFavorites).toBe('function');
  });
});
