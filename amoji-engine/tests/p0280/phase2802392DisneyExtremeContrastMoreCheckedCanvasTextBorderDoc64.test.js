import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2802392 Extreme contrastMoreCheckedCanvasTextBorderDoc64', () => {
  it('covers contrastMoreCheckedCanvasTextBorderDoc64 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · contrast-more checked CanvasText border policy keep64');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('border-color: CanvasText');
  });
});
