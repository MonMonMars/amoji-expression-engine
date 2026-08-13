import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyDigest,
} from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 433 Extreme digest filter append', () => {
  it('appends active filter to H digest flash and Alt+F12 copy', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('digest · filter append');
    const digest = formatDisneyExtremeHotkeyDigest({
      enabled: true,
      stripsFilter: 'filter · "pin" · 1/11',
    });
    expect(digest).toContain('extreme on');
    expect(digest).toContain('filter · "pin" · 1/11');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      'stripsFilter: disneyExtremeStripsFilterSummaryText() || undefined',
    );
    expect(src).toMatch(
      /showHelp[\s\S]*?formatDisneyExtremeHotkeyDigest\([\s\S]*?stripsFilter/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeHotkeyDigest[\s\S]*?formatDisneyExtremeHotkeyDigest\([\s\S]*?stripsFilter/,
    );
  });
});
