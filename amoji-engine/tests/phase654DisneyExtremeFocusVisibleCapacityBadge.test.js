import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 654 Extreme focusVisibleCapacityBadge', () => {
  it('covers focusVisibleCapacityBadge metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('capacity badges · focus-visible');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('.extreme-hist-empty:focus-visible');
  });
});
