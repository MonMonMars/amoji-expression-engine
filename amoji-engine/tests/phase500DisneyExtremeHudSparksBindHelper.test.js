import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 500 Extreme HUD sparks bind helper', () => {
  it('migrates HUD sparks/pill with ignoreChildTargets', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD sparks/pill · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('ignoreChildTargets');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(pillExtreme');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudExtremeSpark');
  });
});
