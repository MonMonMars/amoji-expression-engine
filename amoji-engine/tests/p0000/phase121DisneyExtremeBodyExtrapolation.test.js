import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  disneyExtremeBodyMix,
  evaluateBody,
  DISNEY_EXTREME_BODY_MIX_CAP,
  DISNEY_EXTREME_NECK_SCALE_BLEND,
} from '../../engine/layers/neckShoulder.js';
import * as engine from '../../engine/index.js';

const neckShoulderPath = fileURLToPath(
  new URL('../../engine/layers/neckShoulder.js', import.meta.url),
);

describe('Phase 121 Disney Extreme body extrapolation punch', () => {
  it('raises body mix cap and neck Extreme blend', () => {
    expect(DISNEY_EXTREME_BODY_MIX_CAP).toBeGreaterThan(1.35);
    expect(DISNEY_EXTREME_NECK_SCALE_BLEND).toBeGreaterThan(0.6);
    expect(disneyExtremeBodyMix(1.0)).toBe(1);
    expect(disneyExtremeBodyMix(2.0)).toBe(DISNEY_EXTREME_BODY_MIX_CAP);
    expect(disneyExtremeBodyMix(1.4)).toBeCloseTo(1.4);

    const soft = evaluateBody('happy', 1.0);
    const extreme = evaluateBody('happy', 2.0);
    expect(Math.abs(extreme.body.chestExpansion)).toBeGreaterThan(
      Math.abs(soft.body.chestExpansion),
    );
    expect(typeof engine.disneyExtremeBodyMix).toBe('function');
  });

  it('wires neck scale through DISNEY_EXTREME_NECK_SCALE_BLEND', () => {
    const src = fs.readFileSync(neckShoulderPath, 'utf8');
    expect(src).toContain('disneyExtremeBodyMix(t)');
    expect(src).toContain(
      '1 + (sample.chestScale - 1) * DISNEY_EXTREME_NECK_SCALE_BLEND',
    );
  });
});
