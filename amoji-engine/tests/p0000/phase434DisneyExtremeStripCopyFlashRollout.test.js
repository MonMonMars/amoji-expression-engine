import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 434 Extreme strip copy-flash rollout', () => {
  it('uses unified copy flash for F-key strip copies', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strip copy flash · unified');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeBaselineFactorsStrip[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineEaseStrip[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselinePinStrip[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineActive[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
