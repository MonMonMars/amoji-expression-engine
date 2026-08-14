import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2802393 Extreme ariaDropeffectCopyCursorDoc64', () => {
  it('covers ariaDropeffectCopyCursorDoc64 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-dropeffect copy cursor policy keep64');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('cursor: copy');
  });
});
