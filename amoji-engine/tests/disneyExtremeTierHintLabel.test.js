import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme tier hint label', () => {
  it('contains tierLabel branch for extreme deform', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('sculpt: peak + extreme deform');
  });
});

