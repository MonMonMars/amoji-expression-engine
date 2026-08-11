import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineFactorsStripLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 383 Extreme factors strip live label', () => {
  it('formats factors strip and wires live Face Live strip', () => {
    expect(formatDisneyExtremeBaselineFactorsStripLabel({})).toBe(
      'factors · shape/body/eye/mouth (off)',
    );
    expect(
      formatDisneyExtremeBaselineFactorsStripLabel({
        enabled: true,
        shapeFactor: 1.6,
        bodyOn: true,
        bodyFactor: 1.5,
        eyeFactor: 1.4,
        mouthFactor: 1.5,
      }),
    ).toBe(
      'factors · shape×1.60 · body×1.50 · eye×1.40 · mouth×1.50',
    );
    expect(typeof engine.formatDisneyExtremeBaselineFactorsStripLabel).toBe(
      'function',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('factors strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeFactorsStrip"');
    expect(src).toContain('function syncDisneyExtremeFactorsStripUi');
    expect(src).toContain('syncDisneyExtremeFactorsStripUi({');
  });
});
