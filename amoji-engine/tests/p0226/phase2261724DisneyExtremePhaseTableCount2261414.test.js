import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2261724 Extreme phaseTableCount2261414', () => {
  it('has 24576 phase-doc rows for 2261414-2285989', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    const rows = [...readme.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 2261414 && n <= 2285989);
    expect(new Set(rows).size).toBe(24576);
  }, 30000);
});
