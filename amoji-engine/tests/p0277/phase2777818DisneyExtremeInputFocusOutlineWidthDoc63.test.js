import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2777818 Extreme inputFocusOutlineWidthDoc63', () => {
  it('covers inputFocusOutlineWidthDoc63 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · input focus outline-width policy keep63');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-width: 3px');
  });
});
