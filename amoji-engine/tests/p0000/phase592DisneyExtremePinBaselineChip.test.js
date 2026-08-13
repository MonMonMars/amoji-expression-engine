import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 592 Extreme pinBaselineChip', () => {
  it('covers pinBaselineChip metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('dbl-click chip pin');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('pinDisneyExtremeBaselineFromChip');
  });
});
