import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 232 Extreme Shift+I merge hist hotkey', () => {
  it('resolves Shift+I to mergeBaselineHistoryJson', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'i' }).action).toBe(
      'pasteBaselineHistoryJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'i', shiftKey: true }).action,
    ).toBe('mergeBaselineHistoryJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+I merge hist');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
