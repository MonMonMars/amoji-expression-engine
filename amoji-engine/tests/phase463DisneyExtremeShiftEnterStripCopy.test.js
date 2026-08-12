import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 463 Extreme Shift+Enter strip copy/jump', () => {
  it('supports Shift+Enter secondary action for strip rows and filter summary', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strip rows · ⇧Enter copy/jump');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter summary · ⇧Enter copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("if (ev.shiftKey && ev.key === 'Enter') {");
    expect(src).toContain('copyDisneyExtremeBaselineStripsSummary();');
    expect(src).toContain('copyDisneyExtremeStripsFilterSummary();');
    expect(src).toContain('jumpDisneyExtremeBaselinePinSummary();');
  });
});
