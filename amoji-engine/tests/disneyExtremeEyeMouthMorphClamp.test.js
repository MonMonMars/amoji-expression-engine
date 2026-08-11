import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme eye/mouth morph weight clamp', () => {
  it('clamps amplified eye/mouth morphs to 2.0', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('amplifyDisneyExtremeMorphs(targets');
    expect(src).toContain('eyeFactor:');
    expect(src).toContain('mouthFactor:');
  });
});
