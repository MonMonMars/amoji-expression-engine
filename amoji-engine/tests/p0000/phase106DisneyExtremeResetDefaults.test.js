import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  disneyExtremeUiDefaults,
  defaultFaceLivePrefs,
} from '../../engine/ui/faceLivePrefs.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 106 Disney Extreme reset × defaults', () => {
  it('disneyExtremeUiDefaults matches prefs factory factors', () => {
    const d = defaultFaceLivePrefs();
    expect(disneyExtremeUiDefaults()).toEqual({
      disneyExtremeFactor: d.disneyExtremeFactor,
      disneyExtremeBody: d.disneyExtremeBody,
      disneyExtremeBodyFactor: d.disneyExtremeBodyFactor,
      disneyExtremeEyeFactor: d.disneyExtremeEyeFactor,
      disneyExtremeMouthFactor: d.disneyExtremeMouthFactor,
    });
    expect(typeof engine.disneyExtremeUiDefaults).toBe('function');
  });

  it('Face Live Reset button wires defaults + labels + persist', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeReset"');
    expect(src).toContain('disneyExtremeUiDefaults');
    expect(src).toContain("getElementById('btnDisneyExtremeReset')");
    expect(src).toContain('const d = disneyExtremeUiDefaults()');
    expect(src).toContain('syncDisneyExtremeFactorLabels()');
    expect(src).toContain('updateTierHintForDisneyExtreme()');
    expect(src).toContain('persistPrefs()');
  });
});
