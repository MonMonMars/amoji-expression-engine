import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 499 Extreme panel sparks bind helper', () => {
  it('migrates panel sparks to bind helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('panel sparks · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeFactorBars');
    expect(src).not.toContain('disneyExtremeEaseSpark?.addEventListener(\'keydown\'');
  });
});
