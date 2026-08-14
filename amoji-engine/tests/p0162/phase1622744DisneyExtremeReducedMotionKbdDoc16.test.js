import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1622744 Extreme reducedMotionKbdDoc16', () => {
  it('covers reducedMotionKbdDoc16 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · reduced-motion kbd policy keep16');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('prefers-reduced-motion: reduce');
  });
});
