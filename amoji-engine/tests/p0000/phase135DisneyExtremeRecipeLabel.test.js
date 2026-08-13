import { describe, expect, it } from 'vitest';
import {
  disneyExtremeRecipeOverdriveScale,
  formatDisneyExtremeEaseCurveLabel,
  DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN,
  easeEmotionIntensity,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 135 Extreme ease label recipe punch', () => {
  it('reports recipe overdrive scale above peak and in ease label', () => {
    expect(disneyExtremeRecipeOverdriveScale(0.8)).toBe(1);
    expect(disneyExtremeRecipeOverdriveScale(1)).toBe(1);
    expect(disneyExtremeRecipeOverdriveScale(1.5)).toBeCloseTo(
      1 + 0.5 * DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN,
    );
    const label = formatDisneyExtremeEaseCurveLabel({
      enabled: true,
      markerT: 1.6,
    });
    expect(label).toContain(`ease ${easeEmotionIntensity(1.6).toFixed(2)}`);
    expect(label).toContain(
      `recipe ×${disneyExtremeRecipeOverdriveScale(1.6).toFixed(2)}`,
    );
    expect(
      formatDisneyExtremeEaseCurveLabel({ enabled: true, markerT: 0.9 }),
    ).not.toContain('recipe ×');
    expect(typeof engine.disneyExtremeRecipeOverdriveScale).toBe('function');
  });
});
