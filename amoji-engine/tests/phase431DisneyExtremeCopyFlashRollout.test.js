import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineCopyFlashLabel,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 431 Extreme copy-flash label rollout', () => {
  it('uses unified copy flash for dirty/filter/strips-summary/C copy', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('copy flash · unified');
    expect(
      formatDisneyExtremeBaselineCopyFlashLabel({
        ok: true,
        summary: 'dirty · clean',
      }),
    ).toBe('copied · dirty · clean');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      'formatDisneyExtremeBaselineCopyFlashLabel({ ok, empty, summary: text })',
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineDirtyStrip[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?open: !!opts\.open/,
    );
    expect(src).toContain(
      'formatDisneyExtremeBaselineCopyFlashLabel({ ok, empty, summary })',
    );
    expect(src).toMatch(
      /copyDisneyExtremeStripsFilterSummary[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeSummary[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
