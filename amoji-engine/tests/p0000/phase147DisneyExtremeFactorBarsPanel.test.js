import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 147 Extreme factor bars panel wiring', () => {
  it('wires factor bars + label in Extreme panel', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeFactorBars"');
    expect(src).toContain('id="disneyExtremeFactorBarsLabel"');
    expect(src).toContain('buildDisneyExtremeFactorBarsSvg');
    expect(src).toContain('formatDisneyExtremeFactorBarsLabel');
    expect(src).toContain('.extreme-factor-bars');
    expect(src).toContain(
      "disneyExtremeFactorBars.classList.toggle('is-off', !disneyExtremeOn)",
    );
  });
});
