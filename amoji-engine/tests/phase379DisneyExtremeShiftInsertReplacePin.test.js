import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 379 Extreme Shift+Insert replace pin', () => {
  it('resolves Shift+Insert to replaceBaselinePin', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Insert', shiftKey: true }).action,
    ).toBe('replaceBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'Insert' }).action).toBe(
      'pinBaseline',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'p', shiftKey: true }).action,
    ).toBe('replaceBaselinePin');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Insert replace pin');
  });
});
