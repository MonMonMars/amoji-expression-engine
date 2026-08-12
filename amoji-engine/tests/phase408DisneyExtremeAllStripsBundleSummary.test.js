import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineAllStripsBundle,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';

describe('Phase 408 Extreme all-strips bundle includes strips summary', () => {
  it('appends strips summary as the final all-strips clipboard line', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const bundle = formatDisneyExtremeBaselineAllStripsBundle(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: true,
        changeCount: 2,
        fp: 'sum1',
        enabled: true,
        shapeFactor: snap.shapeFactor,
        bodyOn: snap.bodyOn,
        bodyFactor: snap.bodyFactor,
        eyeFactor: snap.eyeFactor,
        mouthFactor: snap.mouthFactor,
        shapeInt: snap.shapeInt,
        bodyInt: snap.bodyInt,
        neckBlend: snap.neckBlend,
        bodyMix: snap.bodyMix,
      },
    );
    const lines = bundle.split('\n');
    expect(lines).toHaveLength(11);
    expect(lines[10]).toMatch(/^strips · /);
    expect(lines[10]).toContain('dirty');
  });
});
