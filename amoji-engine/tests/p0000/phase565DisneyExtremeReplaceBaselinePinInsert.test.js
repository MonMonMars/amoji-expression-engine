import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 565 Extreme replaceBaselinePinInsert', () => {
  it('covers replaceBaselinePinInsert metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Insert replace pin');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('replaceDisneyExtremeBaselinePin');
  });
});
