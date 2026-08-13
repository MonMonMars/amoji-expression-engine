import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 502 Extreme history/favorites rows bind helper', () => {
  it('migrates history/favorites rows with backgroundOnly', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('history/favorites rows · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeHistory')");
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFavorites')");
    expect(src).not.toContain("getElementById('disneyExtremeFavorites')?.addEventListener('keydown'");
  });
});
