import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 471 Extreme history row background actions', () => {
  it('supports background click/dblclick with target guard for history row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('history row · background click list');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('history row · background dbl-click copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeHistory')");
    expect(src).toContain('backgroundOnly: true');
    expect(src).toContain('flashDisneyExtremeBaselineHistoryList();');
    expect(src).toContain('copyDisneyExtremeBaselineHistoryList();');
  });
});
