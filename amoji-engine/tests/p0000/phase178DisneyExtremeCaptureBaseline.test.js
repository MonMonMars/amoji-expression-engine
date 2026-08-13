import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  captureDisneyExtremeBaseline,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 178 Extreme capture baseline', () => {
  it('clones snapshot factors into an independent baseline', () => {
    expect(captureDisneyExtremeBaseline(null)).toBe(null);
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.85,
      shapeFactor: 1.65,
      bodyOn: true,
      bodyFactor: 1.55,
      eyeFactor: 1.45,
      mouthFactor: 1.5,
    });
    const base = captureDisneyExtremeBaseline(snap);
    expect(base).not.toBe(snap);
    expect(disneyExtremeSnapshotFingerprint(base)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(base.shapeFactor).toBeCloseTo(1.65);
    expect(base.bodyOn).toBe(true);
    const fromOpts = captureDisneyExtremeBaseline({
      enabled: false,
      intensity: 0.5,
      shapeFactor: 1.2,
      bodyOn: false,
      bodyFactor: 1.2,
      eyeFactor: 1.2,
      mouthFactor: 1.2,
    });
    expect(fromOpts.enabled).toBe(false);
    expect(typeof engine.captureDisneyExtremeBaseline).toBe('function');
  });
});
