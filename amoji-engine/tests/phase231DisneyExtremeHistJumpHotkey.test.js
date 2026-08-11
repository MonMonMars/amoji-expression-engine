import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 231 Extreme 1–8 hist jump hotkey', () => {
  it('resolves digit keys to jumpBaselineHistory with index', () => {
    expect(matchDisneyExtremeHotkey('3')?.entry.id).toBe(
      'jumpBaselineHistory',
    );
    expect(resolveDisneyExtremeHotkey({ key: '1' })).toEqual({
      ok: true,
      action: 'jumpBaselineHistory',
      index: 0,
    });
    expect(resolveDisneyExtremeHotkey({ key: '2', shiftKey: true }).ok).toBe(
      false,
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('1–8 hist jump');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
