import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeSnapshotShareUrl,
  loadDisneyExtremeSnapshotFromHash,
  encodeDisneyExtremeSnapshotHash,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 215 Extreme snapshot share URL + loadFromHash', () => {
  it('builds share URL and loads from hash, merging params', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.6,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const share = buildDisneyExtremeSnapshotShareUrl(snap, {
      baseUrl: 'https://example.test/prototypes/face-live.html',
      mergeHash: false,
    });
    expect(share.ok).toBe(true);
    expect(share.url).toContain('#dxs=');
    expect(share.url.startsWith('https://example.test/')).toBe(true);

    const merged = buildDisneyExtremeSnapshotShareUrl(snap, {
      baseUrl: 'https://example.test/face-live.html',
      hash: '#flp=abc&dxs=old',
    });
    expect(merged.hash).toContain('flp=abc');
    expect(merged.hash.match(/dxs=/g)).toHaveLength(1);

    const loaded = loadDisneyExtremeSnapshotFromHash({
      hash: `#${encodeDisneyExtremeSnapshotHash(snap)}`,
    });
    expect(loaded.ok).toBe(true);
    expect(disneyExtremeSnapshotFingerprint(loaded.snap)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(loadDisneyExtremeSnapshotFromHash({ hash: '#flp=x' }).error).toBe(
      'no_dxs',
    );
    expect(typeof engine.buildDisneyExtremeSnapshotShareUrl).toBe('function');
  });
});
