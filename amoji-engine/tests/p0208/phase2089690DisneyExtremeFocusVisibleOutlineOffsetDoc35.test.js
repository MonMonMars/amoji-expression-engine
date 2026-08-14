import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2089690 Extreme focusVisibleOutlineOffsetDoc35', () => {
  it('covers focusVisibleOutlineOffsetDoc35 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · focus-visible outline-offset policy keep35');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: 2px');
  });
});
