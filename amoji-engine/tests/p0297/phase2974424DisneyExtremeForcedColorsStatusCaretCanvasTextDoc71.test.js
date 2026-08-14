import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2974424 Extreme forcedColorsStatusCaretCanvasTextDoc71', () => {
  it('covers forcedColorsStatusCaretCanvasTextDoc71 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · forced-colors status caret CanvasText policy keep71');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('caret-color: CanvasText');
  });
});
