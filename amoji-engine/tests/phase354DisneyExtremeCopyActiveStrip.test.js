import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 354 Extreme active strip dbl-click copy', () => {
  it('wires active strip dbl-click copy and copy helper', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'active strip · live · dbl-click copy',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function copyDisneyExtremeBaselineActive');
    expect(src).toContain(
      "getElementById('disneyExtremeActive')?.addEventListener('dblclick'",
    );
    expect(src).toContain('btnDisneyExtremeCopyActive');
    expect(src).toMatch(
      /disneyExtremeActive[\s\S]*?copyDisneyExtremeBaselineActive/,
    );
  });
});
