import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 13200 Extreme phaseTableCount12710', () => {
  it('has 12288 README rows for 12710-24997', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    const rows = [...readme.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 12710 && n <= 24997);
    expect(new Set(rows).size).toBe(12288);
  });
});
