import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2310872 Extreme anyHoverNoneToolbarUnderlineDoc44', () => {
  it('covers anyHoverNoneToolbarUnderlineDoc44 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · any-hover none toolbar underline policy keep44');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('text-decoration: underline');
  });
});
