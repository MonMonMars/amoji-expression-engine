import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeSnapshotHash,
  decodeDisneyExtremeSnapshotHash,
  DISNEY_EXTREME_SNAPSHOT_HASH_PARAM,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 214 Extreme snapshot hash encode/decode', () => {
  it('round-trips dxs= hash and rejects empty', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.85,
      shapeFactor: 1.55,
      bodyOn: true,
      bodyFactor: 1.45,
      eyeFactor: 1.5,
      mouthFactor: 1.6,
    });
    const frag = encodeDisneyExtremeSnapshotHash(snap);
    expect(frag.startsWith(`${DISNEY_EXTREME_SNAPSHOT_HASH_PARAM}=`)).toBe(
      true,
    );
    const decoded = decodeDisneyExtremeSnapshotHash(`#${frag}`);
    expect(decoded.ok).toBe(true);
    expect(disneyExtremeSnapshotFingerprint(decoded.snap)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeSnapshotHash('').ok).toBe(false);
    expect(decodeDisneyExtremeSnapshotHash('#flp=abc').error).toBe('no_dxs');
    expect(engine.DISNEY_EXTREME_SNAPSHOT_HASH_PARAM).toBe(
      DISNEY_EXTREME_SNAPSHOT_HASH_PARAM,
    );
  });
});
