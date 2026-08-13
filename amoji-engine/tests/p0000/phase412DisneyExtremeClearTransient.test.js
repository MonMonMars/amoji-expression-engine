import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeTransientClearLabel,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 412 Extreme clear transient polish', () => {
  it('resolves ⇧Alt+Delete and unifies clear labels', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Delete',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearTransient');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Backspace',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearTransient');
    expect(resolveDisneyExtremeHotkey({ key: 'Delete' }).action).toBe(
      'clearStatusHold',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+Delete clear transient',
    );
    expect(
      formatDisneyExtremeTransientClearLabel({
        clearedHold: true,
        clearedCompare: true,
        clearedActive: true,
      }),
    ).toBe('cleared · hold · compare · chips');
    expect(formatDisneyExtremeTransientClearLabel({})).toBe('cleared · none');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function clearDisneyExtremeTransient');
    expect(src).toContain("resolved.action === 'clearTransient'");
    expect(src).toContain('formatDisneyExtremeTransientClearLabel({');
  });
});
