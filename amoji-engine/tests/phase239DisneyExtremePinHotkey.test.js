import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 239 Extreme P pin baseline hotkey', () => {
  it('resolves P to pinBaseline', () => {
    expect(matchDisneyExtremeHotkey('P')?.entry.id).toBe('pinBaseline');
    expect(resolveDisneyExtremeHotkey({ key: 'p' }).action).toBe(
      'pinBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('P pin base');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
