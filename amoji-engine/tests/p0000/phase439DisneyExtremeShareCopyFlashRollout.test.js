import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 439 Extreme share copy-flash rollout', () => {
  it('uses unified copy flash for share URL copies', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('share copy flash · unified');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotShareUrl[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `share link · fp \$\{fp\}`/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineFavoritesShareUrl[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineStacksShareUrl[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineKitShareUrl[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
