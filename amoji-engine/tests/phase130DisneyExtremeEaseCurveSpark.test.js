import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  sampleDisneyExtremeEaseCurve,
  formatDisneyExtremeEaseCurveLabel,
  buildDisneyExtremeEaseSparkSvg,
  easeEmotionIntensity,
  DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 130 Extreme ease curve spark UI', () => {
  it('samples ease curve and builds marker sparkline SVG', () => {
    const sample = sampleDisneyExtremeEaseCurve({
      steps: 5,
      markerT: 1.5,
    });
    expect(sample.points).toHaveLength(5);
    expect(sample.points[0]).toEqual({ t: 0, y: easeEmotionIntensity(0) });
    expect(sample.points[4].t).toBeCloseTo(2);
    expect(sample.marker?.y).toBeCloseTo(easeEmotionIntensity(1.5));
    expect(sample.gain).toBe(DISNEY_EXTREME_EASE_OVERDRIVE_GAIN);
    expect(formatDisneyExtremeEaseCurveLabel({ enabled: false })).toContain(
      '(off)',
    );
    expect(
      formatDisneyExtremeEaseCurveLabel({ enabled: true, markerT: 1.5 }),
    ).toBe(
      `ease ${easeEmotionIntensity(1.5).toFixed(2)} @ 1.50 · od ×${DISNEY_EXTREME_EASE_OVERDRIVE_GAIN.toFixed(2)}`,
    );
    const spark = buildDisneyExtremeEaseSparkSvg({ markerT: 1.2 });
    expect(spark.empty).toBe(false);
    expect(spark.svg).toContain('<svg');
    expect(spark.svg).toContain('<circle');
    expect(spark.svg).toContain('Disney Extreme ease curve');
    expect(typeof engine.sampleDisneyExtremeEaseCurve).toBe('function');
    expect(typeof engine.buildDisneyExtremeEaseSparkSvg).toBe('function');
    expect(typeof engine.formatDisneyExtremeEaseCurveLabel).toBe('function');
  });

  it('Face Live wires ease spark + label beside Extreme controls', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeEaseSpark"');
    expect(src).toContain('id="disneyExtremeEaseLabel"');
    expect(src).toContain('buildDisneyExtremeEaseSparkSvg');
    expect(src).toContain('formatDisneyExtremeEaseCurveLabel');
    expect(src).toContain('markerT: disneyExtremeOn ? shapeInt');
    expect(src).toContain('Shift/Alt');
  });
});
