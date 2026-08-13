import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

describe('Phase 378 Extreme Tab focus panel', () => {
  it('resolves Tab to focus panel and leaves Shift+Tab to the browser', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Tab' }).action).toBe(
      'focusExtremePanel',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'Tab', shiftKey: true }).ok,
    ).toBe(false);
    expect(
      resolveDisneyExtremeHotkey({ key: 'Tab', altKey: true }).reason,
    ).toBe('modifier');
    expect(resolveDisneyExtremeHotkey({ key: 'x', altKey: true }).action).toBe(
      'focusExtremePanel',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Tab focus panel');
  });
});
