import { describe, expect, it, vi } from 'vitest';
import {
  TemporalLayer,
  stepOutCurve,
  blinkEnvelope,
  planMicroLeak,
  evaluateMicroLeak,
  isUpperFaceMorph,
} from '../engine/layers/temporalLayer.js';
import { HI_RECIPES } from '../engine/layers/emotionMorphs.js';
import {
  buildLiveLinkFrame,
  morphsToLiveLinkFrame,
  LiveLinkPublisher,
  LIVELINK_PROTOCOL,
} from '../engine/export/liveLinkFace.js';
import { ARKIT_CHANNELS } from '../engine/export/arkitExporter.js';
import { recipeForIntensity, SCULPT_RECIPES } from '../engine/layers/emotionMorphs.js';

describe('hand-tuned intensity sculpts', () => {
  it('subtle happy favors eyes over full mouth smile', () => {
    const subtle = SCULPT_RECIPES.happy.subtle;
    const peak = SCULPT_RECIPES.happy.peak;
    expect(subtle.Expressions_eyeSquintL_max).toBeGreaterThan(0.2);
    expect(subtle.Expressions_mouthSmile_max ?? 0).toBeLessThan(peak.Expressions_mouthSmile_max);
  });

  it('recipeForIntensity crossfades tier recipes', () => {
    const soft = recipeForIntensity('happy', 0.2);
    const mid = recipeForIntensity('happy', 0.5);
    expect(soft.Expressions_eyeSquintL_max).toBeGreaterThan(0);
    expect(mid.Expressions_mouthSmile_max || mid.Expressions_mouthSmileL_max).toBeGreaterThan(0);
  });
});

describe('temporalLayer', () => {
  it('stepOutCurve eases from 1 to 0', () => {
    expect(stepOutCurve(0, 0.5)).toBeCloseTo(1);
    expect(stepOutCurve(0.5, 0.5)).toBeCloseTo(0);
    expect(stepOutCurve(0.25, 0.5)).toBeGreaterThan(0);
    expect(stepOutCurve(0.25, 0.5)).toBeLessThan(1);
  });

  it('blinkEnvelope peaks mid-blink', () => {
    expect(blinkEnvelope(0, 0.16)).toBeCloseTo(0);
    expect(blinkEnvelope(0.08, 0.16)).toBeGreaterThan(0.9);
    expect(blinkEnvelope(0.2, 0.16)).toBe(0);
  });

  it('microLeak is eyes-before-mouth', () => {
    const plan = planMicroLeak({
      suppressedEmotion: 'fear',
      surfaceEmotion: 'happy',
      suppressedIntensity: 0.8,
      durationMs: 200,
      region: 'full',
      symmetry: 0.6,
    });
    expect(plan.phases.eyesStartMs).toBe(0);
    expect(plan.phases.mouthCoverStartMs).toBeGreaterThan(plan.phases.eyesPeakMs);

    const early = evaluateMicroLeak(plan, plan.phases.eyesPeakMs, HI_RECIPES);
    expect(Object.keys(early).some(isUpperFaceMorph)).toBe(true);
  });

  it('TemporalLayer ticks blink and step-out', () => {
    const layer = new TemporalLayer({ recipes: HI_RECIPES });
    layer.setEmotion('angry', 0.8);
    layer.setEmotion('happy', 0.7, { stepOutBefore: true });
    const a = layer.tick(0.05);
    expect(a.residualEmotion).toBe('angry');
    expect(a.stepOutWeight).toBeGreaterThan(0);

    layer.forceBlink();
    const b = layer.tick(0.08);
    expect(b.blink).toBeGreaterThan(0);
  });

  it('forceLeak emits upper-face weights', () => {
    const layer = new TemporalLayer({ recipes: HI_RECIPES });
    layer.setEmotion('happy', 0.5);
    layer.forceLeak('fear');
    const s = layer.tick(0.05);
    expect(Object.keys(s.leakWeights).length).toBeGreaterThan(0);
  });
});

describe('liveLinkFace', () => {
  it('builds 52-channel frames with compliance meta', () => {
    const frame = buildLiveLinkFrame({ jawOpen: 0.4, mouthSmileLeft: 0.2 });
    expect(frame.protocol).toBe(LIVELINK_PROTOCOL);
    expect(Object.keys(frame.blendShapes)).toHaveLength(ARKIT_CHANNELS.length);
    expect(frame.blendShapes.jawOpen).toBeCloseTo(0.4);
    expect(frame.meta?.compliance).toBe('passed');
  });

  it('maps morphs and publishes to subscribers', () => {
    const pub = new LiveLinkPublisher({ subject: 'AmojiSakura' });
    const spy = vi.fn();
    pub.subscribe(spy);
    pub.publishMorphs({ Expressions_mouthSmile_max: 0.8 });
    expect(spy).toHaveBeenCalled();
    const frame = spy.mock.calls[0][0];
    expect(frame.blendShapes.mouthSmileLeft).toBeGreaterThan(0.5);
  });

  it('morphsToLiveLinkFrame works', () => {
    const f = morphsToLiveLinkFrame({ Expressions_eyesVert_max: 0.5 });
    expect(f.blendShapes.eyeLookUpLeft).toBeCloseTo(0.5);
  });
});
