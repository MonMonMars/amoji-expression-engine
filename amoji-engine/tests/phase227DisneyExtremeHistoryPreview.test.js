import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineHistoryPreviewLabel,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 227 Extreme hist preview label', () => {
  it('formats invalid / empty / tip preview', () => {
    expect(formatDisneyExtremeBaselineHistoryPreviewLabel(null)).toBe(
      'preview · hist · invalid',
    );
    expect(formatDisneyExtremeBaselineHistoryPreviewLabel([])).toBe(
      'preview · hist · empty',
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
      formatDisneyExtremeBaselineHistoryPreviewLabel([snap]),
    ).toBe(`preview · hist 1 · tip #1 ${fp}`);
    expect(typeof engine.formatDisneyExtremeBaselineHistoryPreviewLabel).toBe(
      'function',
    );
  });
});
