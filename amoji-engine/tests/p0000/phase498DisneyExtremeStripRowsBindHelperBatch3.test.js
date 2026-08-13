import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 498 Extreme strip rows bind helper batch 3', () => {
  it('migrates factors/ease/mix/neck/curve strips to bind helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('factors/ease/mix/neck/curve strips · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeCurveStrip')");
    expect(src).not.toContain("getElementById('disneyExtremeCurveStrip')?.addEventListener('keydown'");
  });
});
