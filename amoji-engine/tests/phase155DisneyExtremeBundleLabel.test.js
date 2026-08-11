import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBundleLabel,
  buildDisneyExtremeLiveSnapshot,
  easeEmotionIntensity,
  disneyExtremeRecipeOverdriveScale,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 155 Extreme bundle label', () => {
  it('formats off legend and on combined readout', () => {
    expect(formatDisneyExtremeBundleLabel({ enabled: false })).toContain(
      'extreme off',
    );
    expect(formatDisneyExtremeBundleLabel({ enabled: false })).toContain(
      'A all',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1.0,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const label = formatDisneyExtremeBundleLabel(snap);
    expect(label).toContain(`shape ${snap.shapeInt.toFixed(2)}`);
    expect(label).toContain(
      `ease ${easeEmotionIntensity(snap.shapeInt).toFixed(2)}`,
    );
    expect(label).toContain(
      `recipe ×${disneyExtremeRecipeOverdriveScale(snap.shapeInt).toFixed(2)}`,
    );
    expect(label).toContain(`mix ${snap.bodyMix.toFixed(2)}`);
    expect(label).toContain(`neck ${snap.neckBlend.toFixed(2)}`);
    expect(
      formatDisneyExtremeBundleLabel({
        enabled: true,
        intensity: 0.5,
        shapeFactor: 1.2,
        bodyOn: false,
      }),
    ).toContain('body off');
    expect(typeof engine.formatDisneyExtremeBundleLabel).toBe('function');
  });
});
