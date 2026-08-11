import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme bodyInt clamp + wiring', () => {
  it('computes bodyInt via helper and passes it to bodyCtl.tick', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain('computeDisneyExtremeIntensities(displayInt');
    expect(src).toContain('bodyOn:');
    expect(src).toContain('bodyFactor:');
    expect(src).toContain('intensity: bodyInt');
    const bodyTickIdx = src.indexOf('const bodyState = bodyCtl.tick');
    expect(bodyTickIdx).toBeGreaterThanOrEqual(0);
    const bodySlice = src.slice(bodyTickIdx, Math.min(src.length, bodyTickIdx + 500));
    expect(bodySlice).toContain('intensity: bodyInt');
  });
});
