import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 176 Extreme Shift+D restore baseline', () => {
  it('resolves Shift+D to restoreBaseline', () => {
    expect(matchDisneyExtremeHotkey('D')?.entry.id).toBe('showSnapshotDiff');
    expect(resolveDisneyExtremeHotkey({ key: 'd' }).action).toBe(
      'showSnapshotDiff',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'd', shiftKey: true }).action,
    ).toBe('restoreBaseline');
    expect(
      resolveDisneyExtremeHotkey({ key: 'D', shiftKey: true }).action,
    ).toBe('restoreBaseline');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+D restore');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
