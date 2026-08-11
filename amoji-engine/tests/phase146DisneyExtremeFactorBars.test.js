import { describe, expect, it } from 'vitest';
import {
  normalizeDisneyExtremeFactors,
  formatDisneyExtremeFactorBarsLabel,
  buildDisneyExtremeFactorBarsSvg,
  DISNEY_EXTREME_FACTOR_BAR_MAX,
  DISNEY_EXTREME_DEFAULTS,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 146 Extreme factor bars helpers', () => {
  it('normalizes factors and builds bars SVG + label', () => {
    const f = normalizeDisneyExtremeFactors({
      shapeFactor: 1.7,
      bodyFactor: 1.5,
      eyeFactor: 2.0,
      mouthFactor: 1.8,
      bodyOn: true,
    });
    expect(f.shape).toBeCloseTo(1.7);
    expect(f.body).toBeCloseTo(1.5);
    expect(f.eye).toBeCloseTo(2.0);
    expect(f.mouth).toBeCloseTo(1.8);
    expect(DISNEY_EXTREME_FACTOR_BAR_MAX.eye).toBe(2.2);
    expect(formatDisneyExtremeFactorBarsLabel({ enabled: false })).toContain(
      '(off)',
    );
    expect(
      formatDisneyExtremeFactorBarsLabel({
        enabled: true,
        shapeFactor: DISNEY_EXTREME_DEFAULTS.shapeFactor,
        bodyOn: true,
        bodyFactor: DISNEY_EXTREME_DEFAULTS.bodyFactor,
        eyeFactor: DISNEY_EXTREME_DEFAULTS.eyeFactor,
        mouthFactor: DISNEY_EXTREME_DEFAULTS.mouthFactor,
      }),
    ).toBe('shape×1.60 · body×1.60 · eye×1.40 · mouth×1.50');
    expect(
      formatDisneyExtremeFactorBarsLabel({
        enabled: true,
        bodyOn: false,
        shapeFactor: 1.2,
        eyeFactor: 1.1,
        mouthFactor: 1.1,
      }),
    ).toContain('body off');
    const svg = buildDisneyExtremeFactorBarsSvg({
      enabled: true,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(svg.svg).toContain('Disney Extreme factor bars');
    expect(svg.svg).toContain('<rect');
    expect(typeof engine.buildDisneyExtremeFactorBarsSvg).toBe('function');
    expect(typeof engine.formatDisneyExtremeFactorBarsLabel).toBe('function');
    expect(engine.DISNEY_EXTREME_FACTOR_BAR_MAX).toEqual(
      DISNEY_EXTREME_FACTOR_BAR_MAX,
    );
  });
});
