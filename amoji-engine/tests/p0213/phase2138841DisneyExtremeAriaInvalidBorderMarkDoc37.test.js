import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2138841 Extreme ariaInvalidBorderMarkDoc37', () => {
  it('covers ariaInvalidBorderMarkDoc37 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-invalid border Mark policy keep37');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('border-color: Mark');
  });
});
