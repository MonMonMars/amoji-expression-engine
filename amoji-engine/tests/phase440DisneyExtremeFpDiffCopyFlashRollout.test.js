import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 440 Extreme fp/diff copy-flash rollout', () => {
  it('uses unified copy flash for fingerprint and diff copies', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('fp copy flash · unified');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotFingerprint[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `fp \$\{fp\}`/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselinePinFingerprint[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `pin fp \$\{fp\}`/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotDiff[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
