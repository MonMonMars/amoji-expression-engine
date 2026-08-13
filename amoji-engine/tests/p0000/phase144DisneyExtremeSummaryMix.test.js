import { describe, expect, it } from 'vitest';
import {
  summarizeDisneyExtremePrefs,
} from '../../engine/ui/faceLivePrefs.js';
import {
  computeDisneyExtremeIntensities,
} from '../../engine/layers/emotionMorphs.js';
import { disneyExtremeBodyMix } from '../../engine/layers/neckShoulder.js';
import * as engine from '../../engine/index.js';

describe('Phase 144 Extreme summary includes body mix', () => {
  it('appends mix when body apply is on; omits when off', () => {
    const intensity = 1.0;
    const bodyFactor = 1.5;
    const { bodyInt } = computeDisneyExtremeIntensities(intensity, {
      enabled: true,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor,
    });
    const on = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeFactor: 1.5,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: bodyFactor,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity,
    });
    expect(on).toContain(
      `mix ${disneyExtremeBodyMix(bodyInt).toFixed(2)}`,
    );
    const off = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeBody: false,
      intensity: 1.0,
    });
    expect(off).toContain('body off');
    expect(off).not.toMatch(/mix \d/);
    expect(typeof engine.summarizeDisneyExtremePrefs).toBe('function');
  });
});
