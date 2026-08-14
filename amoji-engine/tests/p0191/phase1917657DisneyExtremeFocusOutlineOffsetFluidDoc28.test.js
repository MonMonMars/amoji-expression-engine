import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1917657 Extreme focusOutlineOffsetFluidDoc28', () => {
  it('covers focusOutlineOffsetFluidDoc28 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · focus outline-offset fluid policy keep28');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: max(2px, 0.12em)');
  });
});
