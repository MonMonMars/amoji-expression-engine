import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

describe('Phase 374 Extreme ⇧↓↑ cycle redo', () => {
  it('resolves Shift+ArrowDown/Up to redo cycle actions', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'ArrowDown',
        shiftKey: true,
      }).action,
    ).toBe('cycleBaselineRedoNext');
    expect(
      resolveDisneyExtremeHotkey({ key: 'ArrowUp', shiftKey: true }).action,
    ).toBe('cycleBaselineRedoPrev');
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowDown' }).action).toBe(
      'cycleBaselineHistoryNext',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧↓↑ cycle redo');
  });
});
