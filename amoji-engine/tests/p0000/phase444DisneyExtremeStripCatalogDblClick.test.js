import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 444 Extreme strip dbl-click catalog sync', () => {
  it('documents strip dbl-click behavior and wires filter summary dbl-click copy', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('tips strip · live · dbl-click copy');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'pin strip · live · dbl-click jump summary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'factors strip · live · dbl-click copy',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'curve strips · live · dbl-click copy',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'filter summary · dbl-click copy',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(\n        document.getElementById('disneyExtremeStripsFilterSummary')",
    );
    expect(src).toContain('copyDisneyExtremeStripsFilterSummary();');
    expect(src).toContain('dbl-click copy');
  });
});
