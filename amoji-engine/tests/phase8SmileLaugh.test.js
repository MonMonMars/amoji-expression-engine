import { describe, expect, it } from 'vitest';
import {
  evaluateSmile,
  evaluateLaugh,
  resolveHappyFamily,
  defaultSmileForPersona,
  personaAllowsLaugh,
  contagionFreshness,
  pdStep,
  sampleLaughBody,
  SmileLaughController,
  LAUGHTER_INTENSITY_GATE,
  applyYouthfulSmileBias,
  mergeHappyFamilyMorphs,
  mouthOpennessFromMorphs,
} from '../engine/layers/smileLaugh.js';

describe('smile typology', () => {
  it('persona defaults match spec', () => {
    expect(defaultSmileForPersona('companion')).toBe('reward');
    expect(defaultSmileForPersona('corporate')).toBe('affiliative');
    expect(defaultSmileForPersona('care')).toBe('affiliative');
    expect(personaAllowsLaugh('corporate')).toBe(false);
    expect(personaAllowsLaugh('companion')).toBe(true);
  });

  it('reward is Duchenne with cheek/eye; affiliative is not', () => {
    const reward = evaluateSmile('reward', 1);
    const aff = evaluateSmile('affiliative', 1);
    expect(reward.duchenne).toBe(true);
    expect(aff.duchenne).toBe(false);
    expect(reward.morphs.Expressions_eyeSquintL_max).toBeGreaterThan(0.12);
    expect(reward.morphs.Expressions_eyeSquintL_max).toBeLessThan(0.35);
    expect(aff.morphs.Expressions_eyeSquintL_max || 0).toBe(0);
    expect(aff.morphs.Expressions_mouthClosed_max).toBeGreaterThan(0.2);
  });

  it('dominance smile is asymmetric', () => {
    const d = evaluateSmile('dominance', 1);
    expect(d.symmetric).toBe(false);
    expect(d.morphs.Expressions_mouthSmileR_max).toBeGreaterThan(
      d.morphs.Expressions_mouthSmileL_max,
    );
  });

  it('resolveHappyFamily gates laughter by persona + intensity', () => {
    const low = resolveHappyFamily({
      emotion: 'happy',
      intensity: 0.5,
      smileType: 'reward',
      personaId: 'companion',
    });
    expect(low.mode).toBe('smile');

    const corp = resolveHappyFamily({
      emotion: 'smile_open',
      intensity: 1,
      smileType: 'reward',
      personaId: 'corporate',
    });
    expect(corp.laugh).toBe(false);
    expect(corp.smileType).toBe('affiliative');

    const forced = resolveHappyFamily({
      emotion: 'happy',
      intensity: 1,
      forceLaugh: true,
      personaId: 'corporate',
    });
    expect(forced.laugh).toBe(true);
  });
});

describe('laughter PD body', () => {
  it('contagion freshness decays with repeats', () => {
    expect(contagionFreshness(0)).toBeCloseTo(1, 1);
    expect(contagionFreshness(5)).toBeLessThan(contagionFreshness(1));
  });

  it('pdStep approaches target', () => {
    let x = 0;
    let v = 0;
    for (let i = 0; i < 40; i++) {
      ({ value: x, velocity: v } = pdStep(x, 1, v, 1 / 60));
    }
    expect(x).toBeGreaterThan(0.7);
  });

  it('sampleLaughBody derives torso from head via PD state', () => {
    let state = { torso: 0, shoulder: 0, vTorso: 0, vShoulder: 0 };
    let lastHead = 0;
    for (let i = 0; i < 10; i++) {
      const b = sampleLaughBody(i * 0.03, { intensity: 1, freshness: 1, state, dt: 0.03 });
      state = b.state;
      lastHead = b.headPitch;
    }
    expect(Math.abs(lastHead)).toBeGreaterThan(0.01);
    expect(Math.abs(state.torso)).toBeGreaterThan(0);
  });

  it('evaluateLaugh returns morphs + body with compliance', () => {
    const out = evaluateLaugh(1, { timeSec: 0.2, personaId: 'companion' });
    expect(out.kind).toBe('laughter');
    expect(out.meta?.compliance).toBe('passed');
    expect(out.morphs.Expressions_mouthSmileOpen_max).toBeGreaterThan(0.5);
    expect(out.morphs.Expressions_mouthOpenLarge_max).toBeGreaterThan(0.6);
    expect(out.morphs.Expressions_eyeSquintL_max).toBeLessThan(0.3);
    expect(out.body.headPitch).toBeDefined();
  });

  it('SmileLaughController ticks laugh then smile', () => {
    const c = new SmileLaughController({ personaId: 'companion' });
    expect(c.smileType).toBe('reward');
    c.startLaugh(1);
    const a = c.tick(0.05, { emotion: 'happy', intensity: 1 });
    expect(a.kind).toBe('laughter');
    expect(a.body.headPitch).toBeDefined();
    c.stopLaugh();
    c.setSmileType('affiliative');
    const b = c.tick(0.05, { emotion: 'happy', intensity: 0.6 });
    expect(b.smileType).toBe('affiliative');
    expect(LAUGHTER_INTENSITY_GATE).toBe(0.8);
  });
});

describe('youthful smile bias (Pixar-style laugh)', () => {
  it('caps orbital squint and attenuates cheek when mouth is open', () => {
    const raw = {
      Expressions_eyeSquintL_max: 0.75,
      Expressions_eyeSquintR_max: 0.75,
      Expressions_mouthSmile_max: 0.95,
      Expressions_mouthSmileL_max: 0.7,
      Expressions_mouthSmileOpen_max: 0.9,
      Expressions_mouthOpenLarge_max: 0.88,
    };
    const biased = applyYouthfulSmileBias(raw, { kind: 'laughter', intensity: 1 });
    expect(biased.Expressions_eyeSquintL_max).toBeLessThan(0.28);
    expect(biased.Expressions_mouthSmile_max).toBeLessThan(raw.Expressions_mouthSmile_max);
    expect(biased.Expressions_mouthOpenLarge_max).toBeGreaterThanOrEqual(raw.Expressions_mouthOpenLarge_max);
    expect(mouthOpennessFromMorphs(biased)).toBeGreaterThan(0.6);
  });

  it('mergeHappyFamilyMorphs replaces squint/cheek instead of max-stacking', () => {
    const base = {
      Expressions_eyeSquintL_max: 0.35,
      Expressions_mouthSmile_max: 0.85,
      Expressions_mouthOpenLarge_max: 0.2,
    };
    const overlay = {
      Expressions_eyeSquintL_max: 0.24,
      Expressions_mouthSmile_max: 0.78,
      Expressions_mouthOpenLarge_max: 0.88,
    };
    const merged = mergeHappyFamilyMorphs(base, overlay, { kind: 'laughter', intensity: 1 });
    expect(merged.Expressions_eyeSquintL_max).toBeLessThan(0.28);
    expect(merged.Expressions_mouthSmile_max).toBeLessThan(0.7);
    expect(merged.Expressions_mouthOpenLarge_max).toBeGreaterThan(0.85);
  });
});
