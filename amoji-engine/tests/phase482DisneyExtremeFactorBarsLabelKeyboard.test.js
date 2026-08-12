import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 482 Extreme factor bars label keyboard', () => {
  it('wires click/Enter/Space flash and copy on factor bars label', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('spark labels · Enter/Space flash');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeFactorBarsLabel"');
    expect(src).toContain('aria-label="Extreme factor bars label"');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeFactorBarsLabel');
    expect(src).toContain('flashDisneyExtremeFactorBars()');
    expect(src).toContain('copyDisneyExtremeFactorBarsLabel()');
  });
});
