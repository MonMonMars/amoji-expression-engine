import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 3072730 Extreme skipFocusOutlineStyleDottedDoc75', () => {
  it('covers skipFocusOutlineStyleDottedDoc75 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · skip focus outline-style dotted policy keep75');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-style: dotted');
  });
});
