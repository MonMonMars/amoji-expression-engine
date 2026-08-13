import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 775 Extreme stripHiddenAriaHidden', () => {
  it('covers stripHiddenAriaHidden metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filtered strips · aria-hidden');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('aria-hidden\', match ? \'false\' : \'true\'');
  });
});
