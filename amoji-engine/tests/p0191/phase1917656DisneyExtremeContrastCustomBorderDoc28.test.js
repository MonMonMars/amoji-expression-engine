import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1917656 Extreme contrastCustomBorderDoc28', () => {
  it('covers contrastCustomBorderDoc28 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · contrast-custom border policy keep28');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('prefers-contrast: custom');
  });
});
