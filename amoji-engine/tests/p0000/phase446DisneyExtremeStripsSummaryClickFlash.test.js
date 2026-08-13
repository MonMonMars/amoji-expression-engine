import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 446 Extreme strips/filter summary click flash', () => {
  it('wires click flash on strips summary and filter summary', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips summary · click flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter summary · click flash');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function flashDisneyExtremeStripsFilterSummary');
    expect(src).toContain("document.getElementById('disneyExtremeStripsSummary')");
    expect(src).toContain("document.getElementById('disneyExtremeStripsFilterSummary')");
    expect(src).toContain('flashDisneyExtremeBaselineStripsSummary()');
    expect(src).toContain('flashDisneyExtremeStripsFilterSummary()');
    expect(src).toContain('click flash · dbl-click copy');
  });
});
