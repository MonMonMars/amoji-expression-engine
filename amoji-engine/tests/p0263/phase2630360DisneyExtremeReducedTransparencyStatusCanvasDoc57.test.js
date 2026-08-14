import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2630360 Extreme reducedTransparencyStatusCanvasDoc57', () => {
  it('covers reducedTransparencyStatusCanvasDoc57 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · reduced-transparency status Canvas policy keep57');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('background-color: Canvas');
  });
});
