import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 7056 Extreme phaseTableCount6566', () => {
  it('has 6144 README rows for 6566-12709', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    const rows = [...readme.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 6566 && n <= 12709);
    expect(new Set(rows).size).toBe(6144);
  });
});
