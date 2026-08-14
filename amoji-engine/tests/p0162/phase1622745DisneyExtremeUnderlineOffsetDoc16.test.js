import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1622745 Extreme underlineOffsetDoc16', () => {
  it('covers underlineOffsetDoc16 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · status underline-offset policy keep16');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('text-underline-offset');
  });
});
