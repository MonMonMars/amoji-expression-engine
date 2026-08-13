import { describe, expect, it } from 'vitest';
import {
  evaluateBody,
  classifyHeadGazeCombo,
  sampleBodyPose,
  BodyController,
  THREAT_FREEZE,
} from '../../engine/layers/neckShoulder.js';
import {
  phonemeToViseme,
  normalizePhonemeEvents,
  phonemesToTimedVisemes,
  samplePhonemeTimedFrames,
  paralinguisticToHook,
} from '../../engine/layers/phonemeTiming.js';
import { performSpeech } from '../../engine/layers/performSpeech.js';

describe('Layer B neck/shoulder/breath', () => {
  it('fear has highest accessory muscle activation', () => {
    const fear = evaluateBody('fear', 1).body;
    const happy = evaluateBody('happy', 1).body;
    const think = evaluateBody('thinking', 1).body;
    expect(fear.accessoryMuscleActivation).toBeGreaterThan(happy.accessoryMuscleActivation);
    expect(fear.accessoryMuscleActivation).toBeGreaterThan(0.7);
    expect(think.accessoryMuscleActivation).toBeLessThan(0.1);
    expect(fear.breathingMode).toBe('accessory');
    expect(happy.breathingMode).toBe('diaphragm');
  });

  it('derives shoulderMicroLift from accessory × rate', () => {
    const b = evaluateBody('angry', 1).body;
    expect(b.shoulderMicroLift).toBeCloseTo(
      b.accessoryMuscleActivation * b.breathingRate,
      5,
    );
    expect(b.neckVisibleTension).toBe(b.accessoryMuscleActivation);
  });

  it('head-down + gaze lock → angry; + avoid → sad', () => {
    expect(classifyHeadGazeCombo(-0.4, { gazeLock: 0.9 })).toBe('angry_challenge');
    expect(classifyHeadGazeCombo(-0.4, { lookX: 0.8, lookY: 0.2 })).toBe('sad_submissive');
  });

  it('angry without gaze lock remaps toward sad body', () => {
    const locked = evaluateBody('angry', 1, { gazeLock: 0.95 });
    const avoided = evaluateBody('angry', 1, { lookX: 0.9, lookY: 0 });
    expect(locked.gazeCombo).toBe('angry_challenge');
    expect(avoided.emotion).toBe('sad');
    expect(avoided.body.headTiltVertical).toBeLessThan(locked.body.headTiltVertical);
  });

  it('threat freeze cuts sway; sigh boosts accessory', () => {
    const body = evaluateBody('neutral', 0.5, { threat: true, sigh: true }).body;
    expect(body.accessoryMuscleActivation).toBeGreaterThan(0.4);
    const pose = sampleBodyPose(body, 0.5, { threatFreezeT: 0.3 });
    expect(pose.swayMul).toBe(THREAT_FREEZE.swayMul);
  });

  it('BodyController ticks freeze timer', () => {
    const bc = new BodyController();
    bc.triggerThreat();
    const a = bc.tick(0.1, { emotion: 'fear', intensity: 1, gazeLock: 0.8 });
    expect(a.threatFreezeT).toBeGreaterThan(0);
    expect(a.pose.clavicleLift).toBeGreaterThan(0);
    bc.tick(1, { emotion: 'fear', intensity: 1 });
    expect(bc.threatFreezeT).toBe(0);
  });
});

describe('TTS phoneme timing', () => {
  it('maps IPA and ARPAbet to Preston Blair', () => {
    expect(phonemeToViseme('m')).toBe('MBP');
    expect(phonemeToViseme('p')).toBe('MBP');
    expect(phonemeToViseme('ɑ')).toBe('AI');
    expect(phonemeToViseme('AE1')).toBe('AI');
    expect(phonemeToViseme('sil')).toBe('REST');
    expect(phonemeToViseme('SH')).toBe('CONS');
  });

  it('normalizes mixed TTS payloads', () => {
    const events = normalizePhonemeEvents([
      { phone: 'm', start: 0.0, end: 0.08 },
      ['ɑ', 0.08, 0.2],
      { arpabet: 'P', onset: 0.2, duration: 0.07 },
      { ipa: 'ə', t: 0.27, end: 0.35 },
    ]);
    expect(events).toHaveLength(4);
    expect(events[0].viseme).toBe('MBP');
    expect(events[1].viseme).toBe('AI');
    expect(events[2].viseme).toBe('MBP');
  });

  it('builds timed visemes and samples frames with MBP closure', () => {
    const phonemes = [
      { phoneme: 'm', start: 0, end: 0.1 },
      { phoneme: 'ɑ', start: 0.1, end: 0.22 },
      { phoneme: 'm', start: 0.22, end: 0.32 },
      { phoneme: 'ɑ', start: 0.32, end: 0.45 },
    ];
    const seq = phonemesToTimedVisemes(phonemes);
    expect(seq[0].onset).toBe(0);
    expect(seq.some((s) => s.viseme === 'MBP')).toBe(true);

    const sampled = samplePhonemeTimedFrames(phonemes, {
      fps: 20,
      emotionParams: { jaw: 0.4, width: 0.5, corner: 0.3 },
      intensity: 1,
      text: 'mama',
    });
    expect(sampled.mode).toBe('phoneme_timed');
    expect(sampled.meta?.compliance).toBe('passed');
    expect(sampled.frames.length).toBeGreaterThan(5);
    // around first MBP onset jaw should be near closed
    const nearMbp = sampled.frames.find((f) => f.t >= 0.02 && f.t <= 0.08);
    expect(nearMbp?.mouth.jaw).toBeLessThan(0.15);
  });

  it('paralinguistic tags map to hooks', () => {
    expect(paralinguisticToHook('sigh').hook).toBe('sigh');
    expect(paralinguisticToHook('laughter').torsoDerivation).toBe(true);
  });

  it('performSpeech uses phoneme_timed when phonemes provided', () => {
    const perf = performSpeech('hi', 'happy', 0.8, {
      phonemes: [
        { phoneme: 'h', start: 0, end: 0.05 },
        { phoneme: 'aɪ', start: 0.05, end: 0.2 },
      ],
      paralinguistics: [{ tag: 'chuckle', t: 0.1 }],
    });
    expect(perf.mode).toBe('phoneme_timed');
    expect(perf.frames[0].meta.phonemeTimed).toBe(true);
    expect(perf.paralinguistics[0].hook).toBe('chuckle');
  });
});
