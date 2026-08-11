import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_CATALOG,
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyCatalog,
  matchDisneyExtremeHotkey,
  isDisneyExtremeNudgeHotkeyKey,
} from '../engine/layers/emotionMorphs.js';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

describe('Phase 128 Extreme hotkey catalog extract', () => {
  it('builds help legend from catalog and matches nudge/action keys', () => {
    expect(formatDisneyExtremeHotkeyCatalog()).toBe(DISNEY_EXTREME_HOTKEY_HELP);
    expect(DISNEY_EXTREME_HOTKEY_CATALOG.some((e) => e.id === 'altCoarser')).toBe(
      true,
    );
    expect(matchDisneyExtremeHotkey(']')?.entry.factor).toBe('shape');
    expect(matchDisneyExtremeHotkey('x')?.entry.id).toBe('toggle');
    expect(isDisneyExtremeNudgeHotkeyKey(';')).toBe(true);
    expect(isDisneyExtremeNudgeHotkeyKey('x')).toBe(false);
    expect(resolveDisneyExtremeHotkey({ key: "'" }).action).toBe(
      'nudgeMouthUp',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'B' }).action).toBe(
      'toggleBodyApply',
    );
    expect(engine.DISNEY_EXTREME_HOTKEY_CATALOG).toBe(
      DISNEY_EXTREME_HOTKEY_CATALOG,
    );
    expect(typeof engine.matchDisneyExtremeHotkey).toBe('function');
    expect(typeof engine.formatDisneyExtremeHotkeyCatalog).toBe('function');
  });
});
