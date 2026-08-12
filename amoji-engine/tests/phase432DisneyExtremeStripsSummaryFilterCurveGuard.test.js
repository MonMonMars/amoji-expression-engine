import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStripsSummaryLabel,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 432 Extreme strips summary filter + curve copy guard', () => {
  it('prepends filter bit to strips summary and guards curve copy', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips summary · filtered');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('curve copy · filtered out');
    expect(
      formatDisneyExtremeBaselineStripsSummaryLabel(
        { history: [{}], redo: [], favorites: [] },
        {
          hasBaseline: true,
          dirty: false,
          filterQuery: 'pin',
          filterVisible: 1,
          filterTotal: 11,
        },
      ),
    ).toContain('filter · "pin" · 1/11');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremeStripsSummaryOpts');
    expect(src).toContain('function disneyExtremeStripVisible');
    expect(src).toContain('formatDisneyExtremeStripCopyFilteredOutLabel');
    expect(src).toContain("String(ev.target?.value || '').trim()");
    expect(src).toContain('disneyExtremeStripsFilterQuery = result.query');
  });
});
