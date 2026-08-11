import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 269 Extreme active favorite chip highlight', () => {
  it('marks active fav chip from cycle index and documents catalog', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('fav chip · active');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('extreme-fav-chip.is-active');
    expect(src).toContain("btn.classList.add('is-active')");
    expect(src).toContain('extremeFavoriteCycleIndex === i');
    expect(src).toContain('let extremeFavoriteCycleIndex = null');
  });
});
