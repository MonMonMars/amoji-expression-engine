import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2949849 Extreme ariaBusyFontKerningNoneDoc70', () => {
  it('covers ariaBusyFontKerningNoneDoc70 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-busy font-kerning none policy keep70');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('font-kerning: none');
  });
});
