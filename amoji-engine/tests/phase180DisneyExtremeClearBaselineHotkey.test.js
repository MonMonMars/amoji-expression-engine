import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 180 Extreme K clear baseline', () => {
  it('resolves K to clearBaseline', () => {
    expect(matchDisneyExtremeHotkey('K')?.entry.id).toBe('clearBaseline');
    expect(resolveDisneyExtremeHotkey({ key: 'k' }).action).toBe(
      'clearBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('K clear base');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
