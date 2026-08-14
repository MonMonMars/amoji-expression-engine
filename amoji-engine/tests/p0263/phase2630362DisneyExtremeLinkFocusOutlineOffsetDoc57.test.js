import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2630362 Extreme linkFocusOutlineOffsetDoc57', () => {
  it('covers linkFocusOutlineOffsetDoc57 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · link focus outline-offset policy keep57');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: 2px');
  });
});
