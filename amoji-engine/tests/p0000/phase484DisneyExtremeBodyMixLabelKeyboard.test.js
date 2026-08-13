import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 484 Extreme body mix label keyboard', () => {
  it('wires click/Enter/Space flash and copy on body mix label', () => {
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeBodyMixLabel"');
    expect(src).toContain('aria-label="Extreme body mix label"');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeBodyMixLabelEl');
    expect(src).toContain('flashDisneyExtremeBodyMix()');
    expect(src).toContain('copyDisneyExtremeBodyMixLabel()');
  });
});
