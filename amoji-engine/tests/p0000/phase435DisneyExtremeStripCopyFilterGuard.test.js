import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeStripCopyFilteredOutLabel,
} from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 435 Extreme strip copy filter guards', () => {
  it('generalizes strip visibility guard and filtered-out label', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strip copy · filtered out');
    expect(formatDisneyExtremeStripCopyFilteredOutLabel('factors')).toBe(
      'factors · filtered out',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremeStripVisible');
    expect(src).toContain('formatDisneyExtremeStripCopyFilteredOutLabel');
    expect(src).toMatch(
      /copyDisneyExtremeBaselineFactorsStrip[\s\S]*?disneyExtremeStripVisible\('factors'\)/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineDirtyStrip[\s\S]*?disneyExtremeStripVisible\('dirty'\)/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineCurveStrip[\s\S]*?disneyExtremeStripVisible\('curves'\)/,
    );
  });
});
