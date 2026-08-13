import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeStripsFilterClearLabel,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 416 Extreme ⇧Alt+F12 clear filter', () => {
  it('resolves clear filter and formats clear label', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'F12',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearStripsFilter');
    expect(formatDisneyExtremeStripsFilterClearLabel({})).toBe(
      'cleared · filter · none',
    );
    expect(
      formatDisneyExtremeStripsFilterClearLabel({ query: 'pin' }),
    ).toBe('cleared · filter · "pin"');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+F12 clear filter');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeClearFilter');
    expect(src).toContain('function clearDisneyExtremeStripsFilterFlash');
    expect(src).toContain("resolved.action === 'clearStripsFilter'");
    expect(src).toContain('formatDisneyExtremeStripsFilterClearLabel');
    expect(src).toContain("ev.key !== 'Escape'");
  });
});
