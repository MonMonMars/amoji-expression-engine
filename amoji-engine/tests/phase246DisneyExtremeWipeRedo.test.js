import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  hasDisneyExtremeBaselineRedo,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 246 Extreme W wipe redo', () => {
  it('resolves W wipe and detects nonempty redo', () => {
    expect(matchDisneyExtremeHotkey('W')?.entry.id).toBe('clearBaselineRedo');
    expect(resolveDisneyExtremeHotkey({ key: 'w' }).action).toBe(
      'clearBaselineRedo',
    );
    expect(hasDisneyExtremeBaselineRedo({ redo: [] })).toBe(false);
    expect(hasDisneyExtremeBaselineRedo({ redoDepth: 2 })).toBe(true);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('W wipe redo');
    expect(typeof engine.hasDisneyExtremeBaselineRedo).toBe('function');
  });
});
