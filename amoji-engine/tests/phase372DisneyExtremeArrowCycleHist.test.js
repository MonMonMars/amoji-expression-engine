import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 372 Extreme ↓↑ cycle hist', () => {
  it('resolves ArrowDown/Up to history cycle actions', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowDown' }).action).toBe(
      'cycleBaselineHistoryNext',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowUp' }).action).toBe(
      'cycleBaselineHistoryPrev',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'q', altKey: true }).action,
    ).toBe('cycleBaselineHistoryNext');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('↓↑ cycle hist');
  });
});
