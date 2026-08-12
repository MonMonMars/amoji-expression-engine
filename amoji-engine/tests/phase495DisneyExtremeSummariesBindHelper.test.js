import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 495 Extreme summaries bind helper', () => {
  it('migrates strips and filter summaries to bind helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips/filter summary · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(\n        document.getElementById('disneyExtremeStripsSummary')");
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(\n        document.getElementById('disneyExtremeStripsFilterSummary')");
    expect(src).not.toContain("getElementById('disneyExtremeStripsSummary')?.addEventListener('keydown'");
  });
});
