import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineCurveStripsLabel,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 395 Extreme curve strips live label', () => {
  it('formats curve strips and wires live Face Live strip', () => {
    expect(formatDisneyExtremeBaselineCurveStripsLabel({})).toBe(
      'curves · od ×1.45 (off) · cap 1.50 · neck 0.75 (off) · 0.75 · body mix (off)',
    );
    expect(
      formatDisneyExtremeBaselineCurveStripsLabel({
        enabled: true,
        shapeInt: 1.2,
        bodyOn: true,
        bodyInt: 1,
        neckBlend: 0.75,
        bodyMix: 1,
      }),
    ).toMatch(/^curves · /);
    expect(typeof engine.formatDisneyExtremeBaselineCurveStripsLabel).toBe(
      'function',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('curve strips · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeCurveStrip"');
    expect(src).toContain('function syncDisneyExtremeCurveStripUi');
    expect(src).toContain('syncDisneyExtremeCurveStripUi(');
  });
});
