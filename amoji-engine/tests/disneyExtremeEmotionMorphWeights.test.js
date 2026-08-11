import { describe, expect, it } from 'vitest';
import { emotionToMorphWeights } from '../engine/layers/emotionMorphs.js';

describe('Disney Extreme intensity', () => {
  it('increases HI morph weight beyond the old 1.25 cap', () => {
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

    // Pick a morph that is present in the recipe.
    const m1 = at1.Expressions_mouthSmile_max ?? 0;
    const m15 = at15.Expressions_mouthSmile_max ?? 0;
    expect(m15).toBeGreaterThan(m1);
  });
});

