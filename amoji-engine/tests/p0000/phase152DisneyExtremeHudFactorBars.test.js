import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 152 Extreme HUD mini factor bars', () => {
  it('renders compact factor bars beside the X pill', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="hudExtremeFactors"');
    expect(src).toContain('.hud-extreme-factors');
    expect(src).toContain(
      "hudExtremeFactors.classList.toggle('is-off', !disneyExtremeOn)",
    );
    expect(src).toContain('buildDisneyExtremeFactorBarsSvg({\n              enabled: disneyExtremeOn');
    expect(src).toContain('width: 56');
    expect(src).toContain('height: 20');
  });
});
