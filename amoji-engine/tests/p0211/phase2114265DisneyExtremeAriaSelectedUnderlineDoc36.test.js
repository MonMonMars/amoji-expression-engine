import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2114265 Extreme ariaSelectedUnderlineDoc36', () => {
  it('covers ariaSelectedUnderlineDoc36 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-selected underline policy keep36');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('text-decoration-line: underline');
  });
});
