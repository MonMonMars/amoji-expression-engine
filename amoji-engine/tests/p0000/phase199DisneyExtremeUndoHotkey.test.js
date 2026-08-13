import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 199 Extreme U undo baseline', () => {
  it('resolves U to undoBaseline', () => {
    expect(matchDisneyExtremeHotkey('U')?.entry.id).toBe('undoBaseline');
    expect(resolveDisneyExtremeHotkey({ key: 'u' }).action).toBe(
      'undoBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('U undo base');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
