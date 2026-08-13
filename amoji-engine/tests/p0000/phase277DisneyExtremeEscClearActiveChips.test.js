import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 277 Extreme Esc clears active chips', () => {
  it('resolves Esc when active chips held and wires Face Live clear', () => {
    expect(
      resolveDisneyExtremeHotkey(
        { key: 'Escape' },
        { holdingActiveChips: true },
      ).action,
    ).toBe('clearStatusHold');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Escape' }, { holdingActiveChips: false })
        .ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Esc clear active chips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('holdingActiveChips:');
    expect(src).toContain('function clearDisneyExtremeActiveChips');
    expect(src).toContain('formatDisneyExtremeTransientClearLabel({');
    expect(src).toContain('clearedActive');
    expect(src).toContain('extremeFavoriteCycleIndex = null');
    expect(src).toContain('extremeHistoryJumpIndexActive = null');
    expect(src).toContain('extremeRedoJumpIndexActive = null');
  });
});
