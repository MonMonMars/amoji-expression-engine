import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 534 Extreme filterAltF12Digest', () => {
  it('covers filterAltF12Digest metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter input · Alt+F12 digest');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('ev.altKey && ev.key === \'F12\'');
  });
});
