import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 235 Extreme Shift+K clear hist + Shift+digit redo jump', () => {
  it('resolves Shift+K and Shift+1–8', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'k' }).action).toBe(
      'clearBaseline',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'k', shiftKey: true }).action,
    ).toBe('clearBaselineHistory');
    expect(resolveDisneyExtremeHotkey({ key: '3', shiftKey: true })).toEqual({
      ok: true,
      action: 'jumpBaselineRedo',
      index: 2,
    });
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+K clear hist');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+1–8 redo jump');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
