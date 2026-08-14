import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2974426 Extreme linkFocusOutlineOutsetDoc71', () => {
  it('covers linkFocusOutlineOutsetDoc71 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · link focus outline-style outset policy keep71');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-style: outset');
  });
});
