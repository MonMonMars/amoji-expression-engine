import { describe, expect, it } from 'vitest';
import {
  MOODS,
  getMoodDef,
  moodBlendAlpha,
  applyMoodBias,
  moodIdleBaseline,
  MoodController,
  MOOD_TRANSITION_HALF_LIFE_SEC,
} from '../../engine/layers/moodEngine.js';
import {
  BODY_POINT_COUNT,
  FACE_POINT_COUNT,
  FULL_BODY_POINT_BUDGET,
  getBodyPoint,
  bodyPointToBone,
  retargetLayerB,
  retargetLayerW,
  retargetLayerG,
  retargetBody,
} from '../../engine/layers/bodyRetarget.js';
import { evaluateBody, sampleBodyPose } from '../../engine/layers/neckShoulder.js';
import { evaluateGait, sampleWalkPose } from '../../engine/layers/gait.js';
import { resolveGestureLayer, sampleGesturePose } from '../../engine/layers/gesture.js';

describe('Layer -1 MoodEngine', () => {
  it('catalog includes core moods', () => {
    expect(MOODS.embarrassed).toBeTruthy();
    expect(MOODS.suspicious.gazeBias).toBe('avoid');
    expect(MOOD_TRANSITION_HALF_LIFE_SEC).toBeGreaterThan(1);
  });

  it('bias suppresses happy under embarrassment', () => {
    const b = applyMoodBias('happy', 1, {
      state: 'embarrassed',
      baseline_intensity: 0.5,
    });
    expect(b.intensity).toBeLessThan(1);
    expect(b.suppression).toBeGreaterThan(0);
    expect(b.leakIntensity).toBeGreaterThan(0);
  });

  it('facilitation boosts fear under anxiety', () => {
    const plain = applyMoodBias('fear', 0.5, { state: 'neutral' });
    const anx = applyMoodBias('fear', 0.5, {
      state: 'anxious',
      baseline_intensity: 0.5,
    });
    expect(anx.intensity).toBeGreaterThan(plain.intensity);
  });

  it('idle baseline leaks signature morphs', () => {
    const base = moodIdleBaseline('suspicious', 0.4);
    expect(base.morphs.Expressions_eyeSquintR_max).toBeGreaterThan(0);
    expect(base.meta?.compliance).toBe('passed');
  });

  it('MoodController transitions slowly', () => {
    const mc = new MoodController({ state: 'neutral' });
    mc.setMood('embarrassed', 0.4);
    let s = mc.tick(0.1);
    expect(s.transitioning).toBe(true);
    expect(s.state).toBe('neutral');
    for (let i = 0; i < 80; i++) s = mc.tick(0.5);
    expect(s.state).toBe('embarrassed');
    expect(s.baseline).toBeGreaterThan(0.2);
    expect(moodBlendAlpha(MOOD_TRANSITION_HALF_LIFE_SEC)).toBeCloseTo(0.5, 2);
    expect(getMoodDef('content').facilitation.happy).toBeGreaterThan(0);
  });
});

describe('body retarget', () => {
  it('ships face+body point budget', () => {
    expect(FACE_POINT_COUNT).toBe(77);
    expect(BODY_POINT_COUNT).toBeGreaterThanOrEqual(40);
    expect(FULL_BODY_POINT_BUDGET).toBe(FACE_POINT_COUNT + BODY_POINT_COUNT);
    expect(getBodyPoint('SH-L')?.layers).toContain('B');
    expect(bodyPointToBone('UA-L')).toBe('upperarm_L');
  });

  it('Layer B raises shoulders with accessory activation', () => {
    const ev = evaluateBody('fear', 1);
    const pose = sampleBodyPose(ev.body, 0.5);
    const d = retargetLayerB(ev.body, pose);
    expect(d['SH-L'].y).toBeGreaterThan(0.02);
    expect(d['CS-CTR'].y).not.toBe(0);
  });

  it('Layer W fear emphasizes elbow swing points', () => {
    const g = evaluateGait('fear', 1).gait;
    const walk = sampleWalkPose(g, 0.25);
    const d = retargetLayerW(g, walk, 0.25);
    expect(Math.abs(d['EL-L'].z) + Math.abs(d['EL-R'].z)).toBeGreaterThan(0);
    expect(Math.abs(d['TH-L'].z) + Math.abs(d['KN-L'].y)).toBeGreaterThan(0);
  });

  it('Layer G wave moves WR-R', () => {
    const resolved = resolveGestureLayer({ emblem: 'wave', emotion: 'happy', intensity: 1 });
    const sample = sampleGesturePose(resolved, 0.2);
    const d = retargetLayerG(sample);
    expect(Math.hypot(d['WR-R'].x, d['WR-R'].y, d['WR-R'].z)).toBeGreaterThan(0.01);
  });

  it('retargetBody merges B+W+G with compliance', () => {
    const ev = evaluateBody('angry', 1, { gazeLock: 0.9 });
    const pose = sampleBodyPose(ev.body, 0.3);
    const g = evaluateGait('angry', 1).gait;
    const walk = sampleWalkPose(g, 0.1);
    const gest = sampleGesturePose(
      resolveGestureLayer({ emotion: 'angry', intensity: 1 }),
      0,
    );
    const out = retargetBody({
      body: ev.body,
      bodyPose: pose,
      gait: g,
      walk,
      walkPhase: 0.1,
      gesture: gest,
    });
    expect(out.kind).toBe('body_retarget');
    expect(out.top.length).toBeGreaterThan(0);
    expect(out.meta?.compliance).toBe('passed');
  });
});
