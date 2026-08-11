import { describe, expect, it } from 'vitest';
import { sampleHappyTake } from '../tools/capture-bake/fixtures/sample-happy-take.mjs';
import {
  parseCaptureTake,
  expressionEnergy,
  detectTemporalEnvelope,
  arkitToMorphWeights,
  arkitToMuscleHints,
  bakeCaptureTake,
  mergeRecipeFragment,
  detectBlinks,
  CAPTURE_PROTOCOL,
  BAKE_PROTOCOL,
} from '../engine/capture/captureBake.js';

describe('parseCaptureTake', () => {
  it('parses structured take with timing', () => {
    const take = parseCaptureTake(sampleHappyTake, { emotion: 'happy' });
    expect(take.protocol).toBe(CAPTURE_PROTOCOL);
    expect(take.frameCount).toBeGreaterThan(60);
    expect(take.durationSec).toBeGreaterThan(1.5);
    expect(take.frames[0].blendShapes.mouthSmileLeft).toBeDefined();
    expect(take.meta?.compliance).toBe('passed');
  });

  it('parses NDJSON string', () => {
    const ndjson = sampleHappyTake.frames
      .slice(0, 10)
      .map((f) => JSON.stringify(f))
      .join('\n');
    const take = parseCaptureTake(ndjson, { fps: 60 });
    expect(take.frameCount).toBe(10);
  });
});

describe('temporal envelope', () => {
  it('finds onset before apex before offset on happy take', () => {
    const take = parseCaptureTake(sampleHappyTake);
    const series = take.frames.map((f) => ({
      t: f.t,
      energy: expressionEnergy(f.blendShapes),
    }));
    const env = detectTemporalEnvelope(series);
    expect(env.valid).toBe(true);
    expect(env.onsetSec).toBeLessThan(env.apexSec);
    expect(env.apexSec).toBeLessThan(env.offsetSec);
    expect(env.peakEnergy).toBeGreaterThan(0.15);
  });

  it('detects the mid-hold blink', () => {
    const take = parseCaptureTake(sampleHappyTake);
    const blinks = detectBlinks(take);
    expect(blinks.length).toBeGreaterThanOrEqual(1);
    expect(blinks[0].t).toBeGreaterThan(0.7);
    expect(blinks[0].t).toBeLessThan(1.2);
  });
});

describe('arkit invert', () => {
  it('maps smile channels to Expression mouth smile morphs', () => {
    const morphs = arkitToMorphWeights({
      mouthSmileLeft: 0.9,
      mouthSmileRight: 0.85,
      eyeSquintLeft: 0.4,
      eyeSquintRight: 0.35,
    });
    const smileKeys = Object.keys(morphs).filter((k) =>
      /mouthSmile|eyeSquint/i.test(k),
    );
    expect(smileKeys.length).toBeGreaterThan(0);
    expect(Math.max(...Object.values(morphs))).toBeGreaterThan(0.3);
  });

  it('maps smile to M10 muscle hint', () => {
    const muscles = arkitToMuscleHints({
      mouthSmileLeft: 0.8,
      mouthSmileRight: 0.8,
    });
    expect(muscles.M10).toBeGreaterThan(0.5);
  });
});

describe('bakeCaptureTake', () => {
  it('emits recipe fragment with three tiers and rising energy', () => {
    const bake = bakeCaptureTake(sampleHappyTake, { emotion: 'happy' });
    expect(bake.protocol).toBe(BAKE_PROTOCOL);
    expect(bake.authoringOnly).toBe(true);
    expect(bake.recipeFragment.happy.subtle).toBeTruthy();
    expect(bake.recipeFragment.happy.medium).toBeTruthy();
    expect(bake.recipeFragment.happy.peak).toBeTruthy();
    expect(bake.tiers.peak.energy).toBeGreaterThan(bake.tiers.subtle.energy);
    expect(bake.envelope.suggestedStepOutSec).toBeGreaterThan(0.2);
    expect(bake.energyCurve.length).toBeGreaterThan(10);
    // peak should carry smile morphs
    const peakVals = Object.values(bake.recipeFragment.happy.peak);
    expect(peakVals.some((v) => v > 0.2)).toBe(true);
  });

  it('requires emotion id', () => {
    expect(() => bakeCaptureTake(sampleHappyTake, /** @type {any} */ ({}))).toThrow(
      /emotion/,
    );
  });

  it('mergeRecipeFragment refuses overwrite by default', () => {
    const bake = bakeCaptureTake(sampleHappyTake, { emotion: 'happy' });
    const existing = {
      version: 1,
      recipes: { happy: { subtle: {}, medium: {}, peak: {} } },
    };
    expect(() => mergeRecipeFragment(existing, bake.recipeFragment)).toThrow(
      /already exists/,
    );
    const merged = mergeRecipeFragment(existing, bake.recipeFragment, {
      overwrite: true,
    });
    expect(Object.keys(merged.recipes.happy.peak).length).toBeGreaterThan(0);
  });
});
