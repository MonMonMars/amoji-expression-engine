import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 497 Extreme strip rows bind helper batch 2', () => {
  it('migrates active/pin/dirty strips to bind helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('active/pin/dirty strips · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremePin')");
    expect(src).toContain('jumpDisneyExtremeBaselinePinSummary()');
    expect(src).not.toContain("getElementById('disneyExtremePin')?.addEventListener('keydown'");
  });
});
