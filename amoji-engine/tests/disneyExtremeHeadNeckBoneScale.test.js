import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const neckShoulderPath = fileURLToPath(
  new URL('../engine/layers/neckShoulder.js', import.meta.url),
);

describe('Disney Extreme head/neck bone scaling', () => {
  it('scales head + neck bones when boneMap supports scaling', () => {
    const src = fs.readFileSync(neckShoulderPath, 'utf8');
    expect(src).toContain('head?.scale?.setScalar');
    expect(src).toContain('head.scale.setScalar(sample.chestScale)');
    expect(src).toContain('neck?.scale?.setScalar');
    expect(src).toContain(
      'neck.scale.setScalar(1 + (sample.chestScale - 1) * 0.6)',
    );
  });
});

