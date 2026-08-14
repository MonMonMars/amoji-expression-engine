import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1721049 Extreme hiddenDisplayDoc20', () => {
  it('covers hiddenDisplayDoc20 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · hidden display policy keep20');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('[hidden]');
  });
});
