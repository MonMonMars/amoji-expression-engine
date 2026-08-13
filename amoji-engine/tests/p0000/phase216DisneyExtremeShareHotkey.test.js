import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 216 Extreme Y share link hotkey', () => {
  it('resolves Y to copySnapshotShareUrl', () => {
    expect(matchDisneyExtremeHotkey('Y')?.entry.id).toBe(
      'copySnapshotShareUrl',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'y' }).action).toBe(
      'copySnapshotShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Y share link');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
