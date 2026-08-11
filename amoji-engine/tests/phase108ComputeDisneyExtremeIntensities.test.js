import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  computeDisneyExtremeIntensities,
  DISNEY_EXTREME_DEFAULTS,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 108 computeDisneyExtremeIntensities', () => {
  it('scales and clamps shape/body intensities', () => {
    const off = computeDisneyExtremeIntensities(0.7, { enabled: false });
    expect(off.shapeFactor).toBe(1);
    expect(off.shapeInt).toBeCloseTo(0.7);
    expect(off.bodyOn).toBe(false);
    expect(off.bodyInt).toBeCloseTo(0.7);

    const on = computeDisneyExtremeIntensities(0.8, {
      enabled: true,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
    });
    expect(on.shapeInt).toBeCloseTo(1.28);
    expect(on.bodyInt).toBeCloseTo(1.2);
    expect(on.bodyOn).toBe(true);

    const clamped = computeDisneyExtremeIntensities(1.5, {
      enabled: true,
      shapeFactor: 1.8,
      bodyOn: true,
      bodyFactor: 1.8,
    });
    expect(clamped.shapeInt).toBe(DISNEY_EXTREME_DEFAULTS.intensityCap);
    expect(clamped.bodyInt).toBe(2.0);

    const bodyOff = computeDisneyExtremeIntensities(0.9, {
      enabled: true,
      shapeFactor: 1.6,
      bodyOn: false,
      bodyFactor: 1.8,
    });
    expect(bodyOff.bodyOn).toBe(false);
    expect(bodyOff.bodyInt).toBeCloseTo(0.9);

    expect(typeof engine.computeDisneyExtremeIntensities).toBe('function');
  });

  it('Face Live uses the helper for tier hint and tick', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('computeDisneyExtremeIntensities');
    expect(src).toContain('computeDisneyExtremeIntensities(intensity');
    expect(src).toContain('computeDisneyExtremeIntensities(displayInt');
    expect(src).toContain('intensity: bodyInt');
  });
});
