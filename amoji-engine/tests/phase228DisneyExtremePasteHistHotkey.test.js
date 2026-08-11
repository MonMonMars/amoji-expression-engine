import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 228 Extreme I paste hist hotkey', () => {
  it('resolves I to pasteBaselineHistoryJson', () => {
    expect(matchDisneyExtremeHotkey('I')?.entry.id).toBe(
      'pasteBaselineHistoryJson',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'i' }).action).toBe(
      'pasteBaselineHistoryJson',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('I paste hist');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
