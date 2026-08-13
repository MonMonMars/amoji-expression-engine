import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 381 Extreme strips summary dbl-click copy', () => {
  it('wires strips summary dbl-click to copy strips summary', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'strips summary · dbl-click copy',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeStripsSummary"');
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(\n        document.getElementById('disneyExtremeStripsSummary')",
    );
    expect(src).toMatch(
      /disneyExtremeStripsSummary[\s\S]*?copyDisneyExtremeBaselineStripsSummary/,
    );
  });
});
