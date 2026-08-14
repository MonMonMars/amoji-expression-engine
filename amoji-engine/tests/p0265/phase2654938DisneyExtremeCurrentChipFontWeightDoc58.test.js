import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2654938 Extreme currentChipFontWeightDoc58', () => {
  it('covers currentChipFontWeightDoc58 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · current chip font-weight policy keep58');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('font-weight: 600');
  });
});
