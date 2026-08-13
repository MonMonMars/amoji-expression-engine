import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  disneyExtremeSnapshotFingerprintShort,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 167 Extreme short fingerprint', () => {
  it('is stable, short, and changes when factors move', () => {
    expect(disneyExtremeSnapshotFingerprintShort(null)).toBe('off');
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
    const fa = disneyExtremeSnapshotFingerprintShort(a);
    const fb = disneyExtremeSnapshotFingerprintShort(b);
    expect(fa).toBe(fb);
    expect(fa).toMatch(/^[0-9a-f]{8}$/);
    const c = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(disneyExtremeSnapshotFingerprintShort(c)).not.toBe(fa);
    expect(disneyExtremeSnapshotFingerprintShort(a, { length: 6 })).toHaveLength(
      6,
    );
    expect(typeof engine.disneyExtremeSnapshotFingerprintShort).toBe(
      'function',
    );
  });
});
