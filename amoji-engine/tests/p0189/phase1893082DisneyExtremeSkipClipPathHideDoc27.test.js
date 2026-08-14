import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1893082 Extreme skipClipPathHideDoc27', () => {
  it('covers skipClipPathHideDoc27 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · skip clip-path hide policy keep27');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('clip-path: inset(50%)');
  });
});
