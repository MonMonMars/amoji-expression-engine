import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  summarizeDisneyExtremePrefs,
  defaultFaceLivePrefs,
} from '../../engine/ui/faceLivePrefs.js';
import { formatPrefsLandingSummary } from '../../engine/ui/prefsLandingToast.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 110 summarizeDisneyExtremePrefs + residual helper', () => {
  it('summarizes Extreme prefs off/on and lands in prefs toast', () => {
    expect(summarizeDisneyExtremePrefs(defaultFaceLivePrefs())).toBe('X off');
    const on = summarizeDisneyExtremePrefs({
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
    });
    expect(on).toBe(
      'X on · shape×1.60 · body×1.60 · eye×1.40 · mouth×1.50 · od×1.45 · ease 1.17 · recipe ×1.10 · mix 1.12 · neck 0.75',
    );
    expect(
      summarizeDisneyExtremePrefs({
        disneyExtreme: true,
        disneyExtremeBody: false,
      }),
    ).toContain('body off');
    expect(
      formatPrefsLandingSummary({
        emotion: 'happy',
        disneyExtreme: true,
        disneyExtremeFactor: 1.7,
      }),
    ).toContain('X on · shape×1.70');
    expect(typeof engine.summarizeDisneyExtremePrefs).toBe('function');
  });

  it('Face Live residual + title use Extreme helpers', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('summarizeDisneyExtremePrefs');
    expect(src).toContain('function syncDisneyExtremePrefsSummary');
    expect(src).toContain('disneyExtremeStatus.title = summarizeDisneyExtremePrefs');
    expect(src).toContain(
      'computeDisneyExtremeIntensities(\n            residualTune.intensity',
    );
  });
});
