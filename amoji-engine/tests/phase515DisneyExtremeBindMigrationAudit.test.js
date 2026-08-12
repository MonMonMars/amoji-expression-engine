import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 515 Extreme bind migration audit', () => {
  it('completes bind helper migration for interactive surfaces', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('panel sparks · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect((src.match(/bindDisneyExtremeFlashCopySurface\(/g) || []).length).toBeGreaterThanOrEqual(20);
    expect(src).not.toContain("getElementById('disneyExtremeTips')?.addEventListener('keydown'");
    expect(src).not.toContain('disneyExtremeEaseSpark?.addEventListener(\'keydown\'');
  });
});
