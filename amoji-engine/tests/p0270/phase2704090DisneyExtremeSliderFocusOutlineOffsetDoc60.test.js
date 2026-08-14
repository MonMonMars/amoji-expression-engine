import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2704090 Extreme sliderFocusOutlineOffsetDoc60', () => {
  it('covers sliderFocusOutlineOffsetDoc60 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · slider focus outline-offset policy keep60');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: 3px');
  });
});
