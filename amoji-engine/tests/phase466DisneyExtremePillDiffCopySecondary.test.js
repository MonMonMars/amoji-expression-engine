import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 466 Extreme X pill diff copy secondary actions', () => {
  it('adds dbl-click and Shift+Enter copy diff on X pill', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('X pill · ⇧Enter copy diff');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('X pill · dbl-click copy diff');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="pillExtreme" title="X diff pill · click/Enter/Space flash diff · dbl-click/⇧Enter copy diff"');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(pillExtreme');
    expect(src).toContain("if (ev.shiftKey && ev.key === 'Enter') {");
    expect(src).toContain('copyDisneyExtremeSnapshotDiff();');
  });
});
