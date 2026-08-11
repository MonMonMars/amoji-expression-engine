import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStripsSummaryLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 366 Extreme collapsible strips panel', () => {
  it('formats strips summary and wraps Face Live strips in details', () => {
    expect(
      formatDisneyExtremeBaselineStripsSummaryLabel(
        {},
        { hasBaseline: false },
      ),
    ).toBe('strips · hist 0/8 · redo 0/8 · fav 0/8 · dirty · none');
    expect(
      formatDisneyExtremeBaselineStripsSummaryLabel(
        { history: [{}, {}], redo: [{}], favorites: [] },
        { hasBaseline: true, dirty: true, changeCount: 2, fp: 'ab12' },
      ),
    ).toBe(
      'strips · hist 2/8 · redo 1/8 · fav 0/8 · dirty · dirty×2 · fp ab12',
    );
    expect(typeof engine.formatDisneyExtremeBaselineStripsSummaryLabel).toBe(
      'function',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips · remember open');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeStrips"');
    expect(src).toContain('id="disneyExtremeStripsSummary"');
    expect(src).toContain('function syncDisneyExtremeStripsSummaryUi');
  });
});
