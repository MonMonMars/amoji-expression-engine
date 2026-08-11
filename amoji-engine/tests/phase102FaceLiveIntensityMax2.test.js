import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Intensity slider max extended', () => {
  it('has intensity slider max="2"', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="intensity" type="range" min="0" max="2"');
  });
});

