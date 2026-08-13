import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 459 Extreme spark Shift+Enter copy', () => {
  it('supports Shift+Enter copy on panel/HUD spark key handlers', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('sparks · ⇧Enter copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('dbl-click/⇧Enter copy');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeEaseSpark');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudExtremeSpark');
    expect(src).toContain("if (ev.shiftKey && ev.key === 'Enter') {");
    expect(src).toContain('copyDisneyExtremeEaseSvg();');
    expect(src).toContain('copyDisneyExtremeBodyMixSvg();');
    expect(src).toContain('copyDisneyExtremeFactorBarsSvg();');
  });
});
