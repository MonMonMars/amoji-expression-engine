import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 172 Extreme D snapshot diff hotkey', () => {
  it('resolves D to showSnapshotDiff', () => {
    expect(matchDisneyExtremeHotkey('D')?.entry.id).toBe('showSnapshotDiff');
    expect(resolveDisneyExtremeHotkey({ key: 'd' }).action).toBe(
      'showSnapshotDiff',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('D diff');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
