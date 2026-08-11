import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  popDisneyExtremeBaselineHistory,
  disneyExtremeSnapshotFingerprint,
  DISNEY_EXTREME_BASELINE_HISTORY_LIMIT,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 198 Extreme baseline history helpers', () => {
  it('pushes unique baselines and pops in LIFO order', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    let hist = pushDisneyExtremeBaselineHistory([], a);
    expect(hist).toHaveLength(1);
    hist = pushDisneyExtremeBaselineHistory(hist, a);
    expect(hist).toHaveLength(1);
    hist = pushDisneyExtremeBaselineHistory(hist, b);
    expect(hist).toHaveLength(2);
    const popped = popDisneyExtremeBaselineHistory(hist);
    expect(disneyExtremeSnapshotFingerprint(popped.snap)).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    expect(popped.history).toHaveLength(1);
    expect(popDisneyExtremeBaselineHistory([]).snap).toBe(null);
    expect(engine.DISNEY_EXTREME_BASELINE_HISTORY_LIMIT).toBe(
      DISNEY_EXTREME_BASELINE_HISTORY_LIMIT,
    );
    expect(typeof engine.pushDisneyExtremeBaselineHistory).toBe('function');
  });
});
