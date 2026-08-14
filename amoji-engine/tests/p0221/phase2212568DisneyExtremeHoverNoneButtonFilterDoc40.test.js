import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2212568 Extreme hoverNoneButtonFilterDoc40', () => {
  it('covers hoverNoneButtonFilterDoc40 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · hover-none button filter policy keep40');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('filter: none');
  });
});
