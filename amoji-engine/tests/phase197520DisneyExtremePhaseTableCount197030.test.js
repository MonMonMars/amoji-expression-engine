import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 197520 Extreme phaseTableCount197030', () => {
  it('has 196608 README rows for 197030-393637', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    const rows = [...readme.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 197030 && n <= 393637);
    expect(new Set(rows).size).toBe(196608);
  });
});
