import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1696472 Extreme contrastSkipOutlineDoc19', () => {
  it('covers contrastSkipOutlineDoc19 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · contrast skip outline-width policy keep19');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-width: 3px');
  });
});
