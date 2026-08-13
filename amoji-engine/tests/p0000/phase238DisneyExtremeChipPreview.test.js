import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineChipPreviewLabel,
  disneyExtremeSnapshotFingerprintShort,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 238 Extreme baseline chip preview label', () => {
  it('formats hist/redo chip previews', () => {
    expect(formatDisneyExtremeBaselineChipPreviewLabel(null)).toBe(
      'preview · hist · invalid',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const fp = disneyExtremeSnapshotFingerprintShort(snap);
    expect(
      formatDisneyExtremeBaselineChipPreviewLabel(snap, { index: 2 }),
    ).toContain(`preview · hist · #2 fp ${fp}`);
    expect(
      formatDisneyExtremeBaselineChipPreviewLabel(snap, {
        index: 1,
        kind: 'redo',
      }),
    ).toContain(`preview · redo · R#1 fp ${fp}`);
    expect(typeof engine.formatDisneyExtremeBaselineChipPreviewLabel).toBe(
      'function',
    );
  });
});
