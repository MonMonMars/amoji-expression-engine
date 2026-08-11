import { describe, expect, it } from 'vitest';
import { sampleHappyTake } from '../tools/capture-bake/fixtures/sample-happy-take.mjs';
import { bakeCaptureTake } from '../engine/capture/captureBake.js';
import {
  envelopeToTimingRow,
  mergeTemporalEnvelopes,
} from '../engine/capture/temporalMerge.js';
import timingDoc from '../data/temporal/emotion-timing.json' with { type: 'json' };
import {
  getEmotionTiming,
  STEP_OUT_DURATION,
  ATTACK_DURATION,
  BLINK_RATE,
  attackCurve,
  TemporalLayer,
} from '../engine/layers/temporalLayer.js';

describe('emotion-timing table', () => {
  it('loads step-out / attack / blink from JSON', () => {
    expect(STEP_OUT_DURATION.happy).toBe(timingDoc.emotions.happy.stepOutSec);
    expect(ATTACK_DURATION.surprised).toBeLessThan(ATTACK_DURATION.sad);
    expect(BLINK_RATE.surprised).toBeLessThan(BLINK_RATE.angry);
    expect(getEmotionTiming('happy').leakBias).toBe(0.12);
  });

  it('attackCurve rises 0→1', () => {
    expect(attackCurve(0, 0.5)).toBeCloseTo(0);
    expect(attackCurve(0.5, 0.5)).toBeCloseTo(1);
    expect(attackCurve(0.25, 0.5)).toBeGreaterThan(0.4);
    expect(attackCurve(0.25, 0.5)).toBeLessThan(0.7);
  });

  it('TemporalLayer ramps attack on emotion change', () => {
    const layer = new TemporalLayer();
    layer.setEmotion('happy', 1, { skipAttack: false });
    expect(layer.attackDur).toBeGreaterThan(0.3);
    const early = layer.tick(0.05);
    expect(early.attackWeight).toBeLessThan(0.35);
    expect(early.displayIntensity).toBeLessThan(0.35);
    // finish attack
    for (let i = 0; i < 40; i++) layer.tick(0.05);
    const done = layer.tick(0.05);
    expect(done.attackWeight).toBe(1);
    expect(done.displayIntensity).toBeCloseTo(1, 2);
  });
});

describe('mergeTemporalEnvelopes', () => {
  it('folds bake envelope into timing row', () => {
    const bake = bakeCaptureTake(sampleHappyTake, { emotion: 'happy' });
    const { row } = envelopeToTimingRow({
      ...bake.envelope,
      emotion: 'happy',
    });
    expect(row.attackSec).toBeCloseTo(bake.envelope.apexSec - bake.envelope.onsetSec, 2);
    expect(row.stepOutSec).toBeCloseTo(bake.envelope.suggestedStepOutSec, 2);
    expect(row.source).toBe('capture-bake');
    expect(row.blinkDurationSec).toBeLessThan(0.2);

    const merged = mergeTemporalEnvelopes(timingDoc, bake, { overwrite: true });
    expect(merged.emotions.happy.source).toBe('capture-bake');
    expect(merged.emotions.happy.leakBias).toBe(timingDoc.emotions.happy.leakBias);
    expect(merged.emotions.happy.envelope.onsetSec).toBe(bake.envelope.onsetSec);
    expect(merged._updated).toContain('happy');
  });
});
