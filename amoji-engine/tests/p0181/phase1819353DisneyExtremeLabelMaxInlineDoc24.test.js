import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1819353 Extreme labelMaxInlineDoc24', () => {
  it('covers labelMaxInlineDoc24 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · label max-inline-size policy keep24');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('max-inline-size: 100%');
  });
});
