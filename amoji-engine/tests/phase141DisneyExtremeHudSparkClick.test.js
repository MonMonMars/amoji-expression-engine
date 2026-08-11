import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 141 Extreme HUD spark click flashes ease', () => {
  it('makes HUD mini spark interactive like the panel spark', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('pointer-events: auto');
    expect(src).toContain("hudExtremeSpark?.addEventListener('click'");
    expect(src).toContain(
      "hudExtremeSpark?.addEventListener('click', () => {\n        flashDisneyExtremeEaseCurve();\n      })",
    );
    expect(src).toContain(
      "disneyExtremeBodySpark?.addEventListener('click', () => {\n        flashDisneyExtremeBodyMix();\n      })",
    );
  });
});
