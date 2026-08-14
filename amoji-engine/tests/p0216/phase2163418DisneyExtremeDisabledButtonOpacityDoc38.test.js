import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2163418 Extreme disabledButtonOpacityDoc38', () => {
  it('covers disabledButtonOpacityDoc38 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · disabled button opacity policy keep38');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('opacity: 0.55');
  });
});
