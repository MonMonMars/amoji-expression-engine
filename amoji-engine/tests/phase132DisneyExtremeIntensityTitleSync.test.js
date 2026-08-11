import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 132 Extreme title sync + ease spark click', () => {
  it('intensity input refreshes Extreme prefs title; spark click flashes ease', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('updateTierHintForDisneyExtreme();\n        syncDisneyExtremePrefsSummary();\n        temporal.intensity = intensity;');
    expect(src).toContain('function flashDisneyExtremeEaseCurve()');
    expect(src).toContain("disneyExtremeEaseSpark?.addEventListener('click'");
    expect(src).toContain('formatDisneyExtremeEaseCurveLabel({');
    expect(src).toContain('click to flash');
  });
});
