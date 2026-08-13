import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 258 Extreme Shift+click chip star', () => {
  it('wires Shift+click chip star into favorites', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+click chip star');
    expect(src).toContain('function starDisneyExtremeBaselineFavoriteFromChip');
    expect(src).toContain('ev.shiftKey');
    expect(src).toContain('starDisneyExtremeBaselineFavoriteFromChip(snap');
    expect(src).toContain('starred · chip ·');
  });
});
