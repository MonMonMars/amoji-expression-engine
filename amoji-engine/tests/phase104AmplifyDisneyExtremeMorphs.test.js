import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  amplifyDisneyExtremeMorphs,
  classifyDisneyExtremeMorphKey,
  DISNEY_EXTREME_DEFAULTS,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 104 amplifyDisneyExtremeMorphs', () => {
  it('exports defaults and helper from engine barrel', () => {
    expect(DISNEY_EXTREME_DEFAULTS.eyeFactor).toBe(1.4);
    expect(DISNEY_EXTREME_DEFAULTS.mouthFactor).toBe(1.5);
    expect(DISNEY_EXTREME_DEFAULTS.weightCap).toBe(2.0);
    expect(typeof engine.amplifyDisneyExtremeMorphs).toBe('function');
    expect(typeof engine.classifyDisneyExtremeMorphKey).toBe('function');
    expect(engine.DISNEY_EXTREME_DEFAULTS).toEqual(DISNEY_EXTREME_DEFAULTS);
  });

  it('classifies brow as eye and jaw as mouth', () => {
    expect(classifyDisneyExtremeMorphKey('Expressions_browSqueezeL_max').isEye).toBe(
      true,
    );
    expect(classifyDisneyExtremeMorphKey('Expressions_jawOpen_max').isMouth).toBe(
      true,
    );
  });

  it('amplifies eye/mouth morphs and clamps to 2.0', () => {
    const targets = {
      Expressions_eyeSquintL_max: 0.8,
      Expressions_mouthSmile_max: 0.9,
      Expressions_browsMidVert_max: 0.5,
      EMO_happy: 0.4, // untouched (not eye/mouth category)
    };
    amplifyDisneyExtremeMorphs(targets, {
      enabled: true,
      eyeFactor: 1.5,
      mouthFactor: 2.5,
      weightCap: 2.0,
    });
    expect(targets.Expressions_eyeSquintL_max).toBeCloseTo(1.2);
    expect(targets.Expressions_browsMidVert_max).toBeCloseTo(0.75);
    expect(targets.Expressions_mouthSmile_max).toBe(2.0); // clamped
    expect(targets.EMO_happy).toBe(0.4);
  });

  it('no-ops when disabled', () => {
    const targets = { Expressions_mouthSmile_max: 0.5 };
    amplifyDisneyExtremeMorphs(targets, { enabled: false, mouthFactor: 2 });
    expect(targets.Expressions_mouthSmile_max).toBe(0.5);
  });

  it('Face Live imports and calls the engine helper late in the frame', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('amplifyDisneyExtremeMorphs,');
    expect(src).toContain('amplifyDisneyExtremeMorphs(targets,');
    expect(src).toContain('enabled: disneyExtremeOn');
  });
});
