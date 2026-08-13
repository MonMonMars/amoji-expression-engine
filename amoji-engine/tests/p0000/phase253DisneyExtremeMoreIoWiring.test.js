import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 253 Extreme Face Live More IO + compare/fav/share wiring', () => {
  it('wires overflow, redo share, chip compare, and favorites', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeMore"');
    expect(src).toContain('btnDisneyExtremeShareRedo');
    expect(src).toContain('btnDisneyExtremeStarFav');
    expect(src).toContain('btnDisneyExtremeFavList');
    expect(src).toContain('id="disneyExtremeFavorites"');
    expect(src).toContain('formatDisneyExtremeBaselineChipCompareLabel');
    expect(src).toContain('function copyDisneyExtremeBaselineRedoShareUrl');
    expect(src).toContain('function starDisneyExtremeBaselineFavorite');
    expect(src).toContain('function syncDisneyExtremeFavoritesUi');
    expect(src).toContain('applyDisneyExtremeBaselineRedoFromHash');
    expect(src).toContain("resolved.action === 'copyBaselineRedoShareUrl'");
    expect(src).toContain("resolved.action === 'starBaselineFavorite'");
    expect(src).toContain("resolved.action === 'showBaselineFavorites'");
    expect(src).toContain('ev.altKey && ev.shiftKey');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Y share redo');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('S star fav');
  });
});
