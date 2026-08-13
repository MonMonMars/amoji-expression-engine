import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeLiveHudFromSnapshot,
  formatDisneyExtremeLiveHud,
  easeEmotionIntensity,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 158 Extreme HUD from snapshot', () => {
  it('maps snapshot into live HUD pill/status', () => {
    expect(formatDisneyExtremeLiveHudFromSnapshot(null)).toEqual(
      formatDisneyExtremeLiveHud({ enabled: false }),
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1.0,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const hud = formatDisneyExtremeLiveHudFromSnapshot(snap);
    expect(hud.pill).toContain(`e${easeEmotionIntensity(snap.shapeInt).toFixed(2)}`);
    expect(hud.pill).toContain(`m${snap.bodyMix.toFixed(2)}`);
    expect(hud.ease).toBeCloseTo(snap.ease);
    expect(hud.recipe).toBeCloseTo(snap.recipe);
    expect(hud.neckBlend).toBe(snap.neckBlend);
    expect(hud.status).toContain(`neck ${snap.neckBlend.toFixed(2)}`);
    expect(typeof engine.formatDisneyExtremeLiveHudFromSnapshot).toBe(
      'function',
    );
  });
});
