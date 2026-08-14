import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1647322 Extreme dirtyBorderInlineDoc17', () => {
  it('covers dirtyBorderInlineDoc17 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · dirty border-inline policy keep17');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('border-inline-start: 2px solid currentColor');
  });
});
