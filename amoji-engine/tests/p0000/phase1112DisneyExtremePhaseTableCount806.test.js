import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 1112 Extreme phaseTableCount806', () => {
  it('has 384 README rows for 806-1189', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    const rows = [...readme.matchAll(/\| Phase (8\d\d|9\d\d|10\d\d|11\d\d) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 806 && n <= 1189);
    expect(new Set(rows).size).toBe(384);
  });
});
