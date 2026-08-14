import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1671897 Extreme detailsMarkerDoc18', () => {
  it('covers detailsMarkerDoc18 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · details marker policy keep18');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('::-webkit-details-marker');
  });
});
