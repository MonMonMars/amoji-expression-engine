import { describe, expect, it } from 'vitest';
import {
  EMOTIONS,
  emotionToMorphWeights,
  applyMorphWeights,
} from '../engine/layers/emotionMorphs.js';

describe('emotionMorphs', () => {
  const loMorphs = [
    'EMO_happy',
    'EMO_sad',
    'EMO_angry',
    'EMO_surprised',
    'EMO_fear',
    'EMO_disgust',
    'EMO_thinking',
    'EMO_smile_open',
  ];
  const hiMorphs = [
    ...loMorphs,
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

  it('LO uses combined EMO_ shapes', () => {
    const w = emotionToMorphWeights('lo', 'happy', 0.8, loMorphs);
    expect(w.EMO_happy).toBeCloseTo(0.8);
    expect(Object.keys(w)).toHaveLength(1);
  });

  it('HI prefers fine Expression_ keys', () => {
    const w = emotionToMorphWeights('hi', 'happy', 1, hiMorphs);
    expect(w.Expressions_mouthSmile_max).toBeGreaterThan(0.5);
    expect(w.EMO_happy).toBeUndefined();
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
