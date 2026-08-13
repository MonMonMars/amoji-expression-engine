import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 436 Extreme IO copy-flash rollout', () => {
  it('uses unified copy flash for list/bundle/SVG copies', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('IO copy flash · unified');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeBaselineHistoryList[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeHotkeyHelp[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'hotkey help'/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeEaseSvg[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'ease SVG'/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBundle[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
  });
});
