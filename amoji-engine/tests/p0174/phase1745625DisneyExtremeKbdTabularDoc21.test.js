import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1745625 Extreme kbdTabularDoc21', () => {
  it('covers kbdTabularDoc21 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · kbd tabular-nums policy keep21');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('font-variant-numeric: tabular-nums');
  });
});
