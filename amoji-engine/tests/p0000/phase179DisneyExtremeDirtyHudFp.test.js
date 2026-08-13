import { describe, expect, it } from 'vitest';
import { formatDisneyExtremeDirtyHudBit } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 179 Extreme dirty HUD bit with fp', () => {
  it('appends short baseline fingerprint when provided', () => {
    expect(
      formatDisneyExtremeDirtyHudBit({
        hasBaseline: true,
        dirty: true,
        fp: 'a1b2c3d4',
      }),
    ).toEqual({
      hasBaseline: true,
      dirty: true,
      fp: 'a1b2c3d4',
      changeCount: 0,
      bit: ' · dirty a1b2c3d4',
    });
    expect(
      formatDisneyExtremeDirtyHudBit({
        hasBaseline: true,
        dirty: false,
        fp: 'deadbeef',
      }).bit,
    ).toBe(' · clean deadbeef');
    expect(typeof engine.formatDisneyExtremeDirtyHudBit).toBe('function');
  });
});
