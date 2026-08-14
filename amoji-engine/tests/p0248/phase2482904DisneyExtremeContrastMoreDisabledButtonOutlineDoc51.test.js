import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2482904 Extreme contrastMoreDisabledButtonOutlineDoc51', () => {
  it('covers contrastMoreDisabledButtonOutlineDoc51 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · contrast-more disabled button outline policy keep51');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline: 1px solid GrayText');
  });
});
