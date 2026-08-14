import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2187726 Extreme colorSchemeDarkAvoid39', () => {
  it('covers colorSchemeDarkAvoid39 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('color-scheme · dark avoid keep29');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('color-scheme: dark');
  });
});
