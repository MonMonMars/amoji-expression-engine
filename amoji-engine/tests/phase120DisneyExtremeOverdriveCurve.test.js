import { describe, expect, it } from 'vitest';
import {
  easeEmotionIntensity,
  recipeForIntensity,
  intensityTierWeights,
  emotionToMorphWeights,
  DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
  DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN,
  DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 120 Disney Extreme overdrive curve punch', () => {
  it('uses stronger Extreme-band ease + recipe gains', () => {
    expect(DISNEY_EXTREME_EASE_OVERDRIVE_GAIN).toBeGreaterThan(1.25);
    expect(DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN).toBeGreaterThan(0.6);
    expect(easeEmotionIntensity(1.5)).toBeCloseTo(
      1 + 0.5 * DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
    );
    expect(easeEmotionIntensity(1.5)).toBeGreaterThan(1 + 0.5 * 1.25);

    const peakKey = Object.keys(recipeForIntensity('happy', 1.0))[0];
    expect(peakKey).toBeTruthy();
    const at1 = recipeForIntensity('happy', 1.0)[peakKey];
    const at15 = recipeForIntensity('happy', 1.5)[peakKey];
    expect(at15 / at1).toBeCloseTo(
      1 + 0.5 * DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN,
      5,
    );
    expect(at15 / at1).toBeGreaterThan(1 + 0.5 * 0.6);

    const lo = intensityTierWeights(
      'happy',
      1.6,
      new Set(['EMO_happy_subtle', 'EMO_happy_medium', 'EMO_happy_peak', 'EMO_happy']),
    );
    expect(lo.EMO_happy).toBeCloseTo(
      Math.min(DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP, 0.6 * DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP),
    );

    expect(engine.DISNEY_EXTREME_EASE_OVERDRIVE_GAIN).toBe(
      DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
    );
  });

  it('HI happy morphs punch harder at 1.5 than the prior overdrive slope', () => {
    const hiMorphs = [
      'Expressions_mouthSmile_max',
      'Expressions_eyeSquintL_max',
      'Expressions_eyeSquintR_max',
      'Expressions_browSqueezeL_max',
      'Expressions_browSqueezeR_max',
      'Expressions_mouthOpenLarge_max',
      'Expressions_browsMidVert_max',
      'EMO_happy',
    ];
    const at1 = emotionToMorphWeights('hi', 'happy', 1.0, hiMorphs);
    const at15 = emotionToMorphWeights('hi', 'happy', 1.5, hiMorphs);
    const m1 = at1.Expressions_mouthSmile_max ?? 0;
    const m15 = at15.Expressions_mouthSmile_max ?? 0;
    expect(m15).toBeGreaterThan(m1 * (1 + 0.5 * 0.6));
  });
});
