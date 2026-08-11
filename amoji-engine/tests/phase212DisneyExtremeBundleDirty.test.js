import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBundleLabel,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 212 Extreme bundle label dirty bit', () => {
  it('appends clean/dirty×N when baseline is passed', () => {
    const baseline = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const fp = disneyExtremeSnapshotFingerprintShort(baseline);
    expect(
      formatDisneyExtremeBundleLabel(baseline, { baseline }),
    ).toContain(` · clean ${fp}`);
    const dirty = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const dirtyLabel = formatDisneyExtremeBundleLabel(dirty, { baseline });
    expect(dirtyLabel).toMatch(/ · dirty×\d+ /);
    expect(dirtyLabel).toContain(fp);
    expect(
      formatDisneyExtremeBundleLabel({ enabled: false }, { baseline }),
    ).toContain('extreme off');
    expect(
      formatDisneyExtremeBundleLabel({ enabled: false }, { baseline }),
    ).toContain('dirty');
    expect(typeof engine.formatDisneyExtremeBundleLabel).toBe('function');
  });
});
