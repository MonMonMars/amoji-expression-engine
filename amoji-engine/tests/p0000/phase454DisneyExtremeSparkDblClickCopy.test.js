import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 454 Extreme spark dbl-click copy', () => {
  it('wires panel/HUD spark dbl-click to copy SVG', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('sparks · dbl-click copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeEaseSpark');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeBodySpark');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeFactorBars');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudExtremeSpark');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudExtremeFactors');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudBodySpark');
    expect(src).toContain('copyDisneyExtremeEaseSvg();');
    expect(src).toContain('copyDisneyExtremeBodyMixSvg();');
    expect(src).toContain('copyDisneyExtremeFactorBarsSvg();');
    expect(src).toContain('dbl-click copy');
  });
});
