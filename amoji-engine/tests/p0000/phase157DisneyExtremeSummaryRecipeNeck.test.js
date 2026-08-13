import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../../engine/ui/faceLivePrefs.js';
import {
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 157 Extreme summary recipe + neck', () => {
  it('appends recipe when overdrive and neck when body on', () => {
    const text = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.7,
    });
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(text).toContain(`recipe ×${snap.recipe.toFixed(2)}`);
    expect(text).toContain(`neck ${snap.neckBlend.toFixed(2)}`);
    expect(text).toContain(`mix ${snap.bodyMix.toFixed(2)}`);
    const noBody = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeBody: false,
      intensity: 1.0,
      disneyExtremeFactor: 1.5,
    });
    expect(noBody).toContain('body off');
    expect(noBody).toContain('recipe ×');
    expect(noBody).not.toContain('neck ');
    expect(typeof engine.summarizeDisneyExtremePrefs).toBe('function');
  });
});
