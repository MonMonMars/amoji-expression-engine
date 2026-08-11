import { describe, expect, it } from 'vitest';
import {
  normalizeFaceLivePrefs,
  defaultFaceLivePrefs,
} from '../engine/ui/faceLivePrefs.js';

describe('faceLivePrefs Disney Extreme normalize', () => {
  it('clamps intensity to 2.0 and factors to their safe ranges', () => {
    const base = defaultFaceLivePrefs();
    const out = normalizeFaceLivePrefs({
      intensity: 9,
      disneyExtreme: true,
      disneyExtremeFactor: 9,
      disneyExtremeBodyFactor: 0.5,
      disneyExtremeEyeFactor: 99,
      disneyExtremeMouthFactor: 0.1,
    });

    expect(out.intensity).toBe(2.0);
    expect(out.disneyExtreme).toBe(true);
    expect(out.disneyExtremeFactor).toBeLessThanOrEqual(1.8);
    expect(out.disneyExtremeBodyFactor).toBeGreaterThanOrEqual(1);
    expect(out.disneyExtremeEyeFactor).toBeLessThanOrEqual(2.2);
    expect(out.disneyExtremeMouthFactor).toBeGreaterThanOrEqual(1);
    expect(base.disneyExtremeFactor).toBe(1.6);
  });
});

