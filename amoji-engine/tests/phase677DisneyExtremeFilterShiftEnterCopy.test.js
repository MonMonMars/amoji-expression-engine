import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 677 Extreme filterShiftEnterCopy', () => {
  it('covers filterShiftEnterCopy metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter input · Shift+Enter copy');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('ev.key === \'Enter\' && ev.shiftKey');
  });
});
