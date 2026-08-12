import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 1548 Extreme phaseTableCount1190', () => {
  it('has 768 README rows for 1190-1957', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    const rows = [...readme.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 1190 && n <= 1957);
    expect(new Set(rows).size).toBe(768);
  });
});
