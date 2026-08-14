import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 3146457 Extreme ariaInvalidUnderlineOffset5Doc78', () => {
  it('covers ariaInvalidUnderlineOffset5Doc78 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-invalid underline-offset 5px policy keep78');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('text-underline-offset: 5px');
  });
});
