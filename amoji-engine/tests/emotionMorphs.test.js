import { describe, expect, it } from 'vitest';
import {
  EMOTIONS,
  emotionToMorphWeights,
  intensityTierWeights,
  easeEmotionIntensity,
  applyMorphWeights,
} from '../engine/layers/emotionMorphs.js';

describe('emotionMorphs', () => {
  const loLegacy = [
    'EMO_happy',
    'EMO_sad',
    'EMO_angry',
    'EMO_surprised',
    'EMO_fear',
    'EMO_disgust',
    'EMO_thinking',
    'EMO_smile_open',
  ];
  const loTiers = [
    ...loLegacy,
    'EMO_happy_subtle',
    'EMO_happy_medium',
    'EMO_happy_peak',
  ];
  const hiMorphs = [
    ...loLegacy,
    'Expressions_mouthSmile_max',
    'Expressions_browSqueezeL_max',
    'Expressions_browSqueezeR_max',
    'Expressions_mouthOpenLarge_max',
    'Expressions_browsMidVert_max',
  ];

  it('lists core emotions', () => {
    expect(EMOTIONS).toContain('happy');
    expect(EMOTIONS).toContain('angry');
  });

  it('LO legacy uses combined EMO_ shapes', () => {
    const w = emotionToMorphWeights('lo', 'happy', 0.8, loLegacy);
    expect(w.EMO_happy).toBeCloseTo(0.8);
    expect(Object.keys(w)).toHaveLength(1);
  });

  it('LO intensity tiers crossfade subtle→medium→peak', () => {
    const mid = intensityTierWeights('happy', 0.5, new Set(loTiers));
    expect(mid.EMO_happy_subtle).toBeGreaterThan(0);
    expect(mid.EMO_happy_medium).toBeGreaterThan(0);
    expect(mid.EMO_happy_peak).toBeUndefined();

    const peak = intensityTierWeights('happy', 1, new Set(loTiers));
    expect(peak.EMO_happy_peak).toBeCloseTo(1);
  });

  it('HI prefers fine Expression_ keys with eased intensity', () => {
    const w = emotionToMorphWeights('hi', 'happy', 1, hiMorphs);
    expect(w.Expressions_mouthSmile_max).toBeGreaterThan(0.5);
    expect(w.EMO_happy).toBeUndefined();
    const soft = emotionToMorphWeights('hi', 'happy', 0.3, hiMorphs);
    expect(soft.Expressions_mouthSmile_max).toBeLessThan(w.Expressions_mouthSmile_max * 0.55);
  });

  it('easeEmotionIntensity is smoothstep-like under 1', () => {
    expect(easeEmotionIntensity(0)).toBe(0);
    expect(easeEmotionIntensity(1)).toBeCloseTo(1);
    expect(easeEmotionIntensity(0.5)).toBeCloseTo(0.5);
  });

  it('neutral clears weights', () => {
    const w = emotionToMorphWeights('hi', 'neutral', 1, hiMorphs);
    expect(Object.keys(w)).toHaveLength(0);
  });

  it('applyMorphWeights lerps influences', () => {
    const mesh = {
      morphTargetDictionary: { EMO_happy: 0, EMO_sad: 1 },
      morphTargetInfluences: [0, 0.5],
    };
    applyMorphWeights(mesh, { EMO_happy: 1 }, 1);
    expect(mesh.morphTargetInfluences[0]).toBeCloseTo(1);
    expect(mesh.morphTargetInfluences[1]).toBeCloseTo(0);
  });
});
