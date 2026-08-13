import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 427 Extreme C copy includes filter', () => {
  it('passes stripsFilter in copy summary like status title', () => {
    const prefs = {
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.5,
    };
    const text = summarizeDisneyExtremePrefs(prefs, {
      stripsFilter: 'filter · "pin" · 1/11',
    });
    expect(text).toContain('filter · "pin" · 1/11');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('C copy · includes filter');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremeStripsFilterSummaryText');
    expect(src).toContain('stripsFilter: disneyExtremeStripsFilterSummaryText()');
  });
});
