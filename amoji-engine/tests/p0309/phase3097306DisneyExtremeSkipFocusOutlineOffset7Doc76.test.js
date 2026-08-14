import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 3097306 Extreme skipFocusOutlineOffset7Doc76', () => {
  it('covers skipFocusOutlineOffset7Doc76 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · skip focus outline-offset 7px policy keep76');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: 7px');
  });
});
