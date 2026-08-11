import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme factor slider persist + hint', () => {
  it('wires shape factor input to tier hint and change to persistPrefs', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    // Restore must happen after savedPrefs is declared.
    const savedPrefsIdx = src.indexOf('let savedPrefs = loadFaceLivePrefs().prefs');
    const restoreIdx = src.indexOf(
      'disneyExtremeEl.checked = !!savedPrefs.disneyExtreme',
    );
    expect(savedPrefsIdx).toBeGreaterThanOrEqual(0);
    expect(restoreIdx).toBeGreaterThan(savedPrefsIdx);

    expect(src).toContain(
      "disneyExtremeFactorEl.addEventListener('input', () => {\n          syncDisneyExtremeFactorLabels();\n          updateTierHintForDisneyExtreme();\n        });",
    );
    expect(src).toContain(
      "disneyExtremeFactorEl.addEventListener('change', () => persistPrefs());",
    );
    expect(src).toContain(
      "disneyExtremeBodyFactorEl.addEventListener('change', () => persistPrefs());",
    );
    expect(src).toContain(
      "disneyExtremeEyeFactorEl?.addEventListener('change', () => persistPrefs());",
    );
    expect(src).toContain(
      "disneyExtremeMouthFactorEl?.addEventListener('change', () => persistPrefs());",
    );
  });
});
