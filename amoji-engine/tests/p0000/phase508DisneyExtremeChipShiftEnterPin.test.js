import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 508 Extreme chip Shift+Enter pin', () => {
  it('pins baseline from chip on Shift+Enter', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('chips · ⇧Enter pin');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('pinDisneyExtremeBaselineFromChip(snap');
    expect(src).toContain("btn.addEventListener('keydown'");
  });
});
