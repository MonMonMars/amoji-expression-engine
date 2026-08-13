import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 496 Extreme strip rows bind helper batch 1', () => {
  it('migrates tips/capacity/roots strips to bind helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('tips/capacity/roots strips · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeTips')");
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeCapacity')");
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeRoots')");
    expect(src).not.toContain("getElementById('disneyExtremeTips')?.addEventListener('keydown'");
  });
});
