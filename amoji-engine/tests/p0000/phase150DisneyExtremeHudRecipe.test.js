import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeLiveHud,
  disneyExtremeRecipeOverdriveScale,
  easeEmotionIntensity,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 150 Extreme live HUD recipe readout', () => {
  it('includes recipe × in status when shapeInt > 1', () => {
    const shapeInt = 1.5;
    const hud = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt,
      bodyInt: 1.2,
      bodyOn: true,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(hud.recipe).toBeCloseTo(disneyExtremeRecipeOverdriveScale(shapeInt));
    expect(hud.status).toContain(
      `recipe ×${disneyExtremeRecipeOverdriveScale(shapeInt).toFixed(2)}`,
    );
    expect(hud.status).toContain(
      `ease ${easeEmotionIntensity(shapeInt).toFixed(2)}`,
    );
    const atPeak = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1,
      bodyInt: 1,
      bodyOn: true,
    });
    expect(atPeak.recipe).toBe(1);
    expect(atPeak.status).not.toContain('recipe ×');
    expect(typeof engine.formatDisneyExtremeLiveHud).toBe('function');
  });
});
