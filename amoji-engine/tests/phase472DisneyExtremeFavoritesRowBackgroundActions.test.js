import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 472 Extreme favorites row background actions', () => {
  it('supports background click/dblclick with target guard for favorites row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('favorites row · background click list');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('favorites row · background dbl-click copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFavorites')");
    expect(src).toContain('backgroundOnly: true');
    expect(src).toContain('flashDisneyExtremeBaselineFavoritesList();');
    expect(src).toContain('copyDisneyExtremeBaselineFavoritesList();');
  });
});
