import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  easeEmotionIntensity,
  disneyExtremeRecipeOverdriveScale,
  DISNEY_EXTREME_DEFAULTS,
} from '../engine/layers/emotionMorphs.js';
import {
  disneyExtremeBodyMix,
  DISNEY_EXTREME_NECK_SCALE_BLEND,
} from '../engine/layers/neckShoulder.js';
import * as engine from '../engine/index.js';

describe('Phase 154 Extreme live snapshot helper', () => {
  it('builds ints + ease/recipe/mix/neck + factors', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1.0,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(snap.enabled).toBe(true);
    expect(snap.shapeInt).toBeCloseTo(1.5);
    expect(snap.bodyInt).toBeCloseTo(1.6);
    expect(snap.ease).toBeCloseTo(easeEmotionIntensity(1.5));
    expect(snap.recipe).toBeCloseTo(disneyExtremeRecipeOverdriveScale(1.5));
    expect(snap.bodyMix).toBeCloseTo(disneyExtremeBodyMix(1.6));
    expect(snap.neckBlend).toBe(DISNEY_EXTREME_NECK_SCALE_BLEND);
    expect(snap.eyeFactor).toBe(DISNEY_EXTREME_DEFAULTS.eyeFactor);
    const off = buildDisneyExtremeLiveSnapshot({
      enabled: false,
      intensity: 0.7,
      bodyOn: true,
    });
    expect(off.bodyOn).toBe(false);
    expect(off.shapeFactor).toBe(DISNEY_EXTREME_DEFAULTS.shapeFactor);
    expect(typeof engine.buildDisneyExtremeLiveSnapshot).toBe('function');
  });
});
