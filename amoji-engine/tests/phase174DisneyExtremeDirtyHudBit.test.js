import { describe, expect, it } from 'vitest';
import { formatDisneyExtremeDirtyHudBit } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 174 Extreme dirty HUD bit', () => {
  it('returns empty without baseline and dirty/clean bits when set', () => {
    expect(formatDisneyExtremeDirtyHudBit({})).toEqual({
      hasBaseline: false,
      dirty: false,
      fp: '',
      bit: '',
    });
    expect(formatDisneyExtremeDirtyHudBit({ hasBaseline: true, dirty: false })).toEqual({
      hasBaseline: true,
      dirty: false,
      fp: '',
      bit: ' · clean',
    });
    expect(formatDisneyExtremeDirtyHudBit({ hasBaseline: true, dirty: true })).toEqual({
      hasBaseline: true,
      dirty: true,
      fp: '',
      bit: ' · dirty',
    });
    expect(typeof engine.formatDisneyExtremeDirtyHudBit).toBe('function');
  });
});
