import { describe, expect, it } from 'vitest';
import { hasDisneyExtremeBaselineHistory } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 234 Extreme has baseline history helper', () => {
  it('is true when hist or redo depth is non-zero', () => {
    expect(hasDisneyExtremeBaselineHistory({})).toBe(false);
    expect(hasDisneyExtremeBaselineHistory({ historyDepth: 1 })).toBe(true);
    expect(hasDisneyExtremeBaselineHistory({ redoDepth: 2 })).toBe(true);
    expect(hasDisneyExtremeBaselineHistory({ history: [], redo: [] })).toBe(
      false,
    );
    expect(
      hasDisneyExtremeBaselineHistory({ history: [{}], redo: [] }),
    ).toBe(true);
    expect(typeof engine.hasDisneyExtremeBaselineHistory).toBe('function');
  });
});
