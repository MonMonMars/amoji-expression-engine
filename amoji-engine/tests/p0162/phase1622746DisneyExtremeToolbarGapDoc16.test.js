import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1622746 Extreme toolbarGapDoc16', () => {
  it('covers toolbarGapDoc16 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · toolbar gap token policy keep16');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('max(0.35rem, 0.5ch)');
  });
});
