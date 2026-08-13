import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 13071 Extreme hudFactorsImgKeep6', () => {
  it('covers hudFactorsImgKeep6 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD factors · img keep3');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('easeSparkRoleImg');
  });
});
