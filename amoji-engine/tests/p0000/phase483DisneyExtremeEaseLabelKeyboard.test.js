import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 483 Extreme ease label keyboard', () => {
  it('wires click/Enter/Space flash and copy on ease label', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('spark labels · ⇧Enter copy');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeEaseLabel"');
    expect(src).toContain('aria-label="Extreme ease label"');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeEaseLabel');
    expect(src).toContain('flashDisneyExtremeEaseCurve()');
    expect(src).toContain('copyDisneyExtremeEaseCurveLabel()');
  });
});
