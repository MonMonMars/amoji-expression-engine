import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 376 Extreme Delete clear active', () => {
  it('resolves Delete/Backspace to clearStatusHold', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Delete' }).action).toBe(
      'clearStatusHold',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'Backspace' }).action).toBe(
      'clearStatusHold',
    );
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Delete',
        target: { tagName: 'INPUT' },
      }).ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Delete clear active');
  });
});
