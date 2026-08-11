import { describe, expect, it } from 'vitest';
import {
  lookToEyeMorphWeights,
  saccadeOffset,
  mergeEyeWeights,
} from '../engine/layers/eyeLook.js';
import {
  ARKIT_CHANNELS,
  morphWeightsToArkit,
  muscleActivationsToArkit,
  arkitNonZero,
  emptyArkitWeights,
} from '../engine/export/arkitExporter.js';

describe('eyeLook', () => {
  const morphs = [
    'Expressions_eyesHoriz_max',
    'Expressions_eyesHoriz_min',
    'Expressions_eyesVert_max',
    'Expressions_eyesVert_min',
  ];

  it('maps look axes to horiz/vert morphs', () => {
    const w = lookToEyeMorphWeights(0.5, -0.25, morphs);
    expect(w.Expressions_eyesHoriz_max).toBeCloseTo(0.5);
    expect(w.Expressions_eyesVert_min).toBeCloseTo(0.25);
    expect(w.Expressions_eyesHoriz_min).toBeUndefined();
  });

  it('saccade returns bounded offsets', () => {
    const s = saccadeOffset(1.25, 0.1);
    expect(Math.abs(s.x)).toBeLessThanOrEqual(0.11);
    expect(Math.abs(s.y)).toBeLessThanOrEqual(0.11);
  });

  it('mergeEyeWeights takes max', () => {
    const t = { Expressions_eyesHoriz_max: 0.2 };
    mergeEyeWeights(t, { Expressions_eyesHoriz_max: 0.5, Expressions_eyesVert_max: 0.1 });
    expect(t.Expressions_eyesHoriz_max).toBeCloseTo(0.5);
    expect(t.Expressions_eyesVert_max).toBeCloseTo(0.1);
  });
});

describe('arkitExporter', () => {
  it('exposes 52 channels', () => {
    expect(ARKIT_CHANNELS).toHaveLength(52);
    expect(Object.keys(emptyArkitWeights())).toHaveLength(52);
  });

  it('maps Expression smile + brow to ARKit', () => {
    const a = morphWeightsToArkit({
      Expressions_mouthSmile_max: 0.8,
      Expressions_browSqueezeL_max: 0.5,
    });
    expect(a.mouthSmileLeft).toBeCloseTo(0.8);
    expect(a.mouthSmileRight).toBeCloseTo(0.8);
    expect(a.browDownLeft).toBeCloseTo(0.45);
  });

  it('maps M10 zygomatic to mouthSmile', () => {
    const a = muscleActivationsToArkit({ M10: 0.9 });
    expect(a.mouthSmileLeft).toBeCloseTo(0.9);
    expect(a.mouthSmileRight).toBeCloseTo(0.9);
  });

  it('maps eye look morphs to ARKit look channels', () => {
    const a = morphWeightsToArkit({ Expressions_eyesVert_max: 0.6 });
    expect(a.eyeLookUpLeft).toBeCloseTo(0.6);
    expect(a.eyeLookUpRight).toBeCloseTo(0.6);
  });

  it('arkitNonZero filters', () => {
    const nz = arkitNonZero({ jawOpen: 0.4, tongueOut: 0.005, mouthSmileLeft: 0.2 });
    expect(nz.jawOpen).toBe(0.4);
    expect(nz.tongueOut).toBeUndefined();
  });
});
