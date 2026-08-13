import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 219 Extreme L history list hotkey', () => {
  it('resolves L to showBaselineHistory', () => {
    expect(matchDisneyExtremeHotkey('L')?.entry.id).toBe(
      'showBaselineHistory',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'l' }).action).toBe(
      'showBaselineHistory',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('L hist list');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
