import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  summarizeDisneyExtremePrefs,
} from '../engine/ui/faceLivePrefs.js';
import {
  easeEmotionIntensity,
  computeDisneyExtremeIntensities,
  DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 131 Extreme summary includes ease + od', () => {
  it('appends overdrive gain and eased shapeInt', () => {
    const intensity = 1.0;
    const shapeFactor = 1.5;
    const { shapeInt } = computeDisneyExtremeIntensities(intensity, {
      enabled: true,
      shapeFactor,
      bodyOn: true,
      bodyFactor: 1.6,
    });
    const text = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeFactor: shapeFactor,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity,
    });
    expect(text).toContain(
      `od×${DISNEY_EXTREME_EASE_OVERDRIVE_GAIN.toFixed(2)}`,
    );
    expect(text).toContain(
      `ease ${easeEmotionIntensity(shapeInt).toFixed(2)}`,
    );
    expect(typeof engine.summarizeDisneyExtremePrefs).toBe('function');
  });

  it('Face Live Copy / title pass intensity into summary', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeMouthFactorEl?.value || 1.5,\n            ),\n            intensity,\n          }');
    expect(src).toContain(
      'disneyExtremeMouthFactorEl?.value || 1.5,\n          ),\n          intensity,\n        });',
    );
  });
});
