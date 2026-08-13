import { describe, expect, it } from 'vitest';
import { formatDisneyExtremeDirtyHudBit } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 194 Extreme dirty HUD change count', () => {
  it('appends dirty×N when changeCount is set', () => {
    expect(
      formatDisneyExtremeDirtyHudBit({
        hasBaseline: true,
        dirty: true,
        changeCount: 3,
        fp: 'abcd1234',
      }),
    ).toEqual({
      hasBaseline: true,
      dirty: true,
      fp: 'abcd1234',
      changeCount: 3,
      bit: ' · dirty×3 abcd1234',
    });
    expect(
      formatDisneyExtremeDirtyHudBit({
        hasBaseline: true,
        dirty: true,
        changeCount: 0,
      }).bit,
    ).toBe(' · dirty');
    expect(typeof engine.formatDisneyExtremeDirtyHudBit).toBe('function');
  });
});
