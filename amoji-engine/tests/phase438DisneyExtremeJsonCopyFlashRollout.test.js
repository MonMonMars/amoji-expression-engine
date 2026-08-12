import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 438 Extreme JSON copy-flash rollout', () => {
  it('uses unified copy flash for JSON/bundle copies', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('JSON copy flash · unified');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeBaselineFavoritesJson[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `fav JSON · \$\{count\}`/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineStacksJson[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotJson[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `snapshot JSON · fp \$\{fp\}`/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineHistoryJson[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
