import { describe, expect, it } from 'vitest';
import {
  sampleDisneyExtremeBodyMixCurve,
  formatDisneyExtremeBodyMixLabel,
  buildDisneyExtremeBodyMixSparkSvg,
  disneyExtremeBodyMix,
  DISNEY_EXTREME_BODY_MIX_CAP,
  DISNEY_EXTREME_NECK_SCALE_BLEND,
} from '../../engine/layers/neckShoulder.js';
import * as engine from '../../engine/index.js';

describe('Phase 138 Extreme body mix curve helpers', () => {
  it('samples body mix curve up to cap and builds SVG', () => {
    const sample = sampleDisneyExtremeBodyMixCurve({
      steps: 5,
      markerT: 1.8,
    });
    expect(sample.points).toHaveLength(5);
    expect(sample.points[0]).toEqual({ t: 0, y: 0 });
    expect(sample.marker?.y).toBeCloseTo(DISNEY_EXTREME_BODY_MIX_CAP);
    expect(sample.cap).toBe(DISNEY_EXTREME_BODY_MIX_CAP);
    expect(disneyExtremeBodyMix(1.2)).toBeCloseTo(1.2);
    expect(disneyExtremeBodyMix(1.9)).toBe(DISNEY_EXTREME_BODY_MIX_CAP);
    expect(formatDisneyExtremeBodyMixLabel({ enabled: false })).toContain(
      '(off)',
    );
    expect(
      formatDisneyExtremeBodyMixLabel({
        enabled: true,
        bodyOn: true,
        markerT: 1.2,
      }),
    ).toBe(
      `mix 1.20 @ 1.20 · cap ${DISNEY_EXTREME_BODY_MIX_CAP.toFixed(2)} · neck ${DISNEY_EXTREME_NECK_SCALE_BLEND.toFixed(2)}`,
    );
    const spark = buildDisneyExtremeBodyMixSparkSvg({ markerT: 1.1 });
    expect(spark.svg).toContain('Disney Extreme body mix curve');
    expect(spark.svg).toContain('<circle');
    expect(typeof engine.sampleDisneyExtremeBodyMixCurve).toBe('function');
    expect(typeof engine.buildDisneyExtremeBodyMixSparkSvg).toBe('function');
    expect(typeof engine.formatDisneyExtremeBodyMixLabel).toBe('function');
  });
});
