import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 105 Disney Extreme factor value labels + bodyInt HUD', () => {
  it('renders live value spans for shape/body/eye/mouth factors', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeFactorVal"');
    expect(src).toContain('id="disneyExtremeBodyFactorVal"');
    expect(src).toContain('id="disneyExtremeEyeFactorVal"');
    expect(src).toContain('id="disneyExtremeMouthFactorVal"');
    expect(src).toContain('function syncDisneyExtremeFactorLabels()');
    expect(src).toContain('syncDisneyExtremeFactorLabels();');
  });

  it('updates labels on factor input and shows bodyInt in body HUD', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeFactorEl.addEventListener(\'input\'');
    expect(src).toContain('disneyExtremeBodyFactorEl.addEventListener(\'input\'');
    expect(src).toContain('disneyExtremeEyeFactorEl?.addEventListener(\'input\'');
    expect(src).toContain('disneyExtremeMouthFactorEl?.addEventListener(\'input\'');
    expect(src).toContain('bodyInt ${bodyInt.toFixed(2)}');
    expect(src).toContain('`${b.breathingMode} · ${bodyInt.toFixed(2)}`');
  });
});
