import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme shapeInt clamp', () => {
  it('clamps shapeInt via computeDisneyExtremeIntensities', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('computeDisneyExtremeIntensities(displayInt');
    expect(src).toContain('shapeFactor:');
  });
});
