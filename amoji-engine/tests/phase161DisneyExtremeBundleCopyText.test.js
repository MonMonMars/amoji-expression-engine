import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBundleLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 161 Extreme bundle copy text stable', () => {
  it('copy text matches formatDisneyExtremeBundleLabel(snapshot)', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const text = formatDisneyExtremeBundleLabel(snap);
    expect(text).toBe(formatDisneyExtremeBundleLabel({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    }));
    expect(text.startsWith('shape ')).toBe(true);
    expect(engine.formatDisneyExtremeBundleLabel(snap)).toBe(text);
  });
});
