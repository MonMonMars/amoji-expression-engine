import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1598170 Extreme outlineOffsetDoc15', () => {
  it('covers outlineOffsetDoc15 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · focus outline-offset policy keep15');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline-offset: 3px');
  });
});
