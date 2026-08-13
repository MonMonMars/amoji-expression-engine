import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 492 Extreme interactive bind helper', () => {
  it('defines bindDisneyExtremeFlashCopySurface and uses it for labels/empty/more', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('flash/copy surfaces · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function bindDisneyExtremeFlashCopySurface');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeFactorBarsLabel');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(moreSummary');
    expect(src).toContain("getElementById('disneyExtremeStripsEmpty')");
  });
});
