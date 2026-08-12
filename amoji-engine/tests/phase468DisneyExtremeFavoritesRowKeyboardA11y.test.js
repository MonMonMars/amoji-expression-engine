import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 468 Extreme favorites row keyboard accessibility', () => {
  it('wires Enter/Space list flash and Shift+Enter copy list for favorites row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('favorites row · Enter/Space list');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('favorites row · ⇧Enter copy list');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("getElementById('disneyExtremeFavorites')?.setAttribute('role', 'button')");
    expect(src).toContain("getElementById('disneyExtremeFavorites')?.addEventListener('keydown'");
    expect(src).toContain('flashDisneyExtremeBaselineFavoritesList();');
    expect(src).toContain('copyDisneyExtremeBaselineFavoritesList();');
    expect(src).toContain('Starred favorites');
  });
});
