import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 224 Extreme Shift+L copy hist JSON', () => {
  it('resolves Shift+L to copyBaselineHistoryJson', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'l' }).action).toBe(
      'showBaselineHistory',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'l', shiftKey: true }).action,
    ).toBe('copyBaselineHistoryJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+L copy hist JSON');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
