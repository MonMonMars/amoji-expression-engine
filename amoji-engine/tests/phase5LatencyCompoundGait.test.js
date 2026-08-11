import { describe, expect, it } from 'vitest';
import {
  latencyTier,
  pickFiller,
  improviseReaction,
  LatencyBridge,
  LATENCY_THRESHOLDS,
} from '../engine/layers/latencyBridge.js';
import {
  COMPOUNDS,
  classifyFaceRegion,
  evaluateCompound,
  compoundToMorphWeights,
  mergeByRegion,
} from '../engine/layers/compoundEmotion.js';
import { evaluateGait, sampleWalkPose } from '../engine/layers/gait.js';

describe('Layer T latency bridge', () => {
  it('tiers by elapsed time', () => {
    expect(latencyTier(0.1)).toBe('none');
    expect(latencyTier(0.5)).toBe('gaze');
    expect(latencyTier(1.5)).toBe('pensive');
    expect(latencyTier(4)).toBe('secondary');
    expect(LATENCY_THRESHOLDS.pensive).toBe(3);
  });

  it('picks contextual fillers', () => {
    const f = pickFiller('companion', 'pensive', { contextHint: '天氣' });
    expect(f.zh).toContain('天氣');
  });

  it('LatencyBridge escalates and recovers', () => {
    const bridge = new LatencyBridge({ personaId: 'corporate' });
    bridge.start({ contextHint: 'invoice' });
    let s = bridge.tick(0.2);
    expect(s.tier).toBe('none');
    s = bridge.tick(0.5);
    expect(s.tier).toBe('gaze');
    expect(s.lookY).toBeGreaterThan(0);
    // jump into pensive
    bridge.elapsed = 1.2;
    s = bridge.tick(0.05);
    expect(s.tier).toBe('pensive');
    expect(s.filler?.text).toBeTruthy();
    bridge.resolve();
    s = bridge.tick(0.05);
    expect(s.phase).toBe('recovery');
  });

  it('improviseReaction respects persona playfulness', () => {
    const loud = improviseReaction({ stimulus: 'interrupt', personaId: 'companion' });
    const quiet = improviseReaction({ stimulus: 'interrupt', personaId: 'corporate' });
    expect(loud.intensity).toBeGreaterThanOrEqual(quiet.intensity);
    expect(loud.meta?.compliance).toBe('passed');
  });
});

describe('compound emotion engine', () => {
  it('ships six priority compounds', () => {
    expect(Object.keys(COMPOUNDS)).toHaveLength(6);
    expect(COMPOUNDS.happy_surprised.primary).toBe('happy');
    expect(COMPOUNDS.happy_surprised.secondary).toBe('surprised');
  });

  it('classifies face regions', () => {
    expect(classifyFaceRegion('Expressions_browsMidVert_max')).toBe('brow');
    expect(classifyFaceRegion('Expressions_mouthSmile_max')).toBe('mouth');
    expect(classifyFaceRegion('Expressions_eyeSquintL_max')).toBe('eye');
  });

  it('mergeByRegion is not a 50/50 average', () => {
    const merged = mergeByRegion(
      { Expressions_mouthSmile_max: 0.8, Expressions_browsMidVert_max: 0.1 },
      { Expressions_mouthSmile_max: 0.1, Expressions_browsMidVert_max: 0.9 },
      { brow: 'secondary', mouth: 'primary', eye: 'secondary', cheek: 'primary', nose: 'primary', jaw: 'primary' },
    );
    expect(merged.Expressions_mouthSmile_max).toBe(0.8);
    expect(merged.Expressions_browsMidVert_max).toBe(0.9);
  });

  it('evaluateCompound returns ownership metadata', () => {
    const out = evaluateCompound('happy_surprised', 1);
    expect(out.label).toContain('驚訝');
    expect(out.primary).toBe('happy');
    expect(out.secondary).toBe('surprised');
    expect(out.params).toBeTruthy();
  });

  it('compoundToMorphWeights pulls surprised brows + happy mouth', () => {
    const morphs = [
      'Expressions_mouthSmile_max',
      'Expressions_mouthSmileL_max',
      'Expressions_browsMidVert_max',
      'Expressions_browOutVertL_max',
      'Expressions_eyeSquintL_max',
      'Expressions_mouthOpenLarge_max',
    ];
    const w = compoundToMorphWeights('happy_surprised', 1, morphs);
    expect(w.Expressions_mouthSmile_max || w.Expressions_mouthSmileL_max).toBeGreaterThan(0);
    expect(w.Expressions_browsMidVert_max || w.Expressions_browOutVertL_max).toBeGreaterThan(0);
  });
});

describe('Layer W gait', () => {
  it('fear uses elbow arm swing and short stride', () => {
    const g = evaluateGait('fear', 1).gait;
    expect(g.armSwingOrigin).toBe('elbow');
    expect(g.strideLength).toBeLessThan(0.75);
    expect(g.cadence).toBeGreaterThan(1.2);
  });

  it('happy bounces more than sad', () => {
    const happy = evaluateGait('happy', 1).gait;
    const sad = evaluateGait('sad', 1).gait;
    expect(happy.verticalBounce).toBeGreaterThan(sad.verticalBounce);
    expect(happy.walkSpeed).toBeGreaterThan(sad.walkSpeed);
  });

  it('sampleWalkPose scales with amplitude', () => {
    const g = evaluateGait('angry', 1).gait;
    const pose = sampleWalkPose(g, 0.25);
    expect(Math.abs(pose.armL)).toBeGreaterThan(0);
  });
});
