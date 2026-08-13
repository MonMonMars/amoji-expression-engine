import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1274 Extreme hotkeyKeyXKeep', () => {
  it('covers hotkeyKeyXKeep metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('hotkey · X toggle keep');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('resolveDisneyExtremeHotkey');
  });
});
