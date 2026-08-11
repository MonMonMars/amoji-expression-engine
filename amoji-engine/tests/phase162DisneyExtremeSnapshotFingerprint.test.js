import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 162 Extreme snapshot fingerprint', () => {
  it('is stable for equal snaps and changes when factors move', () => {
    expect(disneyExtremeSnapshotFingerprint(null)).toBe('off');
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(disneyExtremeSnapshotFingerprint(a)).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    const c = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(disneyExtremeSnapshotFingerprint(c)).not.toBe(
      disneyExtremeSnapshotFingerprint(a),
    );
    expect(typeof engine.disneyExtremeSnapshotFingerprint).toBe('function');
  });
});
