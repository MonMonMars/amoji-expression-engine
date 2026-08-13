import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

describe('Phase 380 Extreme Alt+Insert jump pin', () => {
  it('resolves Alt+Insert to jumpBaselinePin', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Insert', altKey: true }).action,
    ).toBe('jumpBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'Insert' }).action).toBe(
      'pinBaseline',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'r', altKey: true }).action).toBe(
      'jumpBaselinePin',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Insert jump pin');
  });
});
