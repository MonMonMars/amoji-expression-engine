import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 487 Extreme more IO summary keyboard', () => {
  it('wires more summary flash/copy and aria metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('more IO summary · Enter/Space flash');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeMoreSummary"');
    expect(src).toContain('aria-label="Extreme more IO summary"');
    expect(src).toContain('function copyDisneyExtremeMoreIoSummary');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(moreSummary');
  });
});
