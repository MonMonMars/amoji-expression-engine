import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2360024 Extreme forcedColorsBusyDashedOutlineDoc46', () => {
  it('covers forcedColorsBusyDashedOutlineDoc46 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · forced-colors busy dashed outline policy keep46');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('outline: 2px dashed CanvasText');
  });
});
