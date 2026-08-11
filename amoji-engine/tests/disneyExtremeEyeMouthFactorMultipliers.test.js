import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme eye/mouth factor multipliers', () => {
  it('applies multipliers to eye/iris and mouth morph targets when enabled', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain('id="disneyExtremeEyeFactor"');
    expect(src).toContain('id="disneyExtremeMouthFactor"');
    expect(src).toContain('amplifyDisneyExtremeMorphs');

    expect(src).toContain('amplifyDisneyExtremeMorphs(targets');
    expect(src).toContain('enabled: disneyExtremeOn');
    expect(src).toContain('eyeFactor:');
    expect(src).toContain('mouthFactor:');
  });
});

