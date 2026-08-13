import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineAllStripsBundle,
  formatDisneyExtremeBaselineAllStripsLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

describe('Phase 422 Extreme empty-filter all-strips edge case', () => {
  it('returns empty bundle and none label when filter matches nothing', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.5,
      shapeFactor: 1.2,
    });
    const stacks = { history: [snap], redo: [], favorites: [snap] };
    const opts = {
      pin: snap,
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
      filterQuery: 'zzz',
      filterVisible: 0,
      filterTotal: 11,
      stripKeys: [],
    };
    expect(formatDisneyExtremeBaselineAllStripsBundle(stacks, opts)).toBe('');
    expect(formatDisneyExtremeBaselineAllStripsLabel(stacks, opts)).toContain(
      'filter · "zzz" · none',
    );
  });
});
