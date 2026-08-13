import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 776 Extreme stripsEmptyHiddenState', () => {
  it('covers stripsEmptyHiddenState metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips empty · hidden/aria sync');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('aria-hidden\', empty.hidden ? \'true\' : \'false\'');
  });
});
