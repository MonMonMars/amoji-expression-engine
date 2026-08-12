import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 817 Extreme pointerCoarseButtons', () => {
  it('covers pointerCoarseButtons metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('pointer:coarse · toolbar pad');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('min-height: 44px');
  });
});
