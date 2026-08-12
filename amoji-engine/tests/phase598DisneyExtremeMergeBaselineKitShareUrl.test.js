import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 598 Extreme mergeBaselineKitShareUrl', () => {
  it('covers mergeBaselineKitShareUrl metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+V merge kit');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('pasteDisneyExtremeBaselineKitShareUrl({ merge: true })');
  });
});
