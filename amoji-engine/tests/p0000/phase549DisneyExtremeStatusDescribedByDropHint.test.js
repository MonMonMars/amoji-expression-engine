import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 549 Extreme statusDescribedByDropHint', () => {
  it('covers statusDescribedByDropHint metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status row · aria-describedby drop hint');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('aria-describedby="disneyExtremeDropHint"');
  });
});
