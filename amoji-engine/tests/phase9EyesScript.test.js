import { describe, expect, it } from 'vitest';
import {
  headEyeShare,
  resolveHeadEye,
  applyVor,
  pupilScaleForEmotion,
  fixationMicro,
  presentationLook,
  resolveGazeDirection,
  evaluateEyes,
  EyeController,
  EYE_ONLY_DEG,
} from '../engine/layers/eyeAnchor.js';
import {
  validateScriptLine,
  normalizeScriptLine,
  applyMoodBias,
  matchCompound,
  performScript,
  SCRIPT_EXAMPLE,
} from '../engine/layers/scriptLine.js';

describe('Layer E eyes', () => {
  it('head–eye share thresholds at 27° / 60°', () => {
    expect(headEyeShare(10)).toBe('eye');
    expect(headEyeShare(EYE_ONLY_DEG + 1)).toBe('mixed');
    expect(headEyeShare(70)).toBe('head');
  });

  it('resolveHeadEye keeps small offsets eye-only', () => {
    const r = resolveHeadEye(15, 0);
    expect(r.modeH).toBe('eye');
    expect(Math.abs(r.headYaw)).toBeLessThan(0.01);
    expect(Math.abs(r.lookX)).toBeGreaterThan(0);
  });

  it('VOR counters head yaw when locked', () => {
    const v = applyVor(0.2, 0.1, { headYawDelta: 0.15, headPitchDelta: 0, gain: 1 });
    expect(v.lookX).toBeCloseTo(0.05, 5);
  });

  it('pupil tables differ robot vs human for anger', () => {
    expect(pupilScaleForEmotion('angry', 'robot')).toBeLessThan(0);
    expect(pupilScaleForEmotion('disgust', 'human')).toBeGreaterThan(
      pupilScaleForEmotion('happy', 'human'),
    );
  });

  it('negative emotion lowers microsaccade rate', () => {
    const n = fixationMicro(1, { emotion: 'neutral' });
    const a = fixationMicro(1, { emotion: 'angry' });
    expect(a.hz).toBeLessThan(n.hz);
  });

  it('presentation scan visits triangle anchors', () => {
    const a = presentationLook(0.1);
    const b = presentationLook(4.1);
    expect(a.anchorIndex).not.toBe(b.anchorIndex);
  });

  it('EyeController turn-start averts then locks', () => {
    const ec = new EyeController({ gaze: 'lock' });
    ec.signalTurnStart();
    const a = ec.tick(0.05, { emotion: 'thinking', intensity: 0.5 });
    expect(a.gaze).toBe('averted');
    ec.tick(0.5, { emotion: 'happy', intensity: 0.5 });
    expect(ec.gaze).toBe('lock');
  });

  it('evaluateEyes returns morphs + compliance', () => {
    const out = evaluateEyes({
      gaze: 'lock',
      emotion: 'happy',
      intensity: 1,
      availableMorphs: ['Expressions_eyesHoriz_max', 'Expressions_eyesVert_max'],
    });
    expect(out.meta?.compliance).toBe('passed');
    expect(out.pupil).toBeGreaterThan(1);
  });
});

describe('Layer 0 script', () => {
  it('validates and normalizes example line', () => {
    const v = validateScriptLine(SCRIPT_EXAMPLE);
    expect(v.ok).toBe(true);
    const n = normalizeScriptLine(SCRIPT_EXAMPLE);
    expect(n.primary).toBe('sad');
    expect(n.secondary).toBe('angry');
    expect(n.directions.gaze).toBe('avoid');
    expect(n.meta?.compliance).toBe('passed');
  });

  it('rejects bad gaze direction', () => {
    const v = validateScriptLine({
      text: 'hi',
      directions: { gaze: 'telepathy' },
    });
    expect(v.ok).toBe(false);
  });

  it('mood bias suppresses happy under embarrassment', () => {
    const b = applyMoodBias('happy', 1, { state: 'embarrassed', baseline_intensity: 0.5 });
    expect(b.intensity).toBeLessThan(1);
    expect(b.leakIntensity).toBeGreaterThan(0);
  });

  it('matchCompound finds catalogued pairs', () => {
    expect(matchCompound('happy', 'surprised')).toBeTruthy();
  });

  it('performScript builds speech + gaze + body', () => {
    const perf = performScript({
      line_id: 'T1',
      text: 'mama',
      dialogue_emotion: { primary: 'happy', intensity: 0.7 },
      directions: { gaze: 'camera', smile: 'reward' },
      persona: 'companion',
    });
    expect(perf.kind).toBe('script_performance');
    expect(perf.speech?.frames?.length).toBeGreaterThan(0);
    expect(perf.gaze.mode).toBe('camera');
    expect(perf.smile?.duchenne).toBe(true);
    expect(perf.body?.body).toBeTruthy();
  });

  it('resolveGazeDirection avoid uses emotion bias', () => {
    const g = resolveGazeDirection('avoid', { emotion: 'thinking' });
    expect(g.state).toBe('averted');
    expect(g.lookX).toBeGreaterThan(0);
  });
});
