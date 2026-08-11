import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 382 Extreme ⇧Alt+Insert jump pin summary', () => {
  it('resolves Shift+Alt+Insert to jumpBaselinePinSummary', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Insert',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('jumpBaselinePinSummary');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Insert', altKey: true }).action,
    ).toBe('jumpBaselinePin');
    expect(
      resolveDisneyExtremeHotkey({ key: 'r', altKey: true, shiftKey: true })
        .action,
    ).toBe('jumpBaselinePinSummary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+Insert jump pin summary',
    );
  });
});
