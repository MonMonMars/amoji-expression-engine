import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme persistPrefs saves keys', () => {
  it('includes disneyExtreme* fields in saveFaceLivePrefs payload', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    // Master toggles
    expect(src).toContain('disneyExtreme: !!document.getElementById(\'disneyExtreme\')?.checked');
    expect(src).toContain('disneyExtremeBody: !!document.getElementById(\'disneyExtremeBody\')?.checked');

    // Factors
    expect(src).toContain('disneyExtremeFactor: Number(');
    expect(src).toContain('disneyExtremeBodyFactor: Number(');
    expect(src).toContain('disneyExtremeEyeFactor: Number(');
    expect(src).toContain('disneyExtremeMouthFactor: Number(');
  });
});

