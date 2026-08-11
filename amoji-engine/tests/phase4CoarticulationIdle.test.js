import { describe, expect, it } from 'vitest';
import {
  dominanceWeight,
  timedVisemeSequence,
  resolveMouthAtTime,
  resolveArticulatorAtTime,
  sampleCoarticulatedFrames,
  peakVisemeAt,
} from '../engine/layers/coarticulation.js';
import { performSpeech } from '../engine/layers/performSpeech.js';
import {
  evaluateIdle,
  IdleController,
  pickIdleVariant,
  resolveBreath,
  PERSONAS,
  VARIANT_ROTATE_SEC,
} from '../engine/layers/idleMode.js';

describe('Cohen-Massaro coarticulation', () => {
  it('U anticipates earlier than CONS (lower anticipatoryRate → more look-ahead)', () => {
    // at 120ms before onset, U width should outweigh CONS
    const u = dominanceWeight('U', 'width', -0.12);
    const cons = dominanceWeight('CONS', 'width', -0.12);
    expect(u).toBeGreaterThan(cons);
  });

  it('stew-like sequence: U rounds lips during preceding consonants', () => {
    // s t e w → CONS CONS E U
    const seq = timedVisemeSequence('stew', { charDuration: 0.1 });
    // during 't' (onset 0.1), sample mid-consonant — U should pull width down toward pout
    const atT = 0.12;
    const width = resolveArticulatorAtTime(seq, atT, 'width');
    const uTarget = 0.6; // U LOCKED width
    // without coarticulation, CONS width target is 1.0; with U anticipation, blend < 1
    expect(width.value).toBeLessThan(0.95);
    expect(width.value).toBeGreaterThan(uTarget - 0.15);
  });

  it('MBP keeps jaw closed when bilabial dominates', () => {
    const seq = timedVisemeSequence('mama', { charDuration: 0.1 });
    const atM = 0.05; // peak of first M
    const mouth = resolveMouthAtTime(seq, atM, {}, 1);
    expect(mouth.jaw).toBe(0);
  });

  it('sampleCoarticulatedFrames returns continuous timeline', () => {
    const { frames, duration, fps } = sampleCoarticulatedFrames('hi', {
      fps: 20,
      charDuration: 0.1,
    });
    expect(fps).toBe(20);
    expect(duration).toBeGreaterThan(0.2);
    expect(frames.length).toBeGreaterThan(5);
    expect(frames[0].mouth.coarticulated).toBe(true);
  });

  it('performSpeech coarticulated mode tags frames', () => {
    const perf = performSpeech('mama', 'happy', 1, { mode: 'coarticulated', fps: 20 });
    expect(perf.mode).toBe('coarticulated');
    expect(perf.frames.length).toBeGreaterThan(3);
    const mbpish = perf.frames.filter((f) => f.meta?.mouth?.jaw === 0);
    expect(mbpish.length).toBeGreaterThan(0);
    expect(perf.frames[0].meta.lowerFaceFrom).toBe('cohen_massaro_dominance');
  });

  it('discrete mode remains default', () => {
    const perf = performSpeech('mama', 'happy', 1);
    expect(perf.mode).toBe('discrete');
    expect(perf.frames).toHaveLength(4);
  });

  it('peakVisemeAt finds active label', () => {
    const seq = timedVisemeSequence('o', { charDuration: 0.1 });
    expect(peakVisemeAt(seq, 0.02)).toBe('O');
  });
});

describe('Layer I idle / personas', () => {
  it('catalog has five personas', () => {
    expect(Object.keys(PERSONAS).sort()).toEqual(
      ['care', 'companion', 'corporate', 'education', 'home'].sort(),
    );
  });

  it('corporate breathes calmer/shallower than companion', () => {
    const corp = resolveBreath('corporate', 'calm');
    const comp = resolveBreath('companion', 'calm');
    expect(corp.breathDepth).toBeLessThan(comp.breathDepth);
    expect(corp.bpm).toBeLessThan(comp.bpm);
  });

  it('arousal ladder raises bpm when tense', () => {
    const calm = resolveBreath('companion', 'calm');
    const tense = resolveBreath('companion', 'tense');
    expect(tense.bpm).toBeGreaterThan(calm.bpm);
    expect(tense.accessoryMuscleActivation).toBeGreaterThan(calm.accessoryMuscleActivation);
  });

  it('90s rule rotates idle variants', () => {
    expect(VARIANT_ROTATE_SEC).toBe(90);
    const a = pickIdleVariant('companion', 10);
    const b = pickIdleVariant('companion', 95);
    expect(a.variant).not.toBe(b.variant);
  });

  it('evaluateIdle returns channels + compliance', () => {
    const idle = evaluateIdle(1.5, { personaId: 'companion', arousal: 'calm' });
    expect(idle.meta?.compliance).toBe('passed');
    expect(idle.channels.scalePulse).toBeGreaterThan(0.9);
    expect(idle.breath.bpm).toBeGreaterThan(10);
  });

  it('IdleController accumulates elapsed', () => {
    const c = new IdleController({ personaId: 'home', arousal: 'alert' });
    c.tick(1);
    const s = c.tick(1);
    expect(c.elapsed).toBeCloseTo(2);
    expect(s.personaId).toBe('home');
    expect(s.arousal).toBe('alert');
  });
});
