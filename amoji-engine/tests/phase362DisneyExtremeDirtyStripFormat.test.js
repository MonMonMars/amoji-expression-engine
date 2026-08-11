import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineDirtyStripLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 362 Extreme dirty strip formatter', () => {
  it('formats none / clean / dirty strip labels', () => {
    expect(formatDisneyExtremeBaselineDirtyStripLabel({})).toBe('dirty · none');
    expect(
      formatDisneyExtremeBaselineDirtyStripLabel({
        hasBaseline: true,
        dirty: false,
        fp: 'abc123',
      }),
    ).toBe('dirty · clean · fp abc123');
    expect(
      formatDisneyExtremeBaselineDirtyStripLabel({
        hasBaseline: true,
        dirty: true,
        changeCount: 3,
        fp: 'deadbeef',
      }),
    ).toBe('dirty · dirty×3 · fp deadbeef');
    expect(
      formatDisneyExtremeBaselineDirtyStripLabel({
        hasBaseline: true,
        dirty: true,
      }),
    ).toBe('dirty · dirty');
    expect(typeof engine.formatDisneyExtremeBaselineDirtyStripLabel).toBe(
      'function',
    );
  });
});
